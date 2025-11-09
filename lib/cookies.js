export function getCollapsedStyleCookie(novelId) {
    if (typeof document === 'undefined') return false;

    const cookieName = `${novelId}-collapsed`;
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === cookieName) {
            return value === 'true';
        }
    }

    return false; // Default to expanded (false)
}


export function setCollapsedStyleCookie(novelId, isCollapsed) {
    if (typeof document === 'undefined') return;

    const cookieName = `${novelId}-collapsed`;

    if (isCollapsed) {
        // Set cookie to expire in 1 year
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        document.cookie = `${cookieName}=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
    } else {
        // Remove the cookie if collapsed is false (delete by setting past expiry)
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
    }
}


export function setNovelSortCookie(sortValue) {
    if (typeof document === 'undefined') return;

    const cookieName = 'novel-sort';

    // Set cookie to expire in 1 year
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    document.cookie = `${cookieName}=${sortValue}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
}