import NodeCache from 'node-cache';


const chapterCache = new NodeCache({
    stdTTL: 900, // 15 minutes
    checkperiod: 120, // Check for expired entries every 2 minutes
    useClones: false, // Don't clone data
    maxKeys: 100 // Limit cache to 100 chapters to prevent memory issues
});


chapterCache.on('set', (key) => {
    console.log(`Cached: ${key} (Total: ${chapterCache.keys().length})`);
});

chapterCache.on('expired', (key) => {
    console.log(`Cache expired: ${key}`);
});

export default chapterCache;