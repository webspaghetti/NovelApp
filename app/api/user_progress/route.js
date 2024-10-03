import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const novelId = searchParams.get('novelId');

    try {
        let query, params;
        if (novelId) {
            query = 'SELECT * FROM user_progress WHERE user_id = ? AND novel_id = ?';
            params = [userId, novelId];
        } else {
            query = 'SELECT * FROM user_progress WHERE user_id = ?';
            params = [userId];
        }

        const [rows] = await pool.query(query, params);
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching user progress:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { userId, novelId } = await request.json();

        const [result] = await pool.query(
            'INSERT INTO user_progress (user_id, novel_id, read_chapters) VALUES (?, ?, ?)',
            [userId, novelId, '[]']
        );

        return NextResponse.json({ id: result.insertId, userId, novelId, read_chapters: '[]' }, { status: 201 });
    } catch (error) {
        console.error('Error creating user progress:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const { userId, novelId, currentChapter } = await request.json();

        const [result] = await pool.query(
            `UPDATE user_progress SET read_chapters = IF(JSON_CONTAINS(read_chapters, ?), read_chapters,
                                                         JSON_ARRAY_APPEND(read_chapters, '$', ?)), current_chapter = ? WHERE user_id = ? AND novel_id = ?`,
            [currentChapter, currentChapter, currentChapter, userId, novelId]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: "No matching record found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User progress updated successfully" }, { status: 200 });
    } catch (error) {
        console.error('Error updating user progress:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}