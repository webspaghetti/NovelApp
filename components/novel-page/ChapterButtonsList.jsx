"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { useNovelLoading } from "@/components/novel-page/NovelPageWrapper";
import CircularProgress from "@mui/material/CircularProgress";


function ChapterButtonsList({ novel, userNovel }) {
    const { isLoading, loadingChapter, setLoadingChapter } = useNovelLoading();
    const router = useRouter();

    const loadingCheck = loadingChapter !== null || isLoading;


    function handleChapterClick(chapterNumber) {
        setLoadingChapter(chapterNumber);
        router.push(`/${novel.formatted_name}/${chapterNumber}`);
    }


    return (
        <div className="grid max-sm:grid-cols-3 grid-cols-5 gap-4 justify-center items-center mt-4 pb-4">
            {Array.from({ length: novel.chapter_count }, (_, index) => {
                const chapterNumber = novel.chapter_count - index;
                const isBreakpoint = (chapterNumber % 100) === 0;

                const buttonContent = (
                    <>
                        <p className={`max-sm:text-base ${loadingChapter === chapterNumber ? 'invisible' : ''}`}>
                            Chapter {chapterNumber}
                        </p>
                        {loadingChapter === chapterNumber && (
                            <span className="absolute inset-0 flex items-center justify-center">
                                <CircularProgress sx={{color: "#FAFAFA"}} size={20} thickness={8} />
                            </span>
                        )}
                    </>
                );

                if (isBreakpoint) {
                    return (
                        <React.Fragment key={`fragment${chapterNumber/100}`}>
                            <h1 key={`breakPoint${chapterNumber/100}`} className="col-span-full max-sm:text-xl text-2xl font-bold text-center my-4 text-secondary link_outline select-none">
                                Chapters {chapterNumber} - {chapterNumber - 99}
                            </h1>
                            <button
                                onClick={(e) => handleChapterClick(chapterNumber)}
                                disabled={loadingCheck}
                                className={`normal-case px-4 py-2 rounded-md text-lg flex justify-center items-center bg-primary relative ${
                                    userNovel?.read_chapters.includes(chapterNumber) && userNovel?.current_chapter !== chapterNumber ? 'border-[#3d2a84] !bg-[#3d2a84] hover:bg-[#3d2a84] text-gray-400 hover:text-gray-400' : ''
                                } ${
                                    userNovel?.current_chapter === chapterNumber ? 'border-green-600 !bg-green-600' : ''
                                } ${
                                    loadingCheck ? 'opacity-60' : ''
                                }`}
                            >
                                {buttonContent}
                            </button>
                        </React.Fragment>
                    );
                } else {
                    return (
                        <button
                            key={`chapter-${chapterNumber}`}
                            onClick={(e) => handleChapterClick(chapterNumber)}
                            disabled={loadingCheck}
                            className={`normal-case px-4 py-2 rounded-md text-lg flex justify-center items-center bg-primary relative ${
                                userNovel?.read_chapters.includes(chapterNumber) && userNovel?.current_chapter !== chapterNumber ? 'border-[#3d2a84] !bg-[#3d2a84] hover:bg-[#3d2a84] text-gray-400 hover:text-gray-400' : ''
                            } ${
                                userNovel?.current_chapter === chapterNumber ? 'border-green-600 !bg-green-600' : ''
                            } ${
                                loadingCheck ? 'opacity-60' : ''
                            }`}
                        >
                            {buttonContent}
                        </button>
                    );
                }
            })}
        </div>
    );
}


export default ChapterButtonsList;