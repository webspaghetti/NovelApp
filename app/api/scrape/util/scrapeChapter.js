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

function findAndCleanWatermarks(rawContent, patterns) {
    // Create a normalized version for detection
    const normalizedContent = unhomoglyph(rawContent);

    // Find matches in normalized content, but extract from original using the matched text
    const matchedTexts = new Set();

    patterns.forEach(pattern => {
        let match;
        pattern.lastIndex = 0;

        while ((match = pattern.exec(normalizedContent)) !== null) {
            // Store the matched normalized text
            matchedTexts.add(match[0]);
        }
    });

    if (matchedTexts.size === 0) {
        return {
            cleanedContent: rawContent,
            removedCount: 0,
            removedRanges: []
        };
    }

    // Now find these patterns in the ORIGINAL content by searching for sequences
    // that normalize to the matched text
    let cleanedContent = rawContent;
    const removedRanges = [];

    matchedTexts.forEach(normalizedMatch => {
        // Create a sliding window to find where this normalized pattern appears in original
        const normalizedMatchLower = normalizedMatch.toLowerCase();

        // Search through original content
        let searchPos = 0;
        while (searchPos < cleanedContent.length) {
            // Try increasingly longer substrings from searchPos
            let found = false;
            for (let len = normalizedMatch.length; len <= normalizedMatch.length * 4; len++) {
                const candidate = cleanedContent.substring(searchPos, searchPos + len);
                const normalizedCandidate = unhomoglyph(candidate).toLowerCase();

                if (normalizedCandidate === normalizedMatchLower) {
                    // Found it! Remove this section
                    removedRanges.push({
                        position: searchPos,
                        length: len,
                        preview: candidate.substring(0, 50)
                    });

                    cleanedContent = cleanedContent.slice(0, searchPos) + cleanedContent.slice(searchPos + len);
                    found = true;
                    break;
                }
            }

            if (!found) {
                searchPos++;
            }
        }
    });

    return {
        cleanedContent,
        removedCount: removedRanges.length,
        removedRanges
    };
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


    try {
        // Extract RAW content without any normalization
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

        // Clean watermarks using position-based approach (only for watermark patterns)
        const { cleanedContent, removedCount, removedRanges } =
            findAndCleanWatermarks(rawContent.chapterContent, generatedWatermarkPatterns);

        // Apply common cleanup patterns (simple regex replace)
        let chapterContent = cleanedContent;
        commonPatternsConfig.forEach(pattern => {
            chapterContent = chapterContent.replace(pattern, '');
        });

        // HTML entity cleanup
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
        // Watermark logging
        /*if (removedCount > 0) {
            console.log(`Removed ${removedCount} watermark(s)`);
            console.log('Removed watermarks:', removedRanges);
        }*/

        return {
            chapterTitle: rawContent.chapterTitle,
            chapterContent,
            metadata: {
                watermarksRemoved: removedCount,
                cleaningDetails: removedRanges
            }
        };

    } catch (error) {
        console.error(`Error scraping ${sourceName}:`, error);
        // Optional: take a screenshot to debug
        // await page.screenshot({ path: 'error-screenshot.png' });
        throw error;
    }
}


export default scrapeChapter;