"use client";
import Link from "next/link";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { fetchNovelByFormattedName } from "@/app/helper-functions/fetchNovelByFormattedName";
import { notFound } from "next/navigation";
import { ChapterPageSkeleton } from "@/components/general/SkeletonLoaders";
import { updateUsersProgress } from "@/app/helper-functions/updateUsersProgress";
import ChapterDetails from "@/components/chapter-page/ChapterDetails";
import ChapterNavigation from "@/components/chapter-page/ChapterNavigation";


const inter = Inter({ subsets: ["latin"] });


function Page({ params }) {
    const [isLoading, setIsLoading] = useState(true);
    const [chapter, setChapter] = useState({});
    const [currentChapter, setCurrentChapter] = useState(null);
    const [chapterCount, setChapterCount] = useState(null);
    const [triggerNotFound, setTriggerNotFound] = useState(false);


    useEffect(() => {
        async function fetchNovelAndChapter() {
            try {
                // Fetch novel data
                const novelData = await fetchNovelByFormattedName(params.formatted_name);
                const currentChapterNum = parseInt(params.chapter);

                if (
                    currentChapterNum > novelData.chapter_count ||
                    currentChapterNum < 1 ||
                    isNaN(currentChapterNum)
                ) {
                    setTriggerNotFound(true);
                    return; // Exit early to avoid bad fetch or progress update
                }

                setCurrentChapter(currentChapterNum);
                setChapterCount(novelData.chapter_count);

                // Update user progress after validation
                updateUsersProgress(1, novelData.id, currentChapterNum);

                const link = novelData.source === "freewebnovel"
                    ? `https://freewebnovel.com/novel/${params.formatted_name}/chapter-${params.chapter}`
                    : `https://www.lightnovelworld.co/novel/${params.formatted_name}/chapter-${params.chapter}`;

                // Fetch chapter content using the API
                const response = await fetch("/api/scrape", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ url: link }),
                });

                if (!response.ok) {
                    console.error("Failed to fetch chapter content");
                    return;
                }

                const data = await response.json();
                setChapter(data.content);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        }

        fetchNovelAndChapter();
    }, [params.formatted_name, params.chapter]);

    const prevChapter = currentChapter - 1;
    const nextChapter = currentChapter + 1;


    return (
        <main className={"px-5"}>
            <style jsx global>{`
                body {
                  background-image: none;
                  background-color: #171717;
                  .chapter-title {
                    color: #5e42fc;
                  }
                  .chapter-content {
                    color: #FAFAFA;
                    font-family: ${inter.style.fontFamily};
                  }
                }
            `}</style>

            {isLoading && (
                <ChapterPageSkeleton />
            )}

            {triggerNotFound && (
                notFound()
            )}

            {!isLoading && !triggerNotFound && (
                <>
                    <div>
                        <div className="flex justify-start mb-5">
                            <Link href={`/${params.formatted_name}`}>
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
                            chapterCount={chapterCount}
                            formattedName={params.formatted_name}
                        />
                    </div>
                </>
            )}
        </main>
    );
}


export default Page;