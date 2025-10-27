"use client"
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import BackButton from "@/components/novel-page/BackButton";
import ChapterTitle from "@/components/chapter-page/ChapterTitle";
import ChapterDetails from "@/components/chapter-page/ChapterDetails";
import ChapterNavigation from "@/components/chapter-page/ChapterNavigation";
import ChapterStyleWrapper from "@/components/chapter-page/ChapterStyleWrapper";


const inter = Inter({ subsets: ["latin"] });


function ChapterPageWrapper({ novelData, chapter, currentChapter, userTemplateList, userNovel }) {
    const prevChapter = currentChapter - 1;
    const nextChapter = currentChapter + 1;

    const normalTemplate = userTemplateList.find(t => t.id === userNovel.normal_template_id);
    const smallTemplate = userTemplateList.find(t => t.id === userNovel.small_template_id);

    const [isSmallScreen, setIsSmallScreen] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia("(max-width: 640px)").matches;
        }
        return false; // Default value for SSR
    });
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 640px)");
        setIsSmallScreen(mediaQuery.matches);
    }, []);

    const customizationTemplate = isSmallScreen ? JSON.parse(smallTemplate.customization) : JSON.parse(normalTemplate.customization);

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