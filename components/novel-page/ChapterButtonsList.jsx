"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useNovelLoading } from "@/components/novel-page/NovelPageWrapper";
import { offlineCapableFetch } from "@/lib/offlineSync";
import CircularProgress from "@mui/material/CircularProgress";


function ChapterButtonsList({ novel, userNovel, isOnline }) {
    const {
        isLoading,
        loadingChapter,
        setLoadingChapter,
        collapsedStyle,
        downloadMode,
        selectedChapters,
        setSelectedChapters,
        downloadedChapters
    } = useNovelLoading();
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

    async function handleChapterClick(chapterNumber) {
        if (downloadMode) {
            // In download mode: toggle chapter selection
            setSelectedChapters(prev => {
                const newSet = new Set(prev);
                if (newSet.has(chapterNumber)) {
                    newSet.delete(chapterNumber);
                } else {
                    newSet.add(chapterNumber);
                }
                return newSet;
            });
        } else {

            setLoadingChapter(chapterNumber);

            // Navigate to appropriate page
            if (!isOnline && downloadedChapters.has(chapterNumber)) {
                // Offline mode: Store ALL necessary data and go to offline reader
                sessionStorage.setItem("offlineChapter", JSON.stringify({
                    novelId: novel.id,
                    chapterNumber: chapterNumber,
                    formattedName: novel.formatted_name,
                    source: novel.source,
                    chapterCount: novel.chapter_count,
                }));

                await offlineCapableFetch("/api/user_novel/update-progress", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        novelId: novel.id,
                        chapter: chapterNumber,
                        formattedName: novel.formatted_name,
                        source: novel.source
                    })
                });
                router.push("/offline-reader");
            } else {
                // Online mode: normal navigation
                router.push(`/${novel.formatted_name}/${chapterNumber}?${novel.source}`);
            }
        }
    }

    function getButtonStyles(chapterNumber) {
        const isSelected = selectedChapters.has(chapterNumber);
        const isDownloaded = downloadedChapters.has(chapterNumber);
        const isRead = readChaptersJson.includes(chapterNumber) && userNovel?.current_chapter !== chapterNumber;
        const isCurrent = userNovel?.current_chapter === chapterNumber;
        const isUnavailableOffline = !isOnline && !isDownloaded;

        let classes = "normal-case px-4 py-2 rounded-md text-lg flex justify-center items-center bg-primary relative transition-all";

        if (downloadMode) {
            // Download mode styles
            if (isSelected) {
                classes += " !border-blue-500 !bg-blue-600";
            } else if (isDownloaded) {
                classes += " !border-2 !border-blue-500/50 !bg-blue-900/30";
            }
        } else {
            // Normal mode styles
            if (isUnavailableOffline) {
                classes += " !bg-gray-700/50 !text-gray-500 !border-gray-600/50";
            } else if (isRead) {
                classes += " border-[#3d2a84] !bg-[#3d2a84] hover:bg-[#3d2a84] text-gray-400 hover:text-gray-400";
                if (isDownloaded) {
                    classes += " !bg-blue-800 hover:bg-blue-800 !border-blue-800";
                }
            } else if (isCurrent) {
                classes += " border-green-600 !bg-green-600";
                if (isDownloaded) {
                    classes += " border-blue-600 ring-2 ring-blue-600";
                }
            } else if (isDownloaded) {
                classes += " !border-blue-600 !bg-blue-600 hover:bg-blue-600 ";
            }
        }

        if (loadingCheck && !downloadMode) {
            classes += " opacity-60";
        }

        return classes;
    }

    function renderButtonContent(chapterNumber) {
        return (
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
                {/* Offline indicator */}
                {!isOnline && (
                    <div className="mt-4 mb-4 p-4 bg-yellow-600/20 border border-yellow-500/30 rounded-lg text-center">
                        <p className="text-yellow-400 font-semibold">You are currently offline</p>
                        <p className="text-yellow-400/70 text-sm mt-1">Only downloaded chapters are available</p>
                    </div>
                )}

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
                                    {group.chapters.map((chapterNumber) => (
                                        <button
                                            key={`chapter-${chapterNumber}`}
                                            onClick={() => handleChapterClick(chapterNumber)}
                                            disabled={(loadingCheck && !downloadMode) || (!isOnline && !downloadedChapters.has(chapterNumber))}
                                            className={getButtonStyles(chapterNumber)}
                                        >
                                            {renderButtonContent(chapterNumber)}
                                        </button>
                                    ))}
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
        <div>
            {/* Offline indicator */}
            {!isOnline && (
                <div className="mt-4 mb-4 p-4 bg-yellow-600/20 border border-yellow-500/30 rounded-lg text-center">
                    <p className="text-yellow-400 font-semibold">You are currently offline</p>
                    <p className="text-yellow-400/70 text-sm mt-1">Only downloaded chapters are available</p>
                </div>
            )}

            <div className="grid max-sm:grid-cols-3 grid-cols-5 gap-4 justify-center items-center mt-4 pb-4">
                {Array.from({ length: novel.chapter_count }, (_, index) => {
                    const chapterNumber = novel.chapter_count - index;
                    const isBreakpoint = (chapterNumber % 100) === 0;

                    if (isBreakpoint) {
                        return (
                            <React.Fragment key={`fragment${chapterNumber/100}`}>
                                <h1 key={`breakPoint${chapterNumber/100}`} className="col-span-full max-sm:text-xl text-2xl font-bold text-center my-4 text-secondary link_outline select-none">
                                    Chapters {chapterNumber} - {chapterNumber - 99}
                                </h1>
                                <button
                                    onClick={() => handleChapterClick(chapterNumber)}
                                    disabled={(loadingCheck && !downloadMode) || (!isOnline && !downloadedChapters.has(chapterNumber))}
                                    className={getButtonStyles(chapterNumber)}
                                >
                                    {renderButtonContent(chapterNumber)}
                                </button>
                            </React.Fragment>
                        );
                    } else {
                        return (
                            <button
                                key={`chapter-${chapterNumber}`}
                                onClick={() => handleChapterClick(chapterNumber)}
                                disabled={(loadingCheck && !downloadMode) || (!isOnline && !downloadedChapters.has(chapterNumber))}
                                className={getButtonStyles(chapterNumber)}
                            >
                                {renderButtonContent(chapterNumber)}
                            </button>
                        );
                    }
                })}
            </div>
        </div>
    );
}


export default ChapterButtonsList;