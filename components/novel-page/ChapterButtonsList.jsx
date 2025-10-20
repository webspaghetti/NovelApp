"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useNovelLoading } from "@/components/novel-page/NovelPageWrapper";
import CircularProgress from "@mui/material/CircularProgress";


function ChapterButtonsList({ novel, userNovel }) {
    const { isLoading, loadingChapter, setLoadingChapter, collapsedStyle } = useNovelLoading();
    const router = useRouter();

    const loadingCheck = loadingChapter !== null || isLoading;
    const readChaptersJson = JSON.parse(userNovel.read_chapters);

    // Calculate which section should be open by default (only used in collapsed style)
    function getDefaultOpenSection() {
        if (userNovel?.current_chapter) {
            // Find the breakpoint section that contains the current chapter
            return Math.ceil(userNovel.current_chapter / 100) * 100;
        }
        // Default to the first section
        return 100;
    }

    const [openSections, setOpenSections] = useState(() => new Set([getDefaultOpenSection()]));

    function toggleSection(breakpoint) {
        setOpenSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(breakpoint)) {
                newSet.delete(breakpoint);
            } else {
                newSet.add(breakpoint);
            }
            return newSet;
        });
    }

    function handleChapterClick(chapterNumber) {
        setLoadingChapter(chapterNumber);
        router.push(`/${novel.formatted_name}/${chapterNumber}?${novel.source}`);
    }

    // Render collapsed style
    if (collapsedStyle) {
        // Group chapters by their breakpoint sections
        const groupedChapters = [];
        for (let i = 0; i < novel.chapter_count; i++) {
            const chapterNumber = novel.chapter_count - i;
            const breakpoint = Math.ceil(chapterNumber / 100) * 100;

            if (!groupedChapters.find(g => g.breakpoint === breakpoint)) {
                const startChapter = breakpoint;
                const endChapter = Math.max(1, breakpoint - 99);
                groupedChapters.push({
                    breakpoint,
                    startChapter,
                    endChapter,
                    chapters: []
                });
            }

            const group = groupedChapters.find(g => g.breakpoint === breakpoint);
            group.chapters.push(chapterNumber);
        }

        return (
            <div className="mt-4 pb-4">
                {groupedChapters.map((group) => {
                    const isOpen = openSections.has(group.breakpoint);
                    const hasCurrentChapter = userNovel?.current_chapter >= group.endChapter && userNovel?.current_chapter <= group.startChapter;

                    return (
                        <div key={`section-${group.breakpoint}`} className="mb-2">
                            <button
                                onClick={() => toggleSection(group.breakpoint)}
                                className={`link_outline hover:scale-100 !bg-main_background/80 sm:hover:!bg-main_background !border-2 !rounded-lg !p-4 w-full !normal-case !transform-gpu ${
                                    hasCurrentChapter ? '!border-green-600 !bg-green-600' : '!border-secondary/20 sm:hover:!border-secondary/30'
                                }`}
                            >
                                <span className="w-full flex items-center justify-center gap-3">
                                    <h2 className="max-sm:text-xl text-2xl font-bold text-center text-secondary/90">
                                        Chapters {group.startChapter} - {group.endChapter}
                                    </h2>
                                    {isOpen ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-5 text-secondary/70 transition-transform">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-5 text-secondary/70 transition-transform">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    )}
                                </span>
                            </button>

                            {isOpen && (
                                <div className="grid max-sm:grid-cols-3 grid-cols-5 gap-4 justify-center items-center mt-4">
                                    {group.chapters.map((chapterNumber) => {
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

                                        return (
                                            <button
                                                key={`chapter-${chapterNumber}`}
                                                onClick={(e) => handleChapterClick(chapterNumber)}
                                                disabled={loadingCheck}
                                                className={`normal-case px-4 py-2 rounded-md text-lg flex justify-center items-center bg-primary relative ${
                                                    readChaptersJson.includes(chapterNumber) && userNovel?.current_chapter !== chapterNumber ? 'border-[#3d2a84] !bg-[#3d2a84] hover:bg-[#3d2a84] text-gray-400 hover:text-gray-400' : ''
                                                } ${
                                                    userNovel?.current_chapter === chapterNumber ? 'border-green-600 !bg-green-600' : ''
                                                } ${
                                                    loadingCheck ? 'opacity-60' : ''
                                                }`}
                                            >
                                                {buttonContent}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    // Render expanded style
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
                                    readChaptersJson.includes(chapterNumber) && userNovel?.current_chapter !== chapterNumber ? 'border-[#3d2a84] !bg-[#3d2a84] hover:bg-[#3d2a84] text-gray-400 hover:text-gray-400' : ''
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
                                readChaptersJson.includes(chapterNumber) && userNovel?.current_chapter !== chapterNumber ? 'border-[#3d2a84] !bg-[#3d2a84] hover:bg-[#3d2a84] text-gray-400 hover:text-gray-400' : ''
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