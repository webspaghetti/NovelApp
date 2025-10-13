const sourceConfig = {
    freewebnovel: {
        link_template: "https://freewebnovel.com/novel/novel-name",
        link_regex: /^https:\/\/freewebnovel\.com\/novel\/[a-z0-9-]+$/,
        getInfoLink: (formattedName) => `https://freewebnovel.com/novel/${formattedName}`,
        getChapterLink: (params) => `https://freewebnovel.com/novel/${params.formatted_name}/chapter-${params.chapter}`,
        chapter_scraper: {
            selectors: {
                title: '.chapter',
                content: '#article'
            },
            watermarkPatterns: [
                /[^\s<>]*?(?:[fƒḟ́])?[^\s<>]*?(?:r|г)[^\s<>]*?(?:e|е|ε|е́|ё|ē)[^\s<>]*?(?:e|е|ε|е́|ё|ē)[^\s<>]*?(?:w|ω|ѡ|ԝ)[^\s<>]*?(?:e|е|ε|е́|ё|ē)[^\s<>]*?[^\s<>]*?(?:[b|ɓ])[^\s<>]*?(?:n|ɳ|ո|ռ)[^\s<>]*?(?:o|о|ο|օ|σ)[^\s<>]*?(?:v|ν|ṿ|ṽ|ѵ)[^\s<>]*?(?:e|е|ε|е́|ё|ē)[^\s<>]*?l[^\s<>]*?(?:\.|\․|。|｡)?[^\s<>]*?(?:c|с|ϲ|ƈ)[^\s<>]*?(?:o|о|ο|օ|σ)[^\s<>]*?(?:m|м|ṃ|ṁ|๓)[^\s<>]*?(?=\s*<\/p>|\s*$)/gi,
            ]
        }
    }
}

export default sourceConfig;