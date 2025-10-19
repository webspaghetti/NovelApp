import sourceConfig from "@/config/sourceConfig";


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
            msg.type() !== 'error' || msg.type() === 'log'
        ) {
            console.log('Browser:', text + ' -' + type);
        }
    });

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');
    console.log(`Loaded ${sourceName} info page`);

    try {
        const config = sourceConfig[sourceName];

        const result = await page.evaluate(({ url, expressions }) => {
            // Void url to convince it is used
            void url;
            const data = {};

            // Execute each expression string
            for (const [key, expression] of Object.entries(expressions)) {
                try {
                    data[key] = eval(String(expression)) ?? null;
                } catch (error) {
                    console.error(`Error evaluating ${key}:`, error);
                    data[key] = null;
                }
            }

            return data;
        }, {
            url,
            expressions: config.info_scraper
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