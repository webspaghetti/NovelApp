async function scrapeNovelInfo(page, url, sourceName) {
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
    console.log(`Loaded ${sourceName} info page`);

    try {
        const result = await page.evaluate(({ url, sourceName }) => {
            const data = {};

            // Source-specific extraction logic
            if (sourceName === 'freewebnovel') {
                data.novelTitle = document.querySelector('.tit').textContent.trim().replace(/\s*\((WN|Web Novel|WN KR)\)\s*$/, '');
                data.formattedName = url.split('/').pop().replace('.html', '');
                data.novelStatus = document.querySelector('.s1.s2, .s1.s3').textContent.trim();
                data.lastUpdate = document.querySelector('.lastupdate').textContent;
                data.chapterCount = document.querySelector('.ul-list5 li a').getAttribute('href').match(/chapter-(\d+)/)?.[1];
                data.imageUrl = 'https://freewebnovel.com' + document.querySelector('.pic img').getAttribute('src');
            }
            else if (sourceName === 'lightnovelworld') {
                data.novelTitle = document.querySelector('h1.novel-title').textContent.trim().replace(/\s*\((WN|Web Novel|WN KR)\)\s*$/, '');
                data.formattedName = document.querySelector('#readchapterbtn').getAttribute('href')?.split('/')[2]?.replace(/-\d+$/, '');
                data.novelStatus = document.querySelectorAll('.header-stats span')[3]?.querySelector('strong')?.textContent.trim();
                data.lastUpdate = document.querySelector('p.update').textContent.trim();
                data.chapterCount = document.querySelectorAll('.header-stats span')[0]?.querySelector('strong')?.textContent.trim();
                data.imageUrl = document.querySelector('figure.cover img').getAttribute('src');
            }

            return data;
        }, {
            url,
            sourceName
        });

        console.log(`Success: ${result.novelTitle}`);
        return result;

    } catch (error) {
        console.error(`Error scraping ${sourceName} info:`, error);
        // Optional: take a screenshot to debug
        // await page.screenshot({ path: 'error-screenshot.png' });
        throw error;
    }
}


export default scrapeNovelInfo;