import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import pool from '@/lib/db';


export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { novelId } = await request.json();

        if (!novelId) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        await pool.query(
            'DELETE FROM user_novel WHERE user_id = ? AND novel_id = ?',
            [session.user.id, novelId]
        );


        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error removing novel from library:', error);
        return NextResponse.json(
            { error: 'Failed to remove novel from library' },
            { status: 500 }
        );
    }
}