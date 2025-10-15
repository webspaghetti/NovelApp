import sourceConfig from "@/config/sourceConfig"
// Common cleanup patterns used by all sources
const COMMON_CLEANUP_PATTERNS = [
    // Remove chapter headings
    /<p>\s*<\/p><h4>Chapter \d+.*?<\/h4>\s*<p>\s*<\/p>|<p>\s*Chapter \d+\s.*?<\/p>/gi,
    // Remove translator notes
    /<p>\s*(<strong>)?Translator: (<\/strong>)?.*?<\/p>/gi,
    // Remove empty paragraphs
    /<p>\s*&nbsp;\s*<\/p>|<p><\/p>/gi,
    // Remove div wrappers (often used for ads)
    /<div[^>]*>|<\/div>/gi,
    // Remove any remaining HTML comments
    /<!--[\s\S]*?-->/g
];


async function scrapeChapter(page, url, sourceName) {
    const config = sourceConfig[sourceName].chapter_scraper;

    if (!config) {
        throw new Error(`Unknown source: ${sourceName}. Available sources: ${Object.keys(sourceConfig).join(', ')}`);
    }

    // Console log forwarding
    page.on('console', msg => {
        const text = msg.text();
        const type = msg.type();
        if (
            !text.includes('WebGL') &&
            !text.includes('CORS') &&
            !text.includes('GroupMarkerNotSet') &&
            !text.includes('iframe') &&
            msg.type() === 'error' || msg.type() === 'log'
        ) {
            console.log('Browser:', text + ' -' + type);
        }
    });

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');
    console.log(`Loaded ${sourceName}`);


    try {
        // Pass config into the browser context
        const result = await page.evaluate(({ selectors, watermarkPatterns, commonPatterns }) => {
            const titleElement = document.querySelector(selectors.title);
            const contentElement = document.querySelector(selectors.content);

            // Element check
            if (!titleElement) {
                throw new Error(`Title element not found: ${selectors.title}`);
            }
            if (!contentElement) {
                throw new Error(`Content element not found: ${selectors.content}`);
            }

            const chapterTitle = titleElement.textContent.trim();
            let chapterContent = contentElement.innerHTML.trim();

            // Combine source-specific and common patterns
            const allPatterns = [...watermarkPatterns, ...commonPatterns];

            // Apply cleanup patterns
            allPatterns.forEach(pattern => {
                // Reconstruct RegExp from pattern object
                const regex = new RegExp(pattern.source, pattern.flags);
                chapterContent = chapterContent.replace(regex, '');
            });

            // Additional cleanup steps
            chapterContent = chapterContent
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .trim()
                .replace(/\n{3,}/g, '\n\n');


            return {
                chapterTitle,
                chapterContent
            };
        }, {
            selectors: config.selectors,
            // Convert RegExp to plain objects for serialization
            watermarkPatterns: config.watermarkPatterns.map(p => ({ source: p.source, flags: p.flags })),
            commonPatterns: COMMON_CLEANUP_PATTERNS.map(p => ({ source: p.source, flags: p.flags }))
        });

        console.log(`Success: ${result.chapterTitle}`);
        return result;

    } catch (error) {
        console.error(`Error scraping ${sourceName}:`, error);
        // Optional: take a screenshot to debug
        // await page.screenshot({ path: 'error-screenshot.png' });
        throw error;
    }
}


export default scrapeChapter;