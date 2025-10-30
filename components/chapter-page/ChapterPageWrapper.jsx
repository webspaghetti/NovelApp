"use client"
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import BackButton from "@/components/novel-page/BackButton";
import ChapterTitle from "@/components/chapter-page/ChapterTitle";
import ChapterDetails from "@/components/chapter-page/ChapterDetails";
import ChapterNavigation from "@/components/chapter-page/ChapterNavigation";
import ChapterStyleWrapper from "@/components/chapter-page/ChapterStyleWrapper";
import NavBar from "@/components/general/layout/NavBar";
import HorizontalReader from "@/components/chapter-page/HorizontalReader";


const inter = Inter({ subsets: ["latin"] });


function ChapterPageWrapper({ novelData, chapter, currentChapter, userTemplateList, userNovel, isMobile }) {
    const router = useRouter();
    const prevChapter = currentChapter - 1;
    const nextChapter = currentChapter + 1;
    const hasPrefetchedRef = useRef(false);

    // Find templates first
    const normalTemplate = userTemplateList.find(t => t.id === userNovel.normal_template_id);
    const smallTemplate = userTemplateList.find(t => t.id === userNovel.small_template_id);

    const [isSmallScreen, setIsSmallScreen] = useState(isMobile);

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

    // Prefetch next chapter by actually calling the scrape API
    const prefetchNextChapter = useCallback(async () => {
        if (hasPrefetchedRef.current) return;
        if (nextChapter > novelData.chapter_count) return;

        hasPrefetchedRef.current = true;

        try {
            console.log(`Prefetching chapter ${nextChapter}`);

            // Make the actual API call to trigger prefetch on server
            // The server will use sourceConfig to build the correct URL
            const response = await fetch('/api/prefetch-chapter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formatted_name: novelData.formatted_name,
                    chapter: nextChapter,
                    source: novelData.source
                }),
            });

            if (response.ok) {
                console.log(`Successfully prefetched chapter ${nextChapter}`);

                // Also prefetch the Next.js route for instant navigation
                const nextChapterRoute = `/${novelData.formatted_name}/${nextChapter}?${novelData.source}`;
                router.prefetch(nextChapterRoute);
            } else {
                console.warn(`Failed to prefetch chapter ${nextChapter}:`, response.status);
            }
        } catch (error) {
            console.error(`Error prefetching chapter ${nextChapter}:`, error);
            // Reset flag on error so it can retry
            hasPrefetchedRef.current = false;
        }
    }, [nextChapter, novelData.chapter_count, novelData.formatted_name, novelData.source, router]);

    // Scroll position tracking (vertical or horizontal)
    useEffect(() => {
        const handleScroll = (e) => {
            let scrollPercentage;

            if (customizationTemplate.horizontal_reading) {
                // Horizontal scroll tracking - get the scrolling container
                const container = e?.target || document.querySelector('.horizontal-reader-container');
                if (!container) return;

                const scrollLeft = container.scrollLeft;
                const scrollableWidth = container.scrollWidth - container.clientWidth;
                scrollPercentage = scrollableWidth > 0 ? (scrollLeft / scrollableWidth) * 100 : 0;
            } else {
                // Vertical scroll tracking
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;
                const scrollTop = window.scrollY || document.documentElement.scrollTop;

                const scrollableHeight = documentHeight - windowHeight;
                scrollPercentage = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
            }

            // Prefetch when user reaches 50%
            if (scrollPercentage >= 50) {
                prefetchNextChapter();
            }
        };

        let scrollTarget;

        if (customizationTemplate.horizontal_reading) {
            // For horizontal mode, listen to the container div
            scrollTarget = document.querySelector('.horizontal-reader-container');
            if (scrollTarget) {
                scrollTarget.addEventListener('scroll', handleScroll);
            }
        } else {
            // For vertical mode, listen to window
            scrollTarget = window;
            window.addEventListener('scroll', handleScroll);
        }

        // Check immediately in case page is already scrolled
        handleScroll();

        return () => {
            if (customizationTemplate.horizontal_reading && scrollTarget) {
                scrollTarget.removeEventListener('scroll', handleScroll);
            } else if (scrollTarget === window) {
                window.removeEventListener('scroll', handleScroll);
            }
        };
    }, [prefetchNextChapter, customizationTemplate.horizontal_reading]);

    // Reset prefetch flag when chapter changes
    useEffect(() => {
        hasPrefetchedRef.current = false;
    }, [currentChapter]);

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
        <>
            <NavBar customizationTemplate={customizationTemplate} />
            <ChapterStyleWrapper customizationTemplate={customizationTemplate}>
                <main className={`mt-0 mb-0 ${customizationTemplate.horizontal_reading ? "px-1 mx-1 max-w-full" : "px-5 overflow-x-hidden"}`}>

                    {customizationTemplate.horizontal_reading ? (
                        <HorizontalReader
                            chapter={chapter}
                            novelData={novelData}
                            customizationTemplate={customizationTemplate}
                            inter={inter}
                            prevChapter={prevChapter} nextChapter={nextChapter}
                            currentChapter={currentChapter}
                        />
                    ) : (
                        <div>
                            <div className="flex justify-start mb-5">
                                <BackButton formattedName={novelData.formatted_name} source={novelData.source} customizationTemplate={customizationTemplate} />
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
                                customizationTemplate={customizationTemplate}
                            />
                        </div>
                    )
                    }
                </main>
            </ChapterStyleWrapper>
        </>
    );
}


export default ChapterPageWrapper;