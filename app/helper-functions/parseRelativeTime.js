export function parseRelativeTime(relativeStr) {
    const now = new Date();

    // Normalize the string
    const str = relativeStr.trim().toLowerCase();

    if (str === 'just now') return now;
    if (str === 'an hour ago') return new Date(now.getTime() - 60 * 60 * 1000);
    if (str === 'a day ago') return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    if (str === 'a month ago') return new Date(now.setMonth(now.getMonth() - 1));
    if (str === 'a year ago' || str === '1 year ago') return new Date(now.setFullYear(now.getFullYear() - 1));

    const match = str.match(/^(\d+)\s(\w+)\sago$/);
    if (!match) return now;

    const [, valueStr, unit] = match;
    const value = parseInt(valueStr, 10);

    switch (unit) {
        case 'second':
        case 'seconds':
            return new Date(now.getTime() - value * 1000);
        case 'minute':
        case 'minutes':
            return new Date(now.getTime() - value * 60 * 1000);
        case 'hour':
        case 'hours':
            return new Date(now.getTime() - value * 60 * 60 * 1000);
        case 'day':
        case 'days':
            return new Date(now.getTime() - value * 24 * 60 * 60 * 1000);
        case 'month':
        case 'months':
            return new Date(now.setMonth(now.getMonth() - value));
        case 'year':
        case 'years':
            return new Date(now.setFullYear(now.getFullYear() - value));
        default:
            return now;
    }
}