import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function fetchAllNovels(userId) {
    try {
        let query, params;

        query = `
                SELECT n.*
                FROM novel_table n
                JOIN user_novel un ON n.id = un.novel_id
                WHERE un.user_id = ?
            `;
        params = [userId];

        const [rows] = await pool.query(query, params);

        return rows;
    } catch (error) {
        console.error('Error fetching novels:', error);
        return [];
    }
}

export async function fetchAllUserNovels(userId) {
    try {
        let query, params;

        query = 'SELECT * FROM user_novel WHERE user_id = ?';
        params = [userId];

        const [rows] = await pool.query(query, params);

        return rows;
    } catch (error) {
        console.error('Error fetching user novel:', error);
        return null;
    }
}

export async function fetchUserGeneralTemplates(userId) {
    try {
        let query, params;

        query = 'SELECT normal_general_template_id, small_general_template_id FROM users WHERE id = ?';
        params = [userId];

        const [rows] = await pool.query(query, params);

        return rows;
    } catch (error) {
        console.error('Error fetching user novel:', error);
        return null;
    }
}

export async function fetchNovelByFormattedNameAndSource(formatted_name, source) {
    try {
        let query, params;

        query = 'SELECT * FROM novel_table WHERE formatted_name = ? AND source = ?';
        params = [formatted_name, source];

        const [rows] = await pool.query(query, params);

        return rows[0];

    } catch (error) {
        console.error("Oops, an error occurred:", error);
        return null;
    }
}


export async function updateUsersProgress(userID, novelID, currentChapter, formattedName, source) {
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
        revalidatePath(`/${formattedName}?${source}`);

        return true;
    } catch (error) {
        console.error('Error updating user progress:', error);
        return false;
    }
}


export async function getUserNovel(userId, novelId){
    try {
        let query, params;

        query = 'SELECT * FROM user_novel WHERE user_id = ? AND novel_id = ?';
        params = [userId, novelId];

        const [rows] = await pool.query(query, params);

        return rows[0];
    } catch (error) {
        console.error('Error fetching user novel:', error);
        return null;
    }
}


export async function getUserTemplates(userId) {
    try {
        let query, params;

        query = 'SELECT * FROM templates WHERE user_id = ? OR user_id IS NULL';
        params = [userId];

        const [rows] = await pool.query(query, params);

        return rows;
    } catch (error) {
        console.error('Error fetching user templates:', error);
        return null;
    }
}