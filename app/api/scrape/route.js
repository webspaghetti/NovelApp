import { chromium } from 'playwright';
import { NextResponse } from 'next/server';
import scrapeChapter from "@/app/api/scrape/util/scrapeChapter";
import scrapeNovelInfo from "@/app/api/scrape/util/scrapeNovelInfo";


const PAGE_CONFIGS = {
    freewebnovel: {
        info_identifier: '/novel/',
        chapter_identifier: '/chapter-'
    },
    lightnovelworld: {
        info_identifier: '/novel/',
        chapter_identifier: '/chapter-'
    }
}


let browserInstance = null;

async function getBrowser() {
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
    }
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

            const config = PAGE_CONFIGS[novelSource]

            if (!config) {
                console.error(`Unknown source: ${novelSource}. Available sources: ${Object.keys(PAGE_CONFIGS).join(', ')}`);
                return;
            }

            if (url.includes(config.info_identifier) && !url.includes(config.chapter_identifier)) {
                result = await scrapeNovelInfo(page, url, novelSource);
                console.log(result)

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