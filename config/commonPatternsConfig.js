// Common cleanup patterns used by all sources
const commonPatternsConfig = [
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
];


export default commonPatternsConfig;