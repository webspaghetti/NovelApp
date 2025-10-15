import Link from "next/link";
import sourceConfig from "@/config/sourceConfig"
import { notFound } from "next/navigation";
import { updateUsersProgress } from "@/app/helper-functions/updateUsersProgress";
import { fetchNovelByFormattedName } from "@/app/helper-functions/fetchNovelByFormattedName";
import ChapterDetails from "@/components/chapter-page/ChapterDetails";
import ChapterNavigation from "@/components/chapter-page/ChapterNavigation";
import ChapterStyleWrapper from "@/components/chapter-page/ChapterStyleWrapper";


async function fetchChapterContent(url) {
    const response = await fetch(`${process.env.PUBLIC_API_URL}/api/scrape`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch chapter content');
    }

    const data = await response.json();
    return data.content;
}


async function Page({ params }) {
    const { formatted_name, chapter: chapterParam } = params;

    const novelData = await fetchNovelByFormattedName(formatted_name);

    if (!novelData) {
        notFound();
    }

    const currentChapter = parseInt(chapterParam);

    // Validate chapter number
    if (
        currentChapter > novelData.chapter_count ||
        currentChapter < 1 ||
        isNaN(currentChapter)
    ) {
        notFound();
    }

    // Update user progress
    await updateUsersProgress(1, novelData.id, currentChapter);

    // Get chapter link and fetch content
    const link = sourceConfig[novelData.source].getChapterLink(params);
    const chapter = await fetchChapterContent(link);

    const prevChapter = currentChapter - 1;
    const nextChapter = currentChapter + 1;


    return (
        <ChapterStyleWrapper>
            <main className={"px-5"}>
                <div>
                    <div className="flex justify-start mb-5">
                        <Link href={`/${formatted_name}`}>
                            <button className={"group"}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="max-sm:w-6 max-sm:h-6 w-7 h-7 sm:ml-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                                </svg>
                                <span className="max-sm:hidden overflow-hidden opacity-0 max-w-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-1000 ease-in-out">
                                    <span className="pl-2 whitespace-nowrap">Back</span>
                                </span>
                            </button>
                        </Link>
                    </div>

                    <h1 className="border-b-gray-400 border-b-2 text-center max-sm:text-2xl text-3xl mb-4 pb-6 chapter-title">
                        {chapter.chapterTitle || "Failed to display"}
                    </h1>

                    <ChapterDetails chapter={chapter} />
                    <ChapterNavigation
                        prevChapter={prevChapter}
                        nextChapter={nextChapter}
                        currentChapter={currentChapter}
                        chapterCount={novelData.chapter_count}
                        formattedName={formatted_name}
                    />
                </div>
            </main>
        </ChapterStyleWrapper>
    );
}


export default Page;