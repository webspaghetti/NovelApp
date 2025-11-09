import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request) {
    try {
        const { novelId } = await request.json();

        const [result] = await pool.query(
            'UPDATE novel_table SET last_synced_at = NOW() WHERE id = ?',
            [novelId]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: "No matching novel found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Sync updated successfully" }, { status: 200 });
    } catch (error) {
        console.error('Error updating novel sync:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}