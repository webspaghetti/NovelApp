import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import HomeClient from "@/components/homepage/HomeClient";
import pool from "@/lib/db";

async function fetchNovels(userId) {
    try {
        let query, params;

        query = `
                SELECT n.*
                FROM novel_table n
                JOIN user_novel un ON n.id = un.novel_id
                WHERE un.user_id = ?
            `;
        params = [userId];

        const [rows] = await pool.query(query, params);

        return rows;
    } catch (error) {
        console.error('Error fetching novels:', error);
        return [];
    }
}

async function fetchUserNovel(userId) {
    try {
        let query, params;

        query = 'SELECT * FROM user_novel WHERE user_id = ?';
        params = [userId];

        const [rows] = await pool.query(query, params);

        return rows;
    } catch (error) {
        console.error('Error fetching user novel:', error);
        return null;
    }
}

async function Home() {
    const session = await getServerSession(authOptions);

    return <HomeClient novelList={novelList} userNovel={userNovel} />;
    const novelList = await fetchNovels(session.user.id);
    const userNovel = await fetchUserNovel(session.user.id);

}

export default Home;