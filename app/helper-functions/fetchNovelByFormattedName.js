export async function fetchNovelByFormattedName(formatted_name) {
    try {
        const response = await fetch(`/api/novels?formattedName=${encodeURIComponent(formatted_name)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch novel');
        }
        const data = await response.json();
        return data[0];

    } catch (error) {
        console.error("Oops, an error occurred:", error);
        return null;
    }
}