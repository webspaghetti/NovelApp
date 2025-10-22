export function isMoreThanTwoMonthsOld(update) {
    if (update.includes('months ago')) {
        const monthsAgo = parseInt(update);
        return monthsAgo >= 3;
    } else if (update.includes('a year ago') || update.includes('years ago')) {
        return true;
    } else if (Date.parse(update)) {
        const currentDate = new Date();
        const parsedDate = new Date(update);

        // Calculate the difference in months between the current date and the parsed date
        const diffInMonths = (currentDate.getFullYear() - parsedDate.getFullYear()) * 12 + currentDate.getMonth() - parsedDate.getMonth();

        return diffInMonths >= 3;
    }
    return false;
}