"use client"
import { Inter } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import BackButton from "@/components/novel-page/BackButton";
import ChapterTitle from "@/components/chapter-page/ChapterTitle";
import ChapterDetails from "@/components/chapter-page/ChapterDetails";
import ChapterNavigation from "@/components/chapter-page/ChapterNavigation";
import ChapterStyleWrapper from "@/components/chapter-page/ChapterStyleWrapper";


const inter = Inter({ subsets: ["latin"] });


function ChapterPageWrapper({ novelData, chapter, currentChapter, userTemplateList, userNovel }) {
    const prevChapter = currentChapter - 1;
    const nextChapter = currentChapter + 1;

    // Find templates first
    const normalTemplate = userTemplateList.find(t => t.id === userNovel.normal_template_id);
    const smallTemplate = userTemplateList.find(t => t.id === userNovel.small_template_id);

    const [isSmallScreen, setIsSmallScreen] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia("(max-width: 640px)").matches;
        }
        return false;
    });

    // Memoize the parsed templates
    const normalTemplateData = useMemo(() =>
            JSON.parse(normalTemplate.customization),
        [normalTemplate]
    );

    const smallTemplateData = useMemo(() =>
            JSON.parse(smallTemplate.customization),
        [smallTemplate]
    );

    // This will update automatically when isSmallScreen changes
    const customizationTemplate = isSmallScreen ? smallTemplateData : normalTemplateData;

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 640px)");
        setIsSmallScreen(mediaQuery.matches);

        function handleChange(e) {
            setIsSmallScreen(e.matches);
        }

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);


    return (
        <ChapterStyleWrapper customizationTemplate={customizationTemplate}>
            <main className={"px-5 mt-0 mb-0"}>
                <div>
                    <div className="flex justify-start mb-5">
                        <BackButton formattedName={novelData.formatted_name} source={novelData.source} />
                    </div>

                    <ChapterTitle chapter={chapter} customizationTemplate={customizationTemplate} inter={inter} />

                    <ChapterDetails chapter={chapter} customizationTemplate={customizationTemplate} inter={inter} />
                    <ChapterNavigation
                        prevChapter={prevChapter}
                        nextChapter={nextChapter}
                        currentChapter={currentChapter}
                        chapterCount={novelData.chapter_count}
                        formattedName={novelData.formatted_name}
                        source={novelData.source}
                    />
                </div>
            </main>
        </ChapterStyleWrapper>
    )
}


export default ChapterPageWrapper;