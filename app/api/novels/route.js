import { NextResponse } from 'next/server';
import pool from '@/lib/db';


export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const formattedName = searchParams.get('formattedName');
    const source = searchParams.get('source');

    try {
        let query, params;

        // Filter by novel formatted name
        query = 'SELECT * FROM novel_table WHERE formatted_name = ? AND source = ?';
        params = [formattedName, source];

        const [rows] = await pool.query(query, params);

        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching novels:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}


export async function POST(request) {
    try {
        // Destructure the source from the incoming request body
        const { name, formattedName, chapterCount, status, latestUpdate, imageUrl, source } = await request.json();

        // Check for existing novel by formatted name
        const [existingNovel] = await pool.query(
            'SELECT * FROM novel_table WHERE formatted_name = ?',
            [formattedName]
        );

        // If the novel already exists, return a duplicate entry message
        if (existingNovel.length > 0) {
            return NextResponse.json({
                message: 'Duplicate entry: Novel already exists',
                isDuplicate: true
            }, { status: 200 });
        }

        // Insert the new novel into the database
        const [result] = await pool.query(
            'INSERT INTO novel_table (name, formatted_name, chapter_count, status, latest_update, image_url, source) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, formattedName, chapterCount, status, latestUpdate, imageUrl, source]
        );

        return NextResponse.json({ id: result.insertId, name, formattedName, chapterCount, status, latestUpdate, imageUrl, source }, { status: 201 });
    } catch (error) {
        console.error('Error creating novel:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}


export async function PUT(request) {
    try {
        const { formattedName, chapterCount, status, latestUpdate } = await request.json();

        const [result] = await pool.query(
            'UPDATE novel_table SET chapter_count = ?, status = ?, latest_update = ? WHERE formatted_name = ?',
            [chapterCount, status, latestUpdate, formattedName]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: "No matching novel found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Novel updated successfully" }, { status: 200 });
    } catch (error) {
        console.error('Error updating novel:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}