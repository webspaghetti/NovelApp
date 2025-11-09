import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import NavBar from "@/components/general/layout/NavBar";
import HomeClient from "@/components/homepage/HomeClient";


async function Home() {
    const session = await getServerSession(authOptions);

    const novelList = await fetchAllNovels(session.user.id);
    const userNovels = await fetchAllUserNovels(session.user.id);
    const userTemplateList = (await getUserTemplates(session.user.id)).filter(template => template.type === "general");

    const getUserGeneralTemplates = await fetchUserGeneralTemplates(session.user.id);

    return (
        <>
            <NavBar />
        </>
    );
}


export default Home;