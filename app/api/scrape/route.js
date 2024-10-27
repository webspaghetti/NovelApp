import { chromium } from 'playwright';
import { NextResponse } from 'next/server';

async function scrapeFreeWebNovelInfo(page, url) {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');

    return page.evaluate((url) => {
        const novelTitle = document.querySelector('.tit').textContent.trim().replace(/\s*\((WN|Web Novel|WN KR)\)\s*$/, '');
        const formattedName = url.split('/').pop().replace('.html', '');
        const novelStatus = document.querySelector('.s1.s2, .s1.s3').textContent.trim();
        const lastUpdate = document.querySelector('.lastupdate').textContent;
        const chapterCountElement = document.querySelector('.ul-list5 li a');
        const chapterCount = chapterCountElement ? chapterCountElement.getAttribute('href').match(/chapter-(\d+)\.html/)?.[1] : null;
        const imageUrl = 'https://freewebnovel.com' + document.querySelector('.pic img').getAttribute('src');

        return {
            novelTitle,
            formattedName,
            novelStatus,
            lastUpdate,
            chapterCount,
            imageUrl
        };
    }, url);
}

async function scrapeLightNovelWorldInfo(page, url) {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');

    return page.evaluate(() => {
        const novelTitle = document.querySelector('h1.novel-title').textContent.trim().replace(/\s*\((WN|Web Novel|WN KR)\)\s*$/, '');
        const formattedName = document.querySelector('#readchapterbtn').getAttribute('href').split('/')[2].replace(/-\d+$/, '');
        const headerStats = document.querySelectorAll('.header-stats span');
        const novelStatus = headerStats[3].querySelector('strong').textContent.trim();
        const lastUpdate = document.querySelector('p.update').textContent.trim();
        const chapterCount = headerStats[0].querySelector('strong').textContent.trim();
        const imageUrl = document.querySelector('figure.cover img').getAttribute('src');

        return {
            novelTitle,
            formattedName,
            novelStatus,
            lastUpdate,
            chapterCount,
            imageUrl
        };
    });
}

async function scrapeFreeWebNovelChapter(page, url) {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');

    return page.evaluate(() => {
        const chapterTitle = document.querySelector('.chapter').textContent.trim();
        let chapterContent = document.querySelector('#article').innerHTML.trim();

        const cleanupPatterns = [
            // Remove freewebnovel watermark
            /[^\s<>]*?[fƒḟ́]?[^\s<>]*?(?:r|г|)?[^\s<>]*?(?:e|е|ε|е́|ё|ē|)?[^\s<>]*?(?:e|е|ε|е́|ё|ē|)[^\s<>]*?(?:w|ω|ѡ|ԝ|)[^\s<>]*?(?:e|е|ε|е́|ё|ē|)[^\s<>]*?b[^\s<>]*?(?:n|ɳ|ո|ռ|)[^\s<>]*?(?:o|о|ο|օ|σ|)[^\s<>]*?(?:v|ν|ṿ|ṽ|ѵ|)[^\s<>]*?(?:e|е|ε|е́|ё|ē|)[^\s<>]*?l[^\s<>]*?(?:\.|\․|。|｡|)?[^\s<>]*?(?:c|с|ϲ|ƈ|)[^\s<>]*?(?:o|о|ο|օ|σ|)[^\s<>]*?(?:m|м|ṃ|ṁ|๓|)[^\s<>]*?(?=\s*<\/p>|\s*$)/gi,
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
        ]

        // Apply cleanup patterns
        cleanupPatterns.forEach(pattern => {
            chapterContent = chapterContent.replace(pattern, '');
        });

        // Additional cleanup steps
        chapterContent = chapterContent
            // Convert <br> tags to newlines
            .replace(/<br\s*\/?>/gi, '\n')
            // Decode HTML entities
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            // Trim whitespace and remove extra newlines
            .trim()
            .replace(/\n{3,}/g, '\n\n');

        return {
            chapterTitle,
            chapterContent
        };
    });
}

async function scrapeLightNovelWorldChapter(page, url) {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');

    return page.evaluate(() => {
        const chapterTitle = document.querySelector('span.chapter-title').textContent.trim();
        let chapterContent = document.querySelector('div.chapter-content').innerHTML.trim();

        const cleanupPatterns = [
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
        ]

        // Apply cleanup patterns
        cleanupPatterns.forEach(pattern => {
            chapterContent = chapterContent.replace(pattern, '');
        });

        // Additional cleanup steps
        chapterContent = chapterContent
            // Convert <br> tags to newlines
            .replace(/<br\s*\/?>/gi, '\n')
            // Decode HTML entities
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            // Trim whitespace and remove extra newlines
            .trim()
            .replace(/\n{3,}/g, '\n\n');

        return {
            chapterTitle,
            chapterContent
        };
    });
}

export async function POST(req) {
    const { url } = await req.json();

    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        });
        const page = await context.newPage();
        await page.setViewportSize({ width: 1280, height: 800 });

        let result;
        if (url.includes('freewebnovel.com')) {
            if (url.endsWith('.html') && !url.includes('/chapter-')) {
                result = await scrapeFreeWebNovelInfo(page, url);
            } else if (url.includes('/chapter-')) {
                result = await scrapeFreeWebNovelChapter(page, url);
            } else {
                throw new Error('Invalid freewebnovel.com URL format');
            }
        } else if (url.includes('lightnovelworld.co')) {
            if (url.includes('/novel/') && !url.includes('/chapter-')) {
                result = await scrapeLightNovelWorldInfo(page, url);
            } else if (url.includes('/chapter-')) {
                result = await scrapeLightNovelWorldChapter(page, url);
            } else {
                throw new Error('Invalid lightnovelworld.co URL format');
            }
        } else {
            throw new Error('Unsupported website');
        }

        await browser.close();

        return NextResponse.json({ content: result });
    } catch (error) {
        console.error('Scraping error:', error);
        return NextResponse.json({ error: 'Failed to scrape the website' }, { status: 500 });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}