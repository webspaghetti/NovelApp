import { Inter } from "next/font/google";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { fetchAllNovels, fetchAllUserNovels, fetchUserGeneralTemplates, getUserTemplates } from "@/lib/commonQueries";
import ProfilePageClient from "@/components/profile/ProfilePageClient";


const inter = Inter({ subsets: ["latin"] });


async function ProfilePage() {
    const session = await getServerSession(authOptions);

    const novelList = await fetchAllNovels(session.user.id);
    const userNovels = await fetchAllUserNovels(session.user.id);
    const templateList = await getUserTemplates(session.user.id);

    const getUserGeneralTemplates = await fetchUserGeneralTemplates(session.user.id);


    return (
        <>
            <ProfilePageClient session={session} novels={novelList} userNovels={userNovels} templateList={templateList} inter={inter} userObject={getUserGeneralTemplates} />
        </>
    );
}


export default ProfilePage;