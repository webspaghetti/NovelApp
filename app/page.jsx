import { cookies } from "next/headers";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { fetchAllNovels, fetchAllUserNovels, fetchUserGeneralTemplates, getUserTemplates } from "@/lib/commonQueries";
import HomeClient from "@/components/homepage/HomeClient";


async function Home() {
    const session = await getServerSession(authOptions);

    const novelList = await fetchAllNovels(session.user.id);
    const userNovels = await fetchAllUserNovels(session.user.id);
    const userTemplateList = (await getUserTemplates(session.user.id)).filter(template => template.type === "general");

    const getUserGeneralTemplates = await fetchUserGeneralTemplates(session.user.id);
    const cookieStore = cookies();
    const savedSort = cookieStore.get('novel-sort')?.value || 'added-asc';


    return (
        <>
            <HomeClient novelList={novelList} userNovel={userNovels} userTemplateList={userTemplateList} session={session} userObject={getUserGeneralTemplates} savedSort={savedSort} />
        </>
    );
}


export default Home;