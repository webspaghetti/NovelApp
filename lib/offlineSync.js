import {openDB} from 'idb';


const DB_NAME = 'offline-sync-db';
const STORE_NAME = 'pending-requests';
const DB_VERSION = 1;


// Initialize the database
async function initDB() {
    try {
        return await openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                }
            },
        });
    } catch (error) {
        console.error("Failed to initialize DB:", error);
        throw error;
    }
}


// Add a request to the queue
export async function queueRequest(url, options, metadata = {}) {
    try {
        const db = await initDB();
        const request = {
            url,
            options: {
                method: options.method,
                headers: options.headers,
                body: options.body,
            },
            metadata,
            timestamp: Date.now(),
        };

        return await db.add(STORE_NAME, request);
    } catch (error) {
        console.error("Failed to queue request:", error);
        throw error;
    }
}


// Get all pending requests
export async function getPendingRequests() {
    try {
        const db = await initDB();
        return await db.getAll(STORE_NAME);
    } catch (error) {
        console.error("Failed to get pending requests:", error);
        return [];
    }
}


// Remove a request from the queue
export async function removeRequest(id) {
    try {
        const db = await initDB();
        await db.delete(STORE_NAME, id);
    } catch (error) {
        console.error("Failed to remove request:", error);
    }
}


// Sync all pending requests
export async function syncPendingRequests() {
    if (!navigator.onLine) {
        return { success: false, synced: 0, failed: 0 };
    }

    const pendingRequests = await getPendingRequests();

    if (pendingRequests.length === 0) {
        return { success: true, synced: 0, failed: 0 };
    }

    let synced = 0;
    let failed = 0;
    const errors = [];

    for (const request of pendingRequests) {
        try {
            const response = await fetch(request.url, request.options);

            if (response.ok) {
                await removeRequest(request.id);
                synced++;
            } else {
                failed++;
                const errorText = await response.text();
                console.error(`Failed to sync request ${request.id}:`, response.status, errorText);
                errors.push({ id: request.id, status: response.status, error: errorText });
            }
        } catch (error) {
            failed++;
            console.error(`Error syncing request ${request.id}:`, error);
            errors.push({ id: request.id, error: error.message });
        }
    }

    return { success: true, synced, failed, errors };
}


// Wrapper function for making API calls with offline support
export async function offlineCapableFetch(url, options = {}, metadata = {}) {
    if (navigator.onLine) {
        try {
            return await fetch(url, options);
        } catch (error) {
            // If fetch fails while "online", queue it
            console.warn("Fetch failed while online, queueing for later:", error.message);
            await queueRequest(url, options, metadata);
            throw error;
        }
    } else {
        // Queue the request for later
        await queueRequest(url, options, metadata);

        // Return a mock response
        return new Response(JSON.stringify({
            queued: true,
            message: 'Request queued for sync when online'
        }), {
            status: 202,
            statusText: 'Accepted',
            headers: { 'Content-Type': 'application/json' }
        });
    }
}