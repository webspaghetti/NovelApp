import { notFound } from "next/navigation";
import { fetchNovelByFormattedNameAndSource } from "@/app/helper-functions/fetchNovelByFormattedNameAndSource";
import NovelPageWrapper from "@/components/novel-page/NovelPageWrapper";
import {cookies} from "next/headers";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/lib/auth";


async function getUsersNovel(userId, novelId) {
    try {
        const cookieStore = cookies();
        const headers = {
            'Cookie': cookieStore.toString()
        };

        const response = await fetch(
            `${process.env.PUBLIC_API_URL}/api/user_novel?userId=${encodeURIComponent(userId)}&novelId=${encodeURIComponent(novelId)}`, {
                cache: 'no-store',
                headers: headers
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        return data[0];
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
}


async function Page({ params }) {
async function Page({ params, searchParams }) {
    const { formatted_name } = params;
    const source = searchParams.source;

    const novel = await fetchNovelByFormattedNameAndSource(formatted_name, source);

    if (!novel) {
        notFound();
    }

    const userNovel = await getUsersNovel(1, novel.id);


    return (
        <main className="relative pt-20">
            <NovelPageWrapper novel={novel} userNovel={userNovel} />
        </main>
    );
}


export default Page;