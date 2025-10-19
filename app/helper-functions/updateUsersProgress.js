import pool from "@/lib/db";
import { revalidatePath } from 'next/cache';

export async function updateUsersProgress(userID, novelID, currentChapter, formattedName) {
    if (novelID === undefined) return;

    try {
        const [result] = await pool.query(
            `UPDATE user_novel 
             SET read_chapters = IF(JSON_CONTAINS(read_chapters, ?), read_chapters,
                                   JSON_ARRAY_APPEND(read_chapters, '$', ?)), 
                 current_chapter = ?, last_read=NOW()
             WHERE user_id = ? AND novel_id = ?`,
            [currentChapter, currentChapter, currentChapter, userID, novelID]
        );

        if (result.affectedRows === 0) {
            console.warn("No matching user_novel record found");
            return false;
        }

        // THIS IS THE KEY: Revalidate the novel detail page cache
        revalidatePath(`/${formattedName}`);

        return true;
    } catch (error) {
        console.error('Error updating user progress:', error);
        return false;
    }
}