export default function IsMoreThanTwoMonthsOld(update) {
    if (update.includes('months ago')) {
        const monthsAgo = parseInt(update);
        return monthsAgo >= 3;
    } else if (update.includes('a year ago') || update.includes('years ago')) {
        return true;
    } else if (Date.parse(update)) {
        return true;
    }
    return false;
}