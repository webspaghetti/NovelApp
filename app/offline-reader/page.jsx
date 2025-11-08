"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { getChapter } from "@/lib/indexed-db";
import NavBar from "@/components/general/layout/NavBar";
import BackButton from "@/components/novel-page/BackButton";
import ChapterTitle from "@/components/chapter-page/ChapterTitle";
import ChapterDetails from "@/components/chapter-page/ChapterDetails";
import ChapterStyleWrapper from "@/components/chapter-page/ChapterStyleWrapper";
import CircularProgress from "@mui/material/CircularProgress";


const inter = Inter({ subsets: ["latin"] });


export default function OfflineReaderPage() {
    const router = useRouter();
    const [chapter, setChapter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chapterInfo, setChapterInfo] = useState(null);
    const [isSmallScreen, setIsSmallScreen] = useState(false);


    const normalTemplateData = {
        "text": {
            "family": "Inter",
            "size": "18px",
            "weight": "normal",
            "outline": "none",
            "outline_color": "#000000",
            "separator_width": "2px",
            "separator_color": "#99a1af"
        },
        "title": {
            "family": "Inter",
            "size": "30px",
            "weight": "bold",
            "outline": "none",
            "outline_color": "#000000"
        },
        "chapter_title_color": "#5e42fc",
        "chapter_content_color": "#fafafa",
        "text_spacing": {
            "block_spacing": "16px",
            "word_spacing": "normal",
            "letter_spacing": "normal",
            "line_height": "28px"
        },
        "title_spacing": {
            "word_spacing": "normal",
            "letter_spacing": "normal",
            "line_height": "36px"
        },
        "background": {
            "image": "none",
            "color": "#171717",
            "size": "cover",
            "position": "center",
            "attachment": "fixed",
            "repeat": "no-repeat"
        },
        "menu": {
            "navbar_hidden": false,
            "nav_color": "#121212",
            "text_color": "#fafafa",
            "outline_color": "#5e42cf",
            "navigation_buttons": {
                "icon_size": "1.5rem",
                "icon_color": "#fafafa",
                "icon_stroke_size": 4,
                "background_color": "#0c0c0c",
                "background_color_hover": "#5e42cf",
                "border_width": "4px",
                "border_color": "#5e42cf",
                "border_radius": "99px",
                "padding": "12px",
                "progress_bar_thickness": 8
            }
        },
        "infinite_scrolling": false,
        "horizontal_reading": false
    }

    const smallTemplateData = {
        "text": {
        "family": "Inter",
            "size": "16px",
            "weight": "normal",
            "outline": "none",
            "outline_color": "#000000",
            "separator_width": "2px",
            "separator_color": "#99a1af"
    },
        "title": {
        "family": "Inter",
            "size": "24px",
            "weight": "bold",
            "outline": "none",
            "outline_color": "#000000"
    },
        "chapter_title_color": "#5e42fc",
        "chapter_content_color": "#fafafa",
        "text_spacing": {
        "block_spacing": "16px",
            "word_spacing": "normal",
            "letter_spacing": "normal",
            "line_height": "24px"
    },
        "title_spacing": {
        "word_spacing": "normal",
            "letter_spacing": "normal",
            "line_height": "32px"
    },
        "background": {
        "image": "none",
            "color": "#171717",
            "size": "cover",
            "position": "center",
            "attachment": "fixed",
            "repeat": "no-repeat"
    },
        "menu": {
        "navbar_hidden": true,
            "nav_color": "#121212",
            "text_color": "#fafafa",
            "outline_color": "#5e42cf",
            "navigation_buttons": {
            "icon_size": "1rem",
                "icon_color": "#fafafa",
                "icon_stroke_size": 4,
                "background_color": "#0c0c0c",
                "background_color_hover": "#5e42cf",
                "border_width": "2px",
                "border_color": "#5e42cf",
                "border_radius": "99px",
                "padding": "10px",
                "progress_bar_thickness": 8
        }
    },
        "infinite_scrolling": false,
        "horizontal_reading": false
    }

    const customizationTemplate = isSmallScreen ? smallTemplateData : normalTemplateData;


    // Screen size detection
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 640px)");
        setIsSmallScreen(mediaQuery.matches);

        function handleChange(e) {
            setIsSmallScreen(e.matches);
        }

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);


    useEffect(() => {
        async function loadChapter() {
            try {
                setLoading(true);
                setError(null);

                // Get chapter info from sessionStorage
                const storedInfo = sessionStorage.getItem('offlineChapter');
                if (!storedInfo) {
                    setError("No chapter selected");
                    setLoading(false);
                    return;
                }

                const info = JSON.parse(storedInfo);
                setChapterInfo(info);

                const chapterData = await getChapter(info.novelId, info.chapterNumber);

                if (!chapterData) {
                    setError("This chapter hasn't been downloaded yet");
                    setLoading(false);
                    return;
                }

                setChapter(chapterData.data);
                setLoading(false);
            } catch (err) {
                console.error('Error loading offline chapter:', err);
                setError("Failed to load chapter");
                setLoading(false);
            }
        }

        loadChapter();
    }, []);


    function goToChapter(targetChapter) {
        if (!chapterInfo) return;

        // Store new chapter info
        sessionStorage.setItem('offlineChapter', JSON.stringify({
            ...chapterInfo,
            chapterNumber: targetChapter
        }));

        // Reload page to load new chapter
        window.location.reload();
    }

    if (loading) {
        return (
            <>
                <NavBar customizationTemplate={customizationTemplate} />
                <main className="w-full min-h-[90vh] mt-0 mb-0 flex items-center justify-center">
                    <div className="flex justify-center items-center min-h-[50vh]">
                        <CircularProgress sx={{color: "#5e42cf"}} size={80} thickness={8} />
                    </div>
                </main>
            </>
        );
    }

    if (error || !chapter) {
        return (
            <>
                <NavBar customizationTemplate={customizationTemplate} />
                <main className={"w-full min-h-[90vh] mt-0 mb-0 flex items-center justify-center"}>
                    <div className={"flex flex-col items-center justify-center min-h-[50vh] gap-4"}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-red-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                        <h1 className={"text-2xl font-bold text-secondary"}>Chapter Not Available Offline</h1>
                        <p className={"text-secondary/70"}>{error || "Error loading chapter"}</p>
                        <button
                            onClick={() => {
                                if (chapterInfo) {
                                    router.push(`/${chapterInfo.formattedName}?${chapterInfo.source}`);
                                } else {
                                    router.back();
                                }
                            }}
                        >
                            Go Back
                        </button>
                    </div>
                </main>
            </>
        );
    }

    const prevChapter = chapterInfo.chapterNumber - 1;
    const nextChapter = chapterInfo.chapterNumber + 1;

    return (
        <>
            <NavBar customizationTemplate={customizationTemplate} />
            <ChapterStyleWrapper customizationTemplate={customizationTemplate}>
                <main className={"px-5 overflow-x-hidden mt-0 mb-0"}>
                    {/* Offline indicator badge */}
                    <div className="mb-4 flex justify-center select-none">
                        <div className={"inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-sm"}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={"w-4 h-4"}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            Reading Offline
                        </div>
                    </div>

                    {/* Back button */}
                    <div className={"flex justify-start mb-5"}>
                        <BackButton
                            formattedName={chapterInfo.formattedName}
                            source={chapterInfo.source}
                            customizationTemplate={customizationTemplate}
                        />
                    </div>

                    {/* Chapter title */}
                    <ChapterTitle
                        chapter={chapter}
                        customizationTemplate={customizationTemplate}
                        inter={inter}
                    />

                    {/* Chapter details (content) */}
                    <ChapterDetails
                        chapter={chapter}
                        customizationTemplate={customizationTemplate}
                        inter={inter}
                    />

                    {/* Chapter navigation with offline navigation handler */}
                    <div className={"flex justify-between items-center gap-4 mt-8"}>
                        <button
                            onClick={() => goToChapter(prevChapter)}
                            disabled={prevChapter < 1}
                            className={"flex items-center gap-2 px-6 py-3 bg-primary text-secondary rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={"w-5 h-5"}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                            Previous
                        </button>

                        <button
                            onClick={() => goToChapter(nextChapter)}
                            disabled={chapterInfo.chapterCount && nextChapter > chapterInfo.chapterCount}
                            className={"flex items-center gap-2 px-6 py-3 bg-primary text-secondary rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"}
                        >
                            Next
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={"w-5 h-5"}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>
                </main>
            </ChapterStyleWrapper>
        </>
    );
}