import { NextResponse } from 'next/server';
import pool from '@/lib/db';


export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const novelId = searchParams.get('novelId');

    try {
        let query, params;
        if (novelId) {
            query = 'SELECT * FROM user_novel WHERE user_id = ? AND novel_id = ?';
            params = [userId, novelId];
        } else {
            query = 'SELECT * FROM user_novel WHERE user_id = ?';
            params = [userId];
        }

        const [rows] = await pool.query(query, params);
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching user novel:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}


export async function POST(request) {
    try {
        const { userId, novelId } = await request.json();

        const [result] = await pool.query(
            'INSERT INTO user_novel (user_id, novel_id, read_chapters) VALUES (?, ?, ?)',
            [userId, novelId, '[]']
        );

        return NextResponse.json({ id: result.insertId, userId, novelId, read_chapters: '[]' }, { status: 201 });
    } catch (error) {
        console.error('Error creating user novel:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}


export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const novelId = searchParams.get('novelId');

    if (!userId || !novelId) {
        return NextResponse.json({ message: 'userId and novelId query parameters are required' }, { status: 400 });
    }

    try {
        // Delete the user-novel connection from the user_novel table
        const [result] = await pool.query(
            'DELETE FROM user_novel WHERE user_id = ? AND novel_id = ?',
            [userId, novelId]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: "User-novel connection not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User-novel connection deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error('Error deleting user-progress connection:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
