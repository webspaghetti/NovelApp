import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { fetchNovelByFormattedNameAndSource } from "@/lib/commonQueries";
import NovelPageWrapper from "@/components/novel-page/NovelPageWrapper";
import pool from "@/lib/db";


async function getUsersNovel(userId, novelId) {
    try {
        let query, params;

        query = 'SELECT * FROM user_novel WHERE user_id = ? AND novel_id = ?';
        params = [userId, novelId];

        const [rows] = await pool.query(query, params);

        return rows[0];
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
}


async function Page({ params, searchParams }) {
    const session = await getServerSession(authOptions);
    const { formatted_name } = params;
    const source = Object.keys(searchParams || {})[0] ?? null;

    const novel = await fetchNovelByFormattedNameAndSource(formatted_name, source);


    if (!novel || ! source) {
        notFound();
    }

    const userNovel = await getUsersNovel(session.user.id, novel.id);


    return (
        <main className="relative pt-20">
            <NovelPageWrapper novel={novel} userNovel={userNovel} session={session} />
        </main>
    );
}


export default Page;