"use client"
import { useState } from "react";
import { useNovelLoading } from "@/components/novel-page/NovelPageWrapper";
import { saveChapter, deleteChapter, deleteChaptersByNovel } from "@/lib/indexed-db";
import CircularProgress from "@mui/material/CircularProgress";
import sourceConfig from "@/config/sourceConfig";


function DownloadControls({ novel, downloadControls }) {
    const {
        downloadMode,
        setDownloadMode,
        selectedChapters,
        setSelectedChapters,
        downloadedChapters,
        setDownloadedChapters,
        isDownloading,
        setIsDownloading,
        downloadProgress,
        setDownloadProgress
    } = useNovelLoading();


    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


    async function downloadChapters() {
        if (selectedChapters.size === 0) return;

        setIsDownloading(true);
        const chaptersToDownload = Array.from(selectedChapters).sort((a, b) => a - b);
        const total = chaptersToDownload.length;
        let current = 0;
        let successCount = 0;
        let failCount = 0;

        for (const chapterNumber of chaptersToDownload) {
            try {
                setDownloadProgress({ current, total, status: `Downloading chapter ${chapterNumber}...` });

                // Build the chapter link using sourceConfig
                const chapterLink = sourceConfig[novel.source].getChapterLink({
                    formatted_name: novel.formatted_name,
                    chapter: chapterNumber
                });

                // Scrape the chapter content
                const response = await fetch("/api/scrape", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ url: chapterLink }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch chapter ${chapterNumber}`);
                }

                const data = await response.json();

                if (!data.content) {
                    throw new Error(`No content returned for chapter ${chapterNumber}`);
                }

                // Save the entire chapter data to IndexedDB
                await saveChapter(novel.id, chapterNumber, {
                    chapterNumber,
                    chapterTitle: data.content.chapterTitle || `Chapter ${chapterNumber}`,
                    chapterContent: data.content.chapterContent,
                    nextChapter: data.content.nextChapter,
                    previousChapter: data.content.previousChapter,
                    downloadedAt: new Date().toISOString(),
                    novelId: novel.id,
                    novelName: novel.formatted_name,
                    source: novel.source
                });

                // IMPORTANT: Store novel metadata for offline access
                localStorage.setItem(
                    `novel_${novel.formatted_name}_${novel.source}`,
                    JSON.stringify({
                        id: novel.id,
                        formatted_name: novel.formatted_name,
                        source: novel.source,
                        title: novel.title,
                        chapter_count: novel.chapter_count
                    })
                );

                // Update downloaded chapters set
                setDownloadedChapters(prev => new Set([...prev, chapterNumber]));
                successCount++;

                current++;
                setDownloadProgress({ current, total, status: `Downloaded chapter ${chapterNumber}` });

                // Dispatch event to trigger pre-caching
                window.dispatchEvent(new CustomEvent("chapterDownloaded", {
                    detail: {
                        novelId: novel.id,
                        chapterNumber
                    }
                }));

                // Small delay to avoid overwhelming the server
                await new Promise(resolve => setTimeout(resolve, 200));
            } catch (error) {
                console.error(`Error downloading chapter ${chapterNumber}:`, error);
                failCount++;
                current++;
                setDownloadProgress({ current, total, status: `Failed: chapter ${chapterNumber}` });
            }
        }

        // Show completion message
        setDownloadProgress({
            current: total,
            total,
            status: `Complete! ${successCount} downloaded, ${failCount} failed`
        });

        // Clear selection and exit download mode after a short delay
        setTimeout(() => {
            setSelectedChapters(new Set());
            setDownloadMode(false);
            setIsDownloading(false);
            setDownloadProgress({ current: 0, total: 0, status: '' });
        }, 2000);
    }


    async function deleteSelectedChapters() {
        if (selectedChapters.size === 0) return;

        for (const chapterNumber of selectedChapters) {
            try {
                await deleteChapter(novel.id, chapterNumber);
                setDownloadedChapters(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(chapterNumber);
                    return newSet;
                });
            } catch (error) {
                console.error(`Error deleting chapter ${chapterNumber}:`, error);
            }
        }

        setSelectedChapters(new Set());
    }


    async function deleteAllChapters() {
        try {
            await deleteChaptersByNovel(novel.id);
            setDownloadedChapters(new Set());
            setShowDeleteConfirm(false);
        } catch (error) {
            console.error('Error deleting all chapters:', error);
        }
    }


    function toggleDownloadMode() {
        if (downloadMode) {
            // Exiting download mode - clear selection
            setSelectedChapters(new Set());
        }
        setDownloadMode(!downloadMode);
    }


    function selectAllChapters() {
        const allChapters = new Set();
        for (let i = 1; i <= novel.chapter_count; i++) {
            allChapters.add(i);
        }
        setSelectedChapters(allChapters);
    }


    function selectUndownloadedChapters() {
        const undownloaded = new Set();
        for (let i = 1; i <= novel.chapter_count; i++) {
            if (!downloadedChapters.has(i)) {
                undownloaded.add(i);
            }
        }
        setSelectedChapters(undownloaded);
    }


    function selectRange() {
        const start = parseInt(prompt("Start chapter:"));
        const end = parseInt(prompt("End chapter:"));

        if (isNaN(start) || isNaN(end) || start < 1 || end > novel.chapter_count || start > end) {
            alert("Invalid range");
            return;
        }

        const range = new Set();
        for (let i = start; i <= end; i++) {
            range.add(i);
        }
        setSelectedChapters(range);
    }


    return (downloadControls) ? (
        <div className={"w-full mt-4 mx-auto bg-gradient-to-b from-main_background to-[#070707] border border-gray-700 rounded-2xl overflow-hidden"}>
            {/* Header */}
            <div className={"p-4 sm:p-6 pb-3 sm:pb-4 border-b border-gray-700/50"}>
                <div className={"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"}>
                    <h3 className={"text-lg sm:text-xl font-semibold text-secondary select-none"}>
                        Download Manager
                    </h3>
                    <div className={"flex items-center gap-3"}>
                        <span className={"text-sm text-gray-400 select-none"}>
                            {downloadedChapters.size}/{novel.chapter_count} downloaded
                        </span>
                        {downloadedChapters.size > 0 && !downloadMode && (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={isDownloading}
                                className={"px-3 py-1.5 rounded-lg text-sm bg-red-700/20 hover:bg-red-700/30 border border-red-700/50 text-red-400 transition-all disabled:opacity-50"}
                            >
                                Delete All
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className={`p-4 sm:p-6 ${isDownloading ? 'pointer-events-none opacity-60' : ''}`}>
                {/* Mode Toggle and Selection Controls */}
                <div className={"space-y-4"}>
                    <div className={"flex flex-wrap items-center gap-2 sm:gap-3"}>
                        <button
                            onClick={toggleDownloadMode}
                            disabled={isDownloading}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                downloadMode
                                    ? "bg-blue-600 hover:bg-blue-700 border-blue-700 text-white"
                                    : "bg-navbar hover:bg-gray-800 border-gray-800 text-secondary"
                            } ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {downloadMode ? (selectedChapters.size > 0 ? `Selected: ${selectedChapters.size}` : "Exit Download Mode") : "Select Chapters"}
                        </button>

                        {downloadMode && (
                            <>
                                <div className={"h-6 w-px bg-gray-700"} />
                                <button
                                    onClick={selectAllChapters}
                                    disabled={isDownloading}
                                    className={"px-3 py-2 rounded-lg text-sm bg-navbar hover:bg-gray-800 border border-gray-700 text-secondary disabled:opacity-50 transition-all"}
                                >
                                    All
                                </button>
                                <button
                                    onClick={selectUndownloadedChapters}
                                    disabled={isDownloading}
                                    className={"px-3 py-2 rounded-lg text-sm bg-navbar hover:bg-gray-800 border border-gray-700 text-secondary disabled:opacity-50 transition-all"}
                                >
                                    Undownloaded
                                </button>
                                <button
                                    onClick={selectRange}
                                    disabled={isDownloading}
                                    className={"px-3 py-2 rounded-lg text-sm bg-navbar hover:bg-gray-800 border border-gray-700 text-secondary disabled:opacity-50 transition-all"}
                                >
                                    Range
                                </button>
                                <button
                                    onClick={() => setSelectedChapters(new Set())}
                                    disabled={isDownloading || selectedChapters.size === 0}
                                    className={"px-3 py-2 rounded-lg text-sm bg-navbar hover:bg-gray-800 border border-gray-700 text-secondary disabled:opacity-50 transition-all"}
                                >
                                    Clear
                                </button>
                            </>
                        )}
                    </div>

                    {/* Info/Warning Message */}
                    {downloadMode && selectedChapters.size === 0 && !isDownloading && (
                        <div className={"p-3 sm:p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg"}>
                            <p className={"text-sm text-gray-300"}>
                                💡 <strong>Click chapter buttons below</strong> to select chapters for download.
                                <span className={"text-yellow-400 font-semibold"}> Warning:</span> customization functions will not be available in offline mode.
                            </p>
                        </div>
                    )}

                    {/* Download Progress */}
                    {isDownloading && downloadProgress.status && (
                        <div className={"p-3 sm:p-4 bg-navbar border border-gray-700 rounded-lg"}>
                            <div className={"flex items-center justify-between mb-2"}>
                                <span className={"text-sm text-gray-300"}>{downloadProgress.status}</span>
                                <span className={"text-sm font-semibold text-secondary"}>
                                    {downloadProgress.current}/{downloadProgress.total}
                                </span>
                            </div>
                            <div className={"w-full bg-gray-800 rounded-full h-2 overflow-hidden"}>
                                <div
                                    className={"bg-green-600 h-2 transition-all duration-300"}
                                    style={{ width: `${(downloadProgress.current / downloadProgress.total) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer - Action Buttons */}
            {downloadMode && selectedChapters.size > 0 && (
                <div className={"p-4 sm:p-6 pt-3 sm:pt-4 border-t border-gray-700/50"}>
                    <div className={"flex gap-2 sm:gap-3 justify-between"}>
                        <button
                            onClick={deleteSelectedChapters}
                            disabled={isDownloading}
                            className={"flex justify-center items-center bg-red-700 hover:bg-red-800 border-red-800 text-white font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"}
                        >
                            <span className={"flex items-center gap-1.5 sm:gap-2"}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                                    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                </svg>
                                <span className={"max-sm:hidden"}>Delete Selected</span>
                                <span className={"sm:hidden"}>Delete</span>
                            </span>
                        </button>

                        <button
                            onClick={downloadChapters}
                            disabled={isDownloading}
                            className={"flex justify-center items-center bg-green-700 hover:bg-green-800 border-green-800 text-white font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"}
                        >
                            {isDownloading ? (
                                <CircularProgress sx={{color: "#FAFAFA"}} size={20} thickness={6} />
                            ) : (
                                <span className={"flex items-center gap-1.5 sm:gap-2"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                    <span className={"max-sm:hidden"}>Download {selectedChapters.size} Chapter{selectedChapters.size !== 1 ? 's' : ''}</span>
                                    <span className={"sm:hidden"}>Download</span>
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Delete confirmation modal */}
            {showDeleteConfirm && (
                <div className={"fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"} onClick={() => setShowDeleteConfirm(false)}>
                    <div className={"bg-gradient-to-b from-main_background to-[#070707] border border-gray-700 p-6 rounded-2xl shadow-cardB max-w-md mx-4"} onClick={(e) => e.stopPropagation()}>
                        <h3 className={"text-xl font-semibold text-secondary mb-4"}>Delete All Downloaded Chapters?</h3>
                        <p className={"text-gray-400 mb-6"}>
                            This will delete all {downloadedChapters.size} downloaded chapters for this novel. This action cannot be undone.
                        </p>
                        <div className={"flex gap-3 justify-end"}>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className={"px-4 py-2 rounded-lg bg-navbar hover:bg-gray-800 border border-gray-700 text-secondary transition-all"}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={deleteAllChapters}
                                className={"px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 border border-red-800 text-white transition-all"}
                            >
                                Delete All
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    ) : null;
}


export default DownloadControls;