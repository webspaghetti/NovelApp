import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { fetchNovelByFormattedNameAndSource, getUserNovel, getUserTemplates } from "@/lib/commonQueries";
import NovelPageWrapper from "@/components/novel-page/NovelPageWrapper";


async function Page({ params, searchParams }) {
    const session = await getServerSession(authOptions);
    const { formatted_name } = params;
    const source = Object.keys(searchParams || {})[0] ?? null;

    const novel = await fetchNovelByFormattedNameAndSource(formatted_name, source);


    if (!novel || !source) {
        notFound();
    }

    const userNovel = await getUserNovel(session.user.id, novel.id);
    const userTemplateList = await getUserTemplates(session.user.id);

    if (!userNovel) {
        notFound();
    }

    return (
        <main className="relative pt-20">
            <NovelPageWrapper novel={novel} userNovel={userNovel} session={session} userTemplateList={userTemplateList} />
        </main>
    );
}


export default Page;