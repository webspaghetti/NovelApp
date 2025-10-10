export async function fetchNovelByFormattedName(formatted_name) {
    try {
        const response = await fetch(`/api/novels?formattedName=${encodeURIComponent(formatted_name)}`);
        if (!response.ok) {
            console.error("Failed to fetch novel");
            return;
        }
        const data = await response.json();
        return data[0];

    } catch (error) {
        console.error("Oops, an error occurred:", error);
        return null;
    }
}