import { useState, useEffect } from 'react';
import executeQuery from "@/app/database/db";

export default function GetNovel({ formattedName }) {
    const [fetchedData, setFetchedData] = useState(0);

    useEffect(() => {
        async function fetchNovel() {
            try {
                const novels = await executeQuery(`SELECT * FROM novel_table WHERE formatted_name = '${formattedName}'`);
                setFetchedData(novels[0]);
            } catch (error) {
                console.error(error);
            }
        }

        fetchNovel();
    }, [formattedName]);

    return fetchedData;
}
