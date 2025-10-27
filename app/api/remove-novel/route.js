import pool from '@/lib/db';


export async function DELETE(request) {
    const { userId, novelId } = await request.json();

    const connection = await pool.getConnection();


    try {
        await connection.beginTransaction();

        await connection.execute(
            'DELETE FROM user_novel WHERE user_id = ? AND novel_id = ?',
            [userId, novelId]
        );

        await connection.execute(
            'DELETE FROM novel_table WHERE id = ?',
            [novelId]
        );

        await connection.commit();
        return new Response(null, { status: 200 });
    } catch (error) {
        await connection.rollback();
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500
        });
    } finally {
        connection.release();
    }
}