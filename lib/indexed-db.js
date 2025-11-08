const DB_NAME = 'NovelReaderDB';
const DB_VERSION = 1;
const CHAPTERS_STORE = 'chapters';

export function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Create chapters store if it doesn't exist
            if (!db.objectStoreNames.contains(CHAPTERS_STORE)) {
                const chaptersStore = db.createObjectStore(CHAPTERS_STORE, {
                    keyPath: 'id'
                });
                // Create indexes for efficient querying
                chaptersStore.createIndex('novelId', 'novelId', { unique: false });
                chaptersStore.createIndex('chapterNumber', 'chapterNumber', { unique: false });
                chaptersStore.createIndex('novelId_chapterNumber', ['novelId', 'chapterNumber'], { unique: true });
            }
        };
    });
}

export async function saveChapter(novelId, chapterNumber, chapterData) {
    const db = await openDB();
    const transaction = db.transaction([CHAPTERS_STORE], 'readwrite');
    const store = transaction.objectStore(CHAPTERS_STORE);

    const chapter = {
        id: `${novelId}_${chapterNumber}`,
        novelId,
        chapterNumber,
        data: chapterData,
        downloadedAt: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
        const request = store.put(chapter);
        request.onsuccess = () => resolve(chapter);
        request.onerror = () => reject(request.error);
    });
}

export async function getChapter(novelId, chapterNumber) {
    const db = await openDB();
    const transaction = db.transaction([CHAPTERS_STORE], 'readonly');
    const store = transaction.objectStore(CHAPTERS_STORE);

    return new Promise((resolve, reject) => {
        const request = store.get(`${novelId}_${chapterNumber}`);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function getChaptersByNovel(novelId) {
    const db = await openDB();
    const transaction = db.transaction([CHAPTERS_STORE], 'readonly');
    const store = transaction.objectStore(CHAPTERS_STORE);
    const index = store.index('novelId');

    return new Promise((resolve, reject) => {
        const request = index.getAll(novelId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function deleteChapter(novelId, chapterNumber) {
    const db = await openDB();
    const transaction = db.transaction([CHAPTERS_STORE], 'readwrite');
    const store = transaction.objectStore(CHAPTERS_STORE);

    return new Promise((resolve, reject) => {
        const request = store.delete(`${novelId}_${chapterNumber}`);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function deleteChaptersByNovel(novelId) {
    const db = await openDB();
    const transaction = db.transaction([CHAPTERS_STORE], 'readwrite');
    const store = transaction.objectStore(CHAPTERS_STORE);
    const index = store.index('novelId');

    return new Promise((resolve, reject) => {
        const request = index.getAllKeys(novelId);
        request.onsuccess = () => {
            const keys = request.result;
            keys.forEach(key => store.delete(key));
            resolve(keys.length);
        };
        request.onerror = () => reject(request.error);
    });
}

export async function getDownloadedChapters(novelId) {
    const db = await openDB();
    const transaction = db.transaction(['chapters'], 'readonly');
    const store = transaction.objectStore('chapters');

    return new Promise((resolve, reject) => {
        const request = store.getAll();

        request.onsuccess = () => {
            const allChapters = request.result;
            // Filter chapters for this specific novel
            const novelChapters = allChapters
                .filter(chapter => chapter.novelId === novelId)
                .map(chapter => chapter.chapterNumber)
                .sort((a, b) => a - b); // Sort numerically

            resolve(novelChapters);
        };

        request.onerror = () => {
            console.error('Error getting downloaded chapters:', request.error);
            reject(request.error);
        };
    });
}

// Optional: Get count of downloaded chapters
export async function getDownloadedChapterCount(novelId) {
    const chapters = await getDownloadedChapters(novelId);
    return chapters.length;
}

export async function isChapterDownloaded(novelId, chapterNumber) {
    const chapter = await getChapter(novelId, chapterNumber);
    return !!chapter;
}