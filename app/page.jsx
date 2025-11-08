import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { fetchAllNovels, fetchAllUserNovels } from "@/lib/commonQueries";
import NavBar from "@/components/general/layout/NavBar";
import HomeClient from "@/components/homepage/HomeClient";


async function Home() {
    const session = await getServerSession(authOptions);

    const novelList = await fetchAllNovels(session.user.id);
    const userNovels = await fetchAllUserNovels(session.user.id);


    return (
        <>
            <NavBar />
            <HomeClient novelList={novelList} userNovel={userNovels} session={session} />;
        </>
    );
}


export default Home;