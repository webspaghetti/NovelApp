import formatLastUpdate from "@/app/helper-functions/formatLastUpdate";


function getFormattedLastUpdate(lastUpdate) {
    if (/\b(ago|hour|minute|second|day|week|month|year)\b/i.test(lastUpdate)) {
        return formatLastUpdate(lastUpdate);
    }

    if (!isNaN(Date.parse(lastUpdate))) {
        return lastUpdate;
    }

    const match = lastUpdate.match(/^(\d{2})\/(\d{2})\/(\d{2})(?: \d{2}:\d{2}:\d{2})?$/);
    if (match) {
        const [, yy, mm, dd] = match;
        const yyyy = Number(yy) < 50 ? "20" + yy : "19" + yy;
        return `${yyyy}-${mm}-${dd}`; // ISO date without time
    }

    return formatLastUpdate(lastUpdate);
}

export default getFormattedLastUpdate;