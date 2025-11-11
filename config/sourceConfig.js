const sourceConfig = {
    freewebnovel: {
        source: "https://freewebnovel.com",
        logo_url: "https://freewebnovel.com/static/freewebnovel/images/logo.png",
        link_template: "https://freewebnovel.com/novel/novel-name",
        link_regex: /^https:\/\/freewebnovel\.com\/novel\/[a-z0-9-]+$/,
        icon_url: "https://freewebnovel.com/static/freewebnovel/favicon.ico",
        getInfoLink: (formattedName) => `https://freewebnovel.com/novel/${formattedName}`,
        getChapterLink: (params) => `https://freewebnovel.com/novel/${params.formatted_name}/chapter-${params.chapter}`,
        link_identifier: {
            info_identifier: '/novel/',
            chapter_identifier: '/chapter-'
        },
        info_scraper: {
            novelTitle: "document.querySelector('.tit')?.textContent?.trim().replace(/\\s*\\((WN|Web Novel|WN KR)\\)\\s*$/, '') || 'Unknown'",
            formattedName: "url.split('/').pop().replace('.html', '')",
            novelStatus: "document.querySelector('.s1.s2, .s1.s3')?.textContent?.trim() || 'Unknown'",
            lastUpdate: "document.querySelector('.lastupdate')?.textContent?.trim() || 'Unknown'",
            chapterCount: "document.querySelector('.ul-list5 li a')?.getAttribute('href').match(/chapter-(\\d+)/)?.[1] || '0'",
            imageUrl: "document.querySelector('.pic img')?.getAttribute('src') ? 'https://freewebnovel.com' + document.querySelector('.pic img').getAttribute('src') : ''"
        },
        chapter_scraper: {
            selectors: {
                title: '.chapter',
                content: '#article'
            },
            watermarkPatterns: ["freewebnovel.com"]
        }
    },
    novelfire: {
        source: "https://novelfire.net",
        logo_url: "https://novelfire.net/logo.svg?v=2",
        link_template: "https://novelfire.net/book/novel-name",
        link_regex: /^https:\/\/novelfire\.net\/book\/[a-z0-9-]+$/,
        icon_url: "https://novelfire.net/logo.ico?v=2",
        getInfoLink: (formattedName) => `https://novelfire.net/book/${formattedName}`,
        getChapterLink: (params) => `https://novelfire.net/book/${params.formatted_name}/chapter-${params.chapter}`,
        link_identifier: {
            info_identifier: '/book/',
            chapter_identifier: '/chapter-'
        },
        info_scraper: {
            novelTitle: "document.querySelector('h1.novel-title')?.textContent?.trim() || 'Unknown'",
            formattedName: "url.split('/book/')[1]?.split('/')[0] || ''",
            novelStatus: "Array.from(document.querySelectorAll('.header-stats small')).find(s => s.textContent.trim().toLowerCase() === 'status')?.previousElementSibling?.textContent?.trim() || 'Unknown'",
            lastUpdate: "document.querySelector('.body p.update')?.textContent?.trim().replace('Updated ', '') || 'Unknown'",
            chapterCount: "document.querySelector('.header-stats span:first-child strong')?.textContent?.trim().match(/\\d+/)?.[0] || '0'",
            imageUrl: "document.querySelector('figure.cover img')?.getAttribute('src') || ''"
        },
        chapter_scraper: {
            selectors: {
                title: '.chapter-title',
                content: '#chapter-container #content'
            },
            watermarkPatterns: []
        }
    },

// WuxiaSpot Configuration
    wuxiaspot: {
        source: "https://www.wuxiaspot.com",
        logo_url: "https://www.wuxiaspot.com/d/img/logo.png",
        link_template: "https://www.wuxiaspot.com/novel/novel-name.html",
        link_regex: /^https:\/\/www\.wuxiaspot\.com\/novel\/[a-z0-9-]+\.html$/,
        icon_url: "https://www.wuxiaspot.com/favicon.ico",
        getInfoLink: (formattedName) => `https://www.wuxiaspot.com/novel/${formattedName}.html`,
        getChapterLink: (params) => `https://www.wuxiaspot.com/novel/${params.formatted_name}_${params.chapter}.html`,
        link_identifier: {
            info_identifier: '/novel/',
            chapter_identifier: '_'
        },
        info_scraper: {
            novelTitle: "document.querySelector('h1.novel-title')?.textContent?.trim() || 'Unknown'",
            formattedName: "url.split('/novel/')[1]?.replace('.html', '') || ''",
            novelStatus: "Array.from(document.querySelectorAll('.header-stats small')).find(el => el.textContent.trim().toLowerCase() === 'status')?.previousElementSibling?.textContent?.trim() || 'Unknown'",
            lastUpdate: "async () => { const novelName = url.split('/novel/')[1]?.replace('.html', ''); if (!novelName) return 'Unknown'; try { const response = await fetch(`https://www.wuxiaspot.com/e/extend/fy1.php?page=0&wjm=${novelName}&X-Requested-With=XMLHttpRequest&_=${Date.now()}`); const html = await response.text(); const parser = new DOMParser(); const doc = parser.parseFromString(html, 'text/html'); return doc.querySelector('.chapter-list li time.chapter-update')?.textContent?.trim() || 'Unknown'; } catch (e) { return 'Unknown'; } }",
            chapterCount: "document.querySelector('.header-stats span:first-child strong')?.textContent?.trim().match(/\\d+/)?.[0] || '0'",
            imageUrl: "document.querySelector('.fixed-img figure.cover img')?.getAttribute('src') ? 'https://www.wuxiaspot.com' + document.querySelector('.fixed-img figure.cover img').getAttribute('src') : ''"
        },
        chapter_scraper: {
            selectors: {
                title: '.titles h2',
                content: '.chapter-content'
            },
            watermarkPatterns: []
        }
    },

// FanMTL Configuration
    fanmtl: {
        source: "https://www.fanmtl.com",
        logo_url: "https://www.fanmtl.com/d/img/logo.png",
        link_template: "https://www.fanmtl.com/novel/novel-name.html",
        link_regex: /^https:\/\/www\.fanmtl\.com\/novel\/[a-z0-9-]+\.html$/,
        icon_url: "https://www.fanmtl.com/favicon.ico",
        getInfoLink: (formattedName) => `https://www.fanmtl.com/novel/${formattedName}.html`,
        getChapterLink: (params) => `https://www.fanmtl.com/novel/${params.formatted_name}_${params.chapter}.html`,
        link_identifier: {
            info_identifier: '/novel/',
            chapter_identifier: '_'
        },
        info_scraper: {
            novelTitle: "document.querySelector('h1.novel-title')?.textContent?.trim() || 'Unknown'",
            formattedName: "url.split('/novel/')[1]?.replace('.html', '') || ''",
            novelStatus: "Array.from(document.querySelectorAll('.header-stats small')).find(el => el.textContent.trim().toLowerCase() === 'status')?.previousElementSibling?.textContent?.trim() || 'Unknown'",
            lastUpdate: "async () => { const novelName = url.split('/novel/')[1]?.replace('.html', ''); if (!novelName) return 'Unknown'; try { const response = await fetch(`https://www.fanmtl.com/e/extend/fy1.php?page=0&wjm=${novelName}&X-Requested-With=XMLHttpRequest&_=${Date.now()}`); const html = await response.text(); const parser = new DOMParser(); const doc = parser.parseFromString(html, 'text/html'); return doc.querySelector('.chapter-list li time.chapter-update')?.textContent?.trim() || 'Unknown'; } catch (e) { return 'Unknown'; } }",
            chapterCount: "document.querySelector('.header-stats span:first-child strong')?.textContent?.trim().match(/\\d+/)?.[0] || '0'",
            imageUrl: "document.querySelector('.fixed-img figure.cover img')?.getAttribute('src') ? 'https://www.fanmtl.com' + document.querySelector('.fixed-img figure.cover img').getAttribute('src') : ''"
        },
        chapter_scraper: {
            selectors: {
                title: '.titles h2',
                content: '.chapter-content'
            },
            watermarkPatterns: []
        }
    },
    novelhi: {
        source: "https://novelhi.com",
        logo_url: "https://novelhi.com/images/logo.png",
        link_template: "https://novelhi.com/s/novel-name",
        link_regex: /^https:\/\/novelhi\.com\/s\/[a-zA-Z0-9-]+$/,
        icon_url: "https://novelhi.com/favicon.ico",
        getInfoLink: (formattedName) => `https://novelhi.com/s/${formattedName}`,
        getChapterLink: (params) => `https://novelhi.com/s/${params.formatted_name}/${params.chapter}`,
        link_identifier: {
            info_identifier: '/s/',
            chapter_identifier: /\/s\/[^/]+\/([^/]+)$/
        },
        info_scraper: {
            novelTitle: "document.querySelector('.tit h1')?.textContent?.trim() || 'Unknown'",
            formattedName: "url.split('/s/')[1]?.split('/')[0] || ''",
            novelStatus: "document.querySelector('.book_info .list li span.item em')?.textContent?.trim() || 'Unknown'",
            lastUpdate: "document.querySelector('.book_info .list li span.item:last-child em')?.textContent?.trim() || 'Unknown'",
            chapterCount: "document.querySelector('#indexList li:first-child a')?.textContent?.match(/\\d+/)?.[0] || '0'",
            imageUrl: "document.querySelector('.bookCover .book_cover img.cover')?.getAttribute('src') || ''"
        },
        chapter_scraper: {
            selectors: {
                title: '.book_title h1',
                content: '#showReading'
            },
            watermarkPatterns: []
        }
    },
    novelbin: {
        source: "https://novelbin.com",
        logo_url: "https://novelbin.com/img/logo.png",
        link_template: "https://novelbin.com/b/novel-name",
        link_regex: /^https:\/\/novelbin\.com\/b\/[a-z0-9-]+$/,
        icon_url: "https://novelbin.com/img/favicon.ico?v=1.68",
        requiresChapterLookup: true,
        getInfoLink: (formattedName) => `https://novelbin.com/b/${formattedName}`,
        getChapterLink: (params) => `https://novelbin.com/b/${params.formatted_name}/chapter-${params.chapter}`,
        link_identifier: {
            info_identifier: '/b/',
            chapter_identifier: '/chapter-'
        },
        // Extract chapter number from URL
        getChapterNumber: (chapterUrl) => {
            return chapterUrl.match(/chapter-(\d+)/)?.[1] || null;
        },
        // Function to convert chapter URL to novel info URL
        getNovelUrlFromChapter: (chapterUrl) => {
            return chapterUrl.split('/chapter-')[0];
        },
        info_scraper: {
            novelTitle: "document.querySelector('h3.title')?.textContent?.trim() || 'Unknown'",
            formattedName: "url.split('/b/')[1]?.split('/')[0] || ''",
            novelStatus: "((li => { const h3 = li.querySelector('h3'); return h3 && h3.textContent.trim() === 'Status:' ? (li.querySelector('a')?.textContent?.trim() || li.textContent.replace('Status:', '').trim()) : null; })([...document.querySelectorAll('.info.info-meta li')].find(li => li.querySelector('h3')?.textContent.trim() === 'Status:')) || 'Unknown')",
            lastUpdate: "document.querySelector('.l-chapter .item-time')?.textContent?.trim() || 'Unknown'",
            chapterCount: "document.querySelector('.l-chapter .chapter-title')?.getAttribute('href')?.match(/chapter-(\\d+)/)?.[1] || '0'",
            imageUrl: "document.querySelector('.book img.lazy')?.getAttribute('data-src') || document.querySelector('.book img.lazy')?.getAttribute('src') || ''"
        },
        chapter_scraper: {
            selectors: {
                title: '.chr-title .chr-text',
                content: '#chr-content'
            },
            watermarkPatterns: []
        },
        getChapterUrl: async (page, novelUrl, chapterNumber) => {
            await page.goto(novelUrl, { waitUntil: 'domcontentloaded' });

            return await page.evaluate((num) => {
                const links = Array.from(document.querySelectorAll('.l-chapter a, .list-chapter a'));

                for (const link of links) {
                    const match = link.href.match(/chapter-(\d+)/);
                    if (match && match[1] === String(num)) {
                        return link.href;
                    }
                }
                return null;
            }, chapterNumber);
        }
    },
    novelfull: {
        source: "https://novelfull.net",
        logo_url: "https://novelfull.net/web/logo.png",
        link_template: "https://novelfull.net/novel-name.html",
        link_regex: /^https:\/\/novelfull\.net\/[a-z0-9-]+\.html$/,
        icon_url: "https://novelfull.net/web/images/favicon.ico",
        requiresChapterSlugs: true,
        getChapterNumber: (chapterUrl) => {
            return chapterUrl.match(/chapter-(\d+)/)?.[1] || null;
        },
        getInfoLink: (formattedName) => `https://novelfull.net/${formattedName}.html`,
        getChapterLink: (params) => `https://novelfull.net/${params.formatted_name}/chapter-${params.chapter}.html`,
        getNovelUrlFromChapter: (chapterUrl) => {
            return chapterUrl.split('/chapter-')[0] + '.html';
        },
        link_identifier: {
            info_identifier: '.html',
            chapter_identifier: '/chapter-'
        },
        info_scraper: {
            novelTitle: "document.querySelector('h3.title')?.textContent?.trim() || 'Unknown'",
            formattedName: "url.split('/').pop().replace('.html', '')",
            novelStatus: "((div => { const h3 = div.querySelector('h3'); return h3 && h3.textContent.trim() === 'Status:' ? (div.querySelector('a')?.textContent?.trim() || 'Unknown') : null; })([...document.querySelectorAll('.info > div')].find(div => div.querySelector('h3')?.textContent.trim() === 'Status:')) || 'Unknown')",
            chapterCount: "document.querySelector('.l-chapters li:first-child a')?.getAttribute('href')?.match(/chapter-(\\d+)/)?.[1] || '0'",
            imageUrl: "document.querySelector('.book img')?.getAttribute('src') ? 'https://novelfull.net' + document.querySelector('.book img').getAttribute('src') : document.querySelector('.book img')?.getAttribute('src') || ''"
        },
        chapter_scraper: {
            selectors: {
                title: '.chapter-text',
                content: '#chapter-content'
            },
            watermarkPatterns: []
        },
        getChapterUrl: async (page, novelUrl, chapterNumber) => {
            await page.goto(novelUrl, { waitUntil: 'domcontentloaded' });

            return await page.evaluate((num) => {
                // Find all chapter links in the chapter list
                const links = Array.from(document.querySelectorAll('.l-chapters li a, .list-chapter a'));

                // Find the link that matches the chapter number
                for (const link of links) {
                    const match = link.href.match(/chapter-(\d+)/);
                    if (match && match[1] === String(num)) {
                        return link.href;
                    }
                }
                return null;
            }, chapterNumber);
        }
    },
    novelbuddy: {
        source: "https://novelbuddy.com",
        logo_url: "https://novelbuddy.com/static/sites/novelbuddy/icons/apple-touch-icon.png",
        link_template: "https://novelbuddy.com/novel/novel-name",
        link_regex: /^https:\/\/novelbuddy\.com\/novel\/[a-z0-9-]+$/,
        icon_url: "https://novelbuddy.com/static/sites/novelbuddy/icons/apple-touch-icon.png",
        requiresChapterLookup: true,
        getInfoLink: (formattedName) => `https://novelbuddy.com/novel/${formattedName}`,
        getChapterLink: (params) => `https://novelbuddy.com/novel/${params.formatted_name}/chapter-${params.chapter}`,
        link_identifier: {
            info_identifier: '/novel/',
            chapter_identifier: '/chapter-'
        },
        // Extract chapter number from URL
        getChapterNumber: (chapterUrl) => {
            // Match chapter-{number}{optional ordinal}
            return chapterUrl.match(/chapter-(\d+)(?:th|st|nd|rd)?/)?.[1] || null;
        },
        // Function to convert chapter URL to novel info URL
        getNovelUrlFromChapter: (chapterUrl) => {
            return chapterUrl.split('/chapter-')[0];
        },
        info_scraper: {
            novelTitle: "document.querySelector('.name.box h1')?.textContent?.trim() || 'Unknown'",
            formattedName: "url.split('/novel/')[1]?.split('/')[0] || ''",
            novelStatus: "((p => { const strong = p.querySelector('strong'); return strong && strong.textContent.trim().startsWith('Status') ? p.querySelector('span')?.textContent?.trim() || 'Unknown' : null; })([...document.querySelectorAll('.meta.box p')].find(p => p.querySelector('strong')?.textContent.trim().startsWith('Status'))) || 'Unknown')",
            lastUpdate: "((p => { const strong = p.querySelector('strong'); return strong && strong.textContent.trim().startsWith('Last update') ? p.querySelector('span')?.textContent?.trim() || 'Unknown' : null; })([...document.querySelectorAll('.meta.box p')].find(p => p.querySelector('strong')?.textContent.trim().startsWith('Last update'))) || 'Unknown')",
            chapterCount: "((p => { const strong = p.querySelector('strong'); return strong && strong.textContent.trim().startsWith('Chapters') ? p.querySelector('span')?.textContent?.trim() || '0' : null; })([...document.querySelectorAll('.meta.box p')].find(p => p.querySelector('strong')?.textContent.trim().startsWith('Chapters'))) || '0')",
            imageUrl: "((img => { const url = img?.getAttribute('data-src') || img?.getAttribute('src') || ''; return url.startsWith('//') ? 'https:' + url : url; })(document.querySelector('.img-cover img')) || '')"
        },
        chapter_scraper: {
            selectors: {
                title: '.chapter__content h1',
                content: '.chapter__content .content-inner'
            },
            watermarkPatterns: []
        },
        getChapterUrl: async (page, novelUrl, chapterNumber) => {
            await page.goto(novelUrl, { waitUntil: 'domcontentloaded' });

            return await page.evaluate((num) => {
                // Find all chapter links
                const links = Array.from(document.querySelectorAll('a[href*="/chapter-"]'));

                // Find the link that matches the chapter number (with improved regex)
                for (const link of links) {
                    const match = link.href.match(/chapter-(\d+)(?:th|st|nd|rd)?[-\/]/);
                    if (match && match[1] === String(num)) {
                        return link.href;
                    }
                }
                return null;
            }, chapterNumber);
        }
    }
}


export default sourceConfig;