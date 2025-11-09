import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { fetchUserGeneralTemplates, getUserTemplates } from "@/lib/commonQueries";
import SourcesClient from "@/components/sources/SourcesClient";


async function SourcePage() {
    const session = await getServerSession(authOptions);
    const templateList = await getUserTemplates(session.user.id);
    const getUserGeneralTemplates = await fetchUserGeneralTemplates(session.user.id);

    return (
        <>
            <SourcesClient templateList={templateList} userObject={getUserGeneralTemplates} />
        </>
    );
}


export default SourcePage;