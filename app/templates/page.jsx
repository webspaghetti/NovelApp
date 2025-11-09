import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { fetchUserGeneralTemplates, getUserTemplates } from "@/lib/commonQueries";
import TemplatePageClient from "@/components/templates/TemplatePageClient";


async function Page() {
    const session = await getServerSession(authOptions);

    const userTemplateList = await getUserTemplates(session.user.id);
    const getUserGeneralTemplates = await fetchUserGeneralTemplates(session.user.id);


    return (
        <>
            <TemplatePageClient templateList={userTemplateList} session={session} userObject={getUserGeneralTemplates} />
        </>
    );
}

export default Page;