import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserTemplates } from "@/lib/commonQueries";
import AddNewReaderTemplate from "@/components/templates/AddNewReaderTemplate";
import EditReaderTemplate from "@/components/templates/EditReaderTemplate";
import NavBar from "@/components/general/layout/NavBar";


async function Page() {
    const session = await getServerSession(authOptions);

    const userTemplateList = await getUserTemplates(session.user.id);


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

                        {/* Overall Page Customization Section */}
                        <section>
                            <div className="mb-4 sm:mb-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-200 mb-1">
                                    Overall Page Customization
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
                                    <button
                                        aria-label="Add Page Customization Template"
                                        className="group relative px-4 py-6 sm:px-6 sm:py-8 text-sm text-gray-400 flex flex-col items-center justify-center bg-main_background border-2 border-dashed border-gray-700 rounded-xl sm:hover:border-green-500 sm:hover:bg-gray-800/50 transition-all duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 sm:size-16 mb-2 sm:mb-3 sm:group-hover:scale-105 sm:group-hover:text-green-500 transition-all duration-300">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        <span className="text-xs font-medium sm:group-hover:text-green-500 transition-colors">
                                            Create Template
                                        </span>
                                    </button>
                                </div>

                                {/* Edit Page Template */}
                                <div className="flex flex-col">
                                    <label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 sm:mb-3">
                                        Edit Template
                                    </label>
                                    <button
                                        aria-label="Delete Page Customization Template"
                                        className="group relative px-4 py-6 sm:px-6 sm:py-8 text-sm text-gray-400 flex flex-col items-center justify-center bg-main_background border-2 border-gray-700 rounded-xl sm:hover:border-blue-500/50 sm:hover:bg-gray-800/50 transition-all duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 sm:size-16 mb-2 sm:mb-3 sm:group-hover:scale-105 sm:group-hover:text-blue-500 transition-all duration-300">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        <span className="text-xs font-medium sm:group-hover:text-blue-500 transition-colors">
                                            Edit Template
                                        </span>
                                    </button>
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