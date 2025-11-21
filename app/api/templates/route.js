import pool from "@/lib/db";
import {NextResponse} from "next/server";


export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    try {
        let query, params;

        // Filter by novel formatted name
        query = 'SELECT * FROM templates WHERE user_id = ?';
        params = [userId];

        const [rows] = await pool.query(query, params);

        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching templates:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}


export async function POST(request) {
    try {
        const { userId, templateName, readerCustomization, type } = await request.json();

        const [result] = await pool.query(
            'INSERT INTO templates (user_id, type, name, customization) VALUES (?, ?, ?, ?)',
            [userId, type, templateName, JSON.stringify(readerCustomization)]
        );

        return NextResponse.json({ id: result.insertId, type, templateName, readerCustomization }, { status: 201 });
    } catch (error) {
        console.error('Error creating template:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}


export async function PUT(request) {
    try {
        const { id, readerCustomization, templateName } = await request.json();

        const [result] = await pool.query(
            'UPDATE templates SET customization = ?, name = ? WHERE id = ?',
            [JSON.stringify(readerCustomization), templateName, id]
        );

        return NextResponse.json({ id: result.insertId, readerCustomization }, { status: 201 });
    } catch (error) {
        console.error('Error updating template:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}


export async function DELETE(request) {
    try {
        const { id } = await request.json();

        const [templates] = await pool.query(
            'SELECT type FROM templates WHERE id = ?',
            [id]
        );

        if (templates.length === 0) {
            return NextResponse.json({ message: 'Template not found' }, { status: 404 });
        }

        const templateType = templates[0].type;

        if (templateType === 'general') {
            await pool.query(
                `UPDATE users 
                SET normal_general_template_id = 3
                WHERE normal_general_template_id = ?`,
                [id]
            );

            await pool.query(
                `UPDATE users 
                SET small_general_template_id = 3
                WHERE small_general_template_id = ?`,
                [id]
            );
        }

        if (templateType === 'reader') {
            await pool.query(
                `UPDATE user_novel 
                SET normal_template_id = 1
                WHERE normal_template_id = ?`,
                [id]
            );

            await pool.query(
                `UPDATE user_novel 
                SET small_template_id = 2
                WHERE small_template_id = ?`,
                [id]
            );
        }

        await pool.query(
            'DELETE FROM templates WHERE id = ?',
            [id]
        );

        return NextResponse.json({ id, deleted: true }, { status: 200 });
    } catch (error) {
        console.error('Error deleting template:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}