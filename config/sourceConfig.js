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
            novelTitle: "document.querySelector('.tit').textContent.trim().replace(/\\s*\\((WN|Web Novel|WN KR)\\)\\s*$/, '')",
            formattedName: "url.split('/').pop().replace('.html', '')",
            novelStatus: "document.querySelector('.s1.s2, .s1.s3').textContent.trim()",
            lastUpdate: "document.querySelector('.lastupdate').textContent",
            chapterCount: "document.querySelector('.ul-list5 li a').getAttribute('href').match(/chapter-(\\d+)/)?.[1]",
            imageUrl: "'https://freewebnovel.com' + document.querySelector('.pic img').getAttribute('src')"
        },
        chapter_scraper: {
            selectors: {
                title: '.chapter',
                content: '#article'
            },
            watermarkPatterns: ["freewebnovel.com"]
        }
    },
    lightnovelworld: {
        source: "https://www.lightnovelworld.co",
        logo_url: "https://novelight.net/media/team/2024/04/14/light_novel_world.webp",
        link_template: "https://www.lightnovelworld.co/novel/novel-name",
        link_regex: /^https:\/\/www\.lightnovelworld\.co\/novel\/[a-z0-9-]+$/,
        icon_url: "data:image/webp;base64,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",
        getInfoLink: (formattedName) => `https://www.lightnovelworld.co/novel/${formattedName}`,
        getChapterLink: (params) => `https://www.lightnovelworld.co/novel/${params.formatted_name}/chapter-${params.chapter}`,
        link_identifier: {
            info_identifier: '/novel/',
            chapter_identifier: '/chapter-'
        },
        info_scraper: {
            novelTitle: "document.querySelector('h1.novel-title').textContent.trim().replace(/\\s*\\((WN|Web Novel|WN KR)\\)\\s*$/, '')",
            formattedName: "document.querySelector('#readchapterbtn').getAttribute('href')?.split('/')[2]?.replace(/-\\d+$/, '')",
            novelStatus: "document.querySelectorAll('.header-stats span')[3]?.querySelector('strong')?.textContent.trim()",
            lastUpdate: "document.querySelector('p.update').textContent.trim()",
            chapterCount: "document.querySelectorAll('.header-stats span')[0]?.querySelector('strong')?.textContent.trim()",
            imageUrl: "document.querySelector('figure.cover img').getAttribute('src')"
        },
        chapter_scraper: {
            selectors: {
                title: 'span.chapter-title',
                content: 'div.chapter-content'
            },
            watermarkPatterns: []
        }
    }
}


export default sourceConfig;