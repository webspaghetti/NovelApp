import { useEffect } from 'react';
import executeQuery from "@/app/database/db";

export default function SetUserProgress({ userID, novelID, currentChapter }) {

    useEffect(() => {
        async function updateProgress() {
            try {
                if (novelID !== undefined){
                    await executeQuery(`UPDATE user_progress SET read_chapters = CASE WHEN JSON_CONTAINS(read_chapters, '${currentChapter}') THEN read_chapters ELSE JSON_ARRAY_APPEND(read_chapters, '$', ${currentChapter}) END, current_chapter = ${currentChapter} WHERE user_id = ${userID} AND novel_id = ${novelID};`)
                }
            } catch (error) {
                console.error(error);
            }
        }

        updateProgress();
    }, [userID, novelID, currentChapter]);
}
