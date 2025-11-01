import sourceConfig from "@/config/sourceConfig"
import commonPatternsConfig from "@/config/commonPatternsConfig";
import unhomoglyph from 'unhomoglyph';

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function generateWatermarkRegex(pattern) {
    // Don't normalize the pattern - use it as-is to preserve original characters
    const lowerPattern = pattern.toLowerCase();
    const chars = [...lowerPattern];

    // Build regex parts - for 'm', also match 'rn' sequence
    const regexParts = chars.map((char) => {
        if (char === 'm') {
            // Match either 'm' or 'rn' (since they are used interchangeably)
            return `[^\\s<>]*?(?:m|rn)`;
        } else {
            return `[^\\s<>]*?(?:${escapeRegex(char)})`;
        }
    });

    // Join parts and add anchors
    const regexPattern = regexParts.join('') + '[^\\s<>]*?(?=\\s*<\\/p>|\\s*$)';

    return new RegExp(regexPattern, 'gi');
}

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
            (type !== 'error' || type === 'log')
        ) {
            console.log('Browser:', text + ' -' + type);
        }
    });

    // Single navigation with timeout
    await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
    });

    // Wait for your actual content instead of generic load state
    await page.waitForSelector(config.selectors.content, {
        state: 'attached',
        timeout: 15000
    });

    console.log(`Loaded ${sourceName}`);

    // Generate regex patterns from watermark strings
    const generatedWatermarkPatterns = config.watermarkPatterns
        ? config.watermarkPatterns.map(pattern => generateWatermarkRegex(pattern))
        : [];

    console.log(generatedWatermarkPatterns)

    try {
        // Extract content from the page first
        const rawContent = await page.evaluate(({ selectors }) => {
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
            const chapterContent = contentElement.innerHTML.trim();

            return {
                chapterTitle,
                chapterContent
            };
        }, {
            selectors: config.selectors
        });

        // Normalize homoglyphs in Node.js context where unhomoglyph is available
        let chapterContent = unhomoglyph(rawContent.chapterContent);

        // Combine source-specific and common patterns
        const allPatterns = [
            ...generatedWatermarkPatterns,
            ...commonPatternsConfig
        ];

        // Apply cleanup patterns
        allPatterns.forEach(pattern => {
            chapterContent = chapterContent.replace(pattern, '');
        });

        // HTML cleanup step
        chapterContent = chapterContent
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .trim()
            .replace(/\n{3,}/g, '\n\n');

        console.log(`Success: ${rawContent.chapterTitle}`);

        return {
            chapterTitle: rawContent.chapterTitle,
            chapterContent
        };

    } catch (error) {
        console.error(`Error scraping ${sourceName}:`, error);
        // Optional: take a screenshot to debug
        // await page.screenshot({ path: 'error-screenshot.png' });
        throw error;
    }
}


export default scrapeChapter;