function isValidDate({dateString}) {
    return !isNaN(Date.parse(dateString));
}

export default isValidDate();