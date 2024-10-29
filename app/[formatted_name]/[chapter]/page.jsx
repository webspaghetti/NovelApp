"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import GetNovel from "@/components/functions/GetNovel";
import SetUserProgress from "@/components/functions/SetUserProgress";
import { notFound } from "next/navigation";
import {ChapterSkeleton} from "@/components/Skeletons";

function Page({ params }) {
    const [isLoading, setIsLoading] = useState(true);
    const [chapter, setChapter] = useState({});
    const [novel, setNovel] = useState(null);
    const [currentChapter, setCurrentChapter] = useState(null);
    const [chapterCount, setChapterCount] = useState(null);
    const [triggerNotFound, setTriggerNotCount] = useState (false)

    useEffect(() => {
        async function fetchNovelAndChapter() {
            try {
                // Fetch novel data
                const novelData = await GetNovel(params.formatted_name);
                setNovel(novelData);

                const currentChapterNum = parseInt(params.chapter);

                // Move this check before any state updates
                if (currentChapterNum > novelData.chapter_count || currentChapterNum < 1 || isNaN(currentChapterNum)) {
                    setTriggerNotCount(true);
                }

                setNovel(novelData);
                setCurrentChapter(currentChapterNum);
                setChapterCount(novelData.chapter_count);

                // Determine the link based on the novel source
                const link = novelData.source === 'freewebnovel'
                    ? `https://freewebnovel.com/${params.formatted_name}/chapter-${params.chapter}.html`
                    : `https://www.lightnovelworld.co/novel/${params.formatted_name}/chapter-${params.chapter}`;

                // Fetch chapter content using the API
                const response = await fetch('/api/scrape', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url: link }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch chapter content');
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

    if (isLoading) {
        return <ChapterSkeleton />;
    }

    const prevChapter = currentChapter - 1;
    const nextChapter = currentChapter + 1;

    return (
        <main className={'px-5'}>
            <style jsx global>{`
              body {
                background-image: none;
                background-color: #171717;
              }
            `}</style>

            {triggerNotFound ? (
                notFound()
            ) : (
                <>
                    <div>
                        <div className="flex justify-start mb-5">
                            <Link href={`/${params.formatted_name}`}>
                                <button className={'group'}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="max-sm:w-6 max-sm:h-6 w-7 h-7 sm:ml-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                                    </svg>
                                    <span className="max-sm:hidden overflow-hidden opacity-0 max-w-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-1000 ease-in-out">
                                        <span className="pl-2 whitespace-nowrap">Back</span>
                                    </span>
                                </button>
                            </Link>
                        </div>

                        <h1 className="border-b-gray-400 border-b-2 text-center max-sm:text-2xl text-3xl mb-4 pb-6">
                            {chapter.chapterTitle || "Failed to display"}
                        </h1>

                        <div className="text-secondary max-sm:text-base text-lg pb-4 border-b-gray-400 border-b-2">
                            {chapter.chapterContent ? (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: chapter.chapterContent.replace(/<p>/g, '<p style="margin: 1rem 0;">')
                                    }}
                                />
                            ) : (
                                <div className={'text-center text-xl'}>
                                    <p>This is most likely caused by the novel using partial chapter structure (1.1, 1.2, etc.).</p>
                                    <p>Unfortunately, right now this makes these novels unavailable.</p>
                                    <p>We&apos;re sorry :(</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between py-4">
                            {currentChapter > 1 &&(
                                <Link href={`/${params.formatted_name}/${prevChapter}`}>
                                    <button className="md:pr-5 max-sm:py-4 max-sm:px-6 group" aria-label={"Previous chapter"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                        </svg>
                                        <span className="max-sm:hidden overflow-hidden opacity-0 max-w-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-1000 ease-in-out">
                                            <span className="pl-2 whitespace-nowrap">Previous chapter</span>
                                        </span>
                                    </button>
                                </Link>
                            )}

                            {currentChapter === 1 &&(
                                <div />
                            )}

                            {currentChapter < chapterCount &&(
                                <Link href={`/${params.formatted_name}/${nextChapter}`}>
                                    <button className="md:pl-5 max-sm:py-4 max-sm:px-6 group" aria-label={"Next chapter"}>
                                        <span className="max-sm:hidden overflow-hidden opacity-0 max-w-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-1000 ease-in-out">
                                            <span className="pl-2 whitespace-nowrap">Next chapter</span>
                                        </span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                    {novel && (
                        <SetUserProgress
                                userID={1}
                            novelID={novel.id}
                            currentChapter={currentChapter}
                        />
                    )}
                </>
            )}
        </main>
    );
}

export default Page;