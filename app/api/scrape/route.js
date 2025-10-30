import sourceConfig from "@/config/sourceConfig"
import { chromium } from 'playwright';
import { NextResponse } from 'next/server';
import scrapeChapter from "@/app/api/scrape/util/scrapeChapter";
import scrapeNovelInfo from "@/app/api/scrape/util/scrapeNovelInfo";


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
        const matchNovelSource = url.match(/https:\/\/([a-zA-Z0-9-]+)\./);

        let result;
        let novelSource;

        if (matchNovelSource) {
            novelSource = matchNovelSource[1];

            const config = sourceConfig[novelSource].link_identifier

            if (!config) {
                console.error(`Unknown source: ${novelSource}. Available sources: ${Object.keys(PAGE_CONFIGS).join(', ')}`);
                return;
            }

            if (url.includes(config.info_identifier) && !url.includes(config.chapter_identifier)) {
                result = await scrapeNovelInfo(page, url, novelSource);

            } else if (url.includes(config.chapter_identifier)) {
                result = await scrapeChapter(page, url, novelSource);

            } else {
                console.error(`Invalid ${novelSource} URL format`);
                return;
            }

        } else {
            console.error(`Invalid URL`);
            return;
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