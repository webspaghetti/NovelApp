import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserTemplates } from "@/lib/commonQueries";
import AddNewReaderTemplate from "@/components/templates/AddNewReaderTemplate";
import EditReaderTemplate from "@/components/templates/EditReaderTemplate";
import NavBar from "@/components/general/layout/NavBar";
import AddNewGeneralTemplate from "@/components/templates/AddNewGeneralTemplate";
import EditGeneralTemplate from "@/components/templates/EditGeneralTemplate";


async function Page() {
    const session = await getServerSession(authOptions);

    const userTemplateList = await getUserTemplates(session.user.id);
    const readerTemplateList = userTemplateList.filter(template => template.type === "reader");
    const generalTemplateList = userTemplateList.filter(template => template.type === "general");


    return (
        <>
            <NavBar />
            <div className="min-h-screen max-sm:mt-16 max-lg:mt-16 p-4 sm:p-6 lg:p-8">
                <div className="max-w-5xl mx-auto mt-8 sm:mt-12 lg:mt-20">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-2">
                            Customization Templates
                        </h1>
                        <p className="text-sm sm:text-base text-gray-400">
                            Manage your reader and page customization templates
                        </p>
                    </div>

                    {/* Template Sections */}
                    <div className="space-y-8 sm:space-y-12">
                        {/* Reader Customization Section */}
                        <section>
                            <div className="mb-4 sm:mb-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-200 mb-1">
                                    Reader Customization
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-400">
                                    Control how your reading content appears
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {/* Add Reader Template */}
                                <div className="flex flex-col">
                                    <label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 sm:mb-3">
                                        Add New Template
                                    </label>
                                    <AddNewReaderTemplate userId={session.user.id} userTemplateList={readerTemplateList} />
                                </div>

                                {/* Edit Reader Template */}
                                <div className="flex flex-col">
                                    <label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 sm:mb-3">
                                        Edit Template
                                    </label>
                                    <EditReaderTemplate userId={session.user.id} userTemplateList={readerTemplateList} />
                                </div>
                            </div>
                        </section>

                        {/* General Page Customization Section */}
                        <section>
                            <div className="mb-4 sm:mb-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-200 mb-1">
                                    General Page Customization
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-400">
                                    Customize the entire page layout and styling
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {/* Add Page Template */}
                                <div className="flex flex-col">
                                    <label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 sm:mb-3">
                                        Add New Template
                                    </label>
                                    <AddNewGeneralTemplate userId={session.user.id} userTemplateList={generalTemplateList} />
                                </div>

                                {/* Edit Page Template */}
                                <div className="flex flex-col">
                                    <label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 sm:mb-3">
                                        Edit Template
                                    </label>
                                    <EditGeneralTemplate userId={session.user.id} userTemplateList={generalTemplateList} />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Page;