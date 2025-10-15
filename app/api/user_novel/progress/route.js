import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request) {
    try {
        const { userId, novelId, currentChapter } = await request.json();

        const [result] = await pool.query(
            `UPDATE user_novel SET read_chapters = IF(JSON_CONTAINS(read_chapters, ?), read_chapters,
                                                         JSON_ARRAY_APPEND(read_chapters, '$', ?)), current_chapter = ? WHERE user_id = ? AND novel_id = ?`,
            [currentChapter, currentChapter, currentChapter, userId, novelId]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: "No matching record found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User novel updated successfully" }, { status: 200 });
    } catch (error) {
        console.error('Error updating user progress:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}