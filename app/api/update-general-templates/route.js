import pool from "@/lib/db";
import { NextResponse } from "next/server";


export async function PUT(request) {
    try {
        const { userId, deviceType, templateId } = await request.json();

        if (!userId || !deviceType || !templateId) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        let query = "";
        let values = [];

        switch (deviceType) {
            case "normal":
                query = "UPDATE users SET normal_general_template_id = ? WHERE id = ?";
                values = [templateId, userId];
                break;
            case "small":
                query = "UPDATE users SET small_general_template_id = ? WHERE id = ?";
                values = [templateId, userId];
                break;
            default:
                return NextResponse.json({ message: "Invalid device type" }, { status: 400 });
        }

        const [result] = await pool.query(query, values);

        return NextResponse.json(
            { message: "Template updated successfully", affectedRows: result.affectedRows },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error updating template:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}