export default async function GetNovel(f_name) {
    try {
        const response = await fetch(`/api/novels?formattedName=${encodeURIComponent(f_name)}`);
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
