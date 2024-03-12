import { useState, useEffect } from 'react';
import executeQuery from "@/app/database/db";

export default function GetNovel({ formattedName }) {
    const [chapterCount, setChapterCount] = useState(0);

    useEffect(() => {
        async function fetchChapterCount() {
            try {
                const novels = await executeQuery(`SELECT * FROM novel_table WHERE formatted_name = '${formattedName}'`);
                const novel = novels[0];
                setChapterCount(novel.chapter_count);
            } catch (error) {
                console.error(error);
            }
        }

        fetchChapterCount();
    }, [formattedName]);

    return chapterCount;
}
