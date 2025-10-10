export function isValidDate(dateString) {
    return !isNaN(Date.parse(dateString));
}