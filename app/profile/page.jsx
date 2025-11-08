import { Inter } from "next/font/google";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { fetchAllNovels, fetchAllUserNovels, getUserTemplates } from "@/lib/commonQueries";
import NavBar from "@/components/general/layout/NavBar";
import ProfilePageClient from "@/components/profile/ProfilePageClient";


const inter = Inter({ subsets: ["latin"] });


async function ProfilePage() {
    const session = await getServerSession(authOptions);

    const novelList = await fetchAllNovels(session.user.id);
    const userNovels = await fetchAllUserNovels(session.user.id);
    const templateList = await getUserTemplates(session.user.id);


    return (
        <>
            <NavBar />
            <ProfilePageClient session={session} novels={novelList} userNovels={userNovels} templateList={templateList} inter={inter} />
        </>
    );
}


export default ProfilePage;