"use client"
import { useState, useEffect, useCallback, useRef } from 'react';
import { getPendingRequests, syncPendingRequests } from "@/lib/offlineSync";


export function useOfflineSync() {
    const [isOnline, setIsOnline] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
    const [lastSyncResult, setLastSyncResult] = useState(null);
    const syncTimeoutRef = useRef(null);
    const hasInitialSyncRun = useRef(false);


    // Update pending count
    const updatePendingCount = useCallback(async () => {
        try {
            const requests = await getPendingRequests();
            setPendingCount(requests.length);
            return requests.length;
        } catch (error) {
            console.error("Failed to update pending count:", error);
            return 0;
        }
    }, []);


    // Sync handler - stable function that doesn't depend on state
    async function performSync() {
        if (!navigator.onLine) {
            return { success: false, synced: 0, failed: 0 };
        }

        setIsSyncing(true);

        try {
            const result = await syncPendingRequests();
            setLastSyncResult(result);

            // Update pending count after sync
            const requests = await getPendingRequests();
            setPendingCount(requests.length);

            return result;
        } catch (error) {
            console.error("Sync failed:", error);
            return { success: false, synced: 0, failed: 0, error: error.message };
        } finally {
            setIsSyncing(false);
        }
    }


    // Manual sync function
    const sync = useCallback(() => {
        return performSync();
    }, []);


    // Handle online/offline events
    useEffect(() => {
        function handleOnline() {
            setIsOnline(true);

            // Clear any existing timeout
            if (syncTimeoutRef.current) {
                clearTimeout(syncTimeoutRef.current);
            }

            // Wait a bit for connection to stabilize, then sync
            syncTimeoutRef.current = setTimeout(() => {
                performSync();
            }, 1000);
        }

        function handleOffline() {
            setIsOnline(false);

            // Clear any pending sync
            if (syncTimeoutRef.current) {
                clearTimeout(syncTimeoutRef.current);
            }
        }

        // Set initial state
        const initialOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
        setIsOnline(initialOnline);

        // Initial check: Update pending count and sync if online and has pending
        async function initialCheck() {
            const count = await updatePendingCount();

            if (initialOnline && count > 0 && !hasInitialSyncRun.current) {
                hasInitialSyncRun.current = true;

                // Wait a moment for app to settle, then sync
                setTimeout(() => {
                    performSync();
                }, 500);
            }
        }

        initialCheck();

        // Add event listeners
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);

            // Clear timeout on cleanup
            if (syncTimeoutRef.current) {
                clearTimeout(syncTimeoutRef.current);
            }
        };
    }, [updatePendingCount]);


    return {
        isOnline,
        isSyncing,
        pendingCount,
        lastSyncResult,
        sync,
        updatePendingCount,
    };
}