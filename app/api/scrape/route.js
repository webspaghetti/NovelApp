import sourceConfig from "@/config/sourceConfig"
import { chromium } from 'playwright';
import { NextResponse } from 'next/server';
import scrapeChapter from "@/app/api/scrape/util/scrapeChapter";
import scrapeNovelInfo from "@/app/api/scrape/util/scrapeNovelInfo";
import chapterCache from "@/lib/chapterCache";


let browserInstance = null;
let requestCount = 0;
const MAX_REQUESTS_BEFORE_RESTART = 50;

async function getBrowser() {
    // Restart browser periodically to avoid memory leaks
    if (browserInstance && requestCount >= MAX_REQUESTS_BEFORE_RESTART) {
        console.log('Restarting browser after', requestCount, 'requests');
        await browserInstance.close().catch(() => {});
        browserInstance = null;
        requestCount = 0;
    }

    if (!browserInstance || !browserInstance.isConnected()) {
        browserInstance = await chromium.launch({
            headless: true,
            args: [
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-sandbox',
            ]
        });
        requestCount = 0;
    }

    requestCount++;
    return browserInstance;
}


export async function POST(req) {
    const { url } = await req.json();

    // Check cache first (only for chapter pages, not novel info pages)
    const cachedContent = chapterCache.get(url);
    if (cachedContent) {
        console.log(`Cache hit for: ${url}`);
        return NextResponse.json(cachedContent);
    }

    console.log(`Scraping ${url}`);

    let context;
    let page;

    try {
        const browser = await getBrowser();

        context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        });

        page = await context.newPage();

        // Block unnecessary resources
        await page.route('**/*', (route) => {
            const requestUrl = route.request().url();
            const resourceType = route.request().resourceType();

            if (
                resourceType === 'image' ||
                resourceType === 'stylesheet' ||
                resourceType === 'font' ||
                resourceType === 'media' ||
                requestUrl.includes('analytics') ||
                requestUrl.includes('ads') ||
                requestUrl.includes('adspector') ||
                requestUrl.includes('rlcdn.com')
            ) {
                route.abort();
            } else {
                route.continue();
            }
        });

        await page.setViewportSize({ width: 1280, height: 800 });

        // Extract the source name from URL
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;

        let result;
        let novelSource;

        if (hostname) {
            // Always remove www. to get consistent config key
            novelSource = hostname.replace('www.', '').split('.')[0];

            const config = sourceConfig[novelSource].link_identifier

            if (!config) {
                console.error(`Unknown source: ${novelSource}. Available sources: ${Object.keys(sourceConfig).join(', ')}`);
                return NextResponse.json({ error: 'Unknown source' }, { status: 400 });
            }

            if (
                (
                    (typeof config.info_identifier === 'string' && url.includes(config.info_identifier)) ||
                    (config.info_identifier instanceof RegExp && config.info_identifier.test(url))
                )
                &&
                !(
                    (typeof config.chapter_identifier === 'string' && url.includes(config.chapter_identifier)) ||
                    (config.chapter_identifier instanceof RegExp && config.chapter_identifier.test(url))
                )
            ) {
                result = await scrapeNovelInfo(page, url, novelSource);
                // Don't cache novel info pages

            } else if (
                (typeof config.chapter_identifier === 'string' && url.includes(config.chapter_identifier)) ||
                (config.chapter_identifier instanceof RegExp && config.chapter_identifier.test(url))
            ) {
                const sourceConfigObj = sourceConfig[novelSource];

                if (sourceConfigObj.requiresChapterLookup) {
                    // Use the config's function to extract chapter number
                    const chapterNumber = sourceConfigObj.getChapterNumber(url);

                    if (!chapterNumber) {
                        return NextResponse.json({ error: 'Invalid chapter URL - could not extract chapter number' }, { status: 400 });
                    }

                    // Use the config's function to get the novel URL
                    const novelUrl = sourceConfigObj.getNovelUrlFromChapter(url);

                    // Use the helper function to find the actual chapter URL
                    const actualChapterUrl = await sourceConfigObj.getChapterUrl(page, novelUrl, chapterNumber);

                    // console.log("Actual Chapter URL: ",actualChapterUrl)

                    if (!actualChapterUrl) {
                        return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
                    }

                    // Now scrape the actual chapter URL
                    result = await scrapeChapter(page, actualChapterUrl, novelSource);
                } else {
                    // Normal chapter scraping
                    result = await scrapeChapter(page, url, novelSource);
                }

                // Cache chapter content
                const responseData = {
                    content: result,
                    source: novelSource
                };
                chapterCache.set(url, responseData);
                console.log(`Successfully scraped and cached ${url}`);

                return NextResponse.json(responseData);

            } else {
                console.error(`Invalid ${novelSource} URL format`);
                return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
            }

        } else {
            console.error(`Invalid URL`);
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }

        console.log(`Successfully scraped ${url}`);
        return NextResponse.json({
            content: result,
            source: novelSource
        });

    } catch (error) {
        console.error('Scraping error:', error.message);
        return NextResponse.json({ error: 'Failed to scrape the website' }, { status: 500 });
    } finally {
        if (page) await page.close().catch(() => {});
        if (context) await context.close().catch(() => {});
    }
}