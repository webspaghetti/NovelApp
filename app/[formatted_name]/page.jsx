import { notFound } from "next/navigation";
import { fetchNovelByFormattedName } from "@/app/helper-functions/fetchNovelByFormattedName";
import NovelPageWrapper from "@/components/novel-page/NovelPageWrapper";


async function getUsersNovel(userId, novelId) {
    try {
        const response = await fetch(
            `${process.env.PUBLIC_API_URL}/api/user_novel?userId=${encodeURIComponent(userId)}&novelId=${encodeURIComponent(novelId)}`,
            { cache: 'no-store' }
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
    const { formatted_name } = params;

    const novel = await fetchNovelByFormattedName(formatted_name);

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