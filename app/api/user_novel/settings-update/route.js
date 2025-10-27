import pool from "@/lib/db";
import { NextResponse } from "next/server";


export async function PUT(request) {
    try {
        const { userId, novelId, nameAlternative, imageUrlAlternative, normalTemplateId, smallTemplateId } = await request.json();

        const [result] = await pool.query(
            'UPDATE user_novel SET name_alternative = ?, image_url_alternative = ?, normal_template_id = ?, small_template_id = ? WHERE user_id = ? AND novel_id = ?',
            [nameAlternative, imageUrlAlternative, normalTemplateId, smallTemplateId, userId, novelId]
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