"use client"
import { Inter } from "next/font/google";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import BackButton from "@/components/novel-page/BackButton";
import ChapterTitle from "@/components/chapter-page/ChapterTitle";
import ChapterDetails from "@/components/chapter-page/ChapterDetails";
import ChapterNavigation from "@/components/chapter-page/ChapterNavigation";
import ChapterStyleWrapper from "@/components/chapter-page/ChapterStyleWrapper";
import NavBar from "@/components/general/layout/NavBar";
import HorizontalReader from "@/components/chapter-page/HorizontalReader";
import sanitizeHtml from "sanitize-html";

const inter = Inter({ subsets: ["latin"] });

// Constants for infinite scroll
const CHAPTERS_TO_KEEP_BELOW = 2;
const CHAPTERS_TO_KEEP_ABOVE = 1;
const LOAD_THRESHOLD = 80;
const SCROLL_DEBOUNCE_MS = 150;

function ChapterPageWrapper({ novelData, chapter: initialChapter, currentChapter: initialChapterNum, userTemplateList, userNovel, isMobile }) {
    const router = useRouter();
    const pathname = usePathname();
    const hasPrefetchedRef = useRef(false);
    const scrollTimeoutRef = useRef(null);
    const lastProgressUpdateRef = useRef(initialChapterNum);

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

    // Infinite scroll state
    const [chapters, setChapters] = useState([{
        number: initialChapterNum,
        data: initialChapter
    }]);
    const [loadingChapters, setLoadingChapters] = useState([]);
    const [currentVisibleChapter, setCurrentVisibleChapter] = useState(initialChapterNum);
    const isLoadingRef = useRef(false);
    const chapterRefs = useRef({});
    const observerRef = useRef(null);

    const prevChapter = currentVisibleChapter - 1;
    const nextChapter = currentVisibleChapter + 1;

    // Fetch a chapter with proper error handling and caching
    const fetchChapter = useCallback(async (chapterNum) => {
        if (chapterNum < 1 || chapterNum > novelData.chapter_count) return null;

        // Check if already loading or already loaded
        if (loadingChapters.includes(chapterNum) || chapters.some(ch => ch.number === chapterNum)) {
            return null;
        }

        setLoadingChapters(prev => [...prev, chapterNum]);

        try {
            // Try to get from cache first
            const response = await fetch('/api/prefetch-chapter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    formatted_name: novelData.formatted_name,
                    chapter: chapterNum,
                    source: novelData.source
                }),
            });

            if (!response.ok) throw new Error('Failed to fetch chapter');

            // Now fetch the actual scraped content
            const scrapeResponse = await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: `https://${novelData.source}.com/novel/${novelData.formatted_name}/chapter-${chapterNum}`
                }),
            });

            if (!scrapeResponse.ok) throw new Error('Failed to scrape chapter');

            const data = await scrapeResponse.json();
            let chapterContent = data.content;

            // Sanitize chapter content
            if (chapterContent?.chapterContent) {
                chapterContent.chapterContent = sanitizeHtml(chapterContent.chapterContent, {
                    allowedTags: ["p", "img", "strong", "em", "b", "i", "u", "a", "table"],
                    allowedAttributes: {
                        img: ["src", "alt"],
                        a: ["href"],
                        p: ["style"],
                    },
                    transformTags: {
                        img: (tagName, attribs) => {
                            if (attribs.src?.includes("pubadx.one")) return { tagName: "span", text: "" };
                            return { tagName, attribs };
                        },
                    },
                }).replace(/<p>/g, '<p style="margin: 1rem 0;">');
            }

            return chapterContent;
        } catch (error) {
            console.error(`Error fetching chapter ${chapterNum}:`, error);
            return null;
        } finally {
            setLoadingChapters(prev => prev.filter(num => num !== chapterNum));
        }
    }, [novelData, loadingChapters, chapters]);

    // Load next chapter for infinite scroll
    const loadNextChapter = useCallback(async () => {
        if (isLoadingRef.current) return;
        if (!customizationTemplate.infinite_scrolling) return;

        const maxLoadedChapter = Math.max(...chapters.map(c => c.number));
        const nextChapterNum = maxLoadedChapter + 1;

        if (nextChapterNum > novelData.chapter_count) return;
        if (chapters.some(ch => ch.number === nextChapterNum)) return;
        if (loadingChapters.includes(nextChapterNum)) return;

        isLoadingRef.current = true;
        const chapterData = await fetchChapter(nextChapterNum);

        if (chapterData) {
            setChapters(prev => {
                // Ensure we don't add duplicates and maintain order
                if (prev.some(ch => ch.number === nextChapterNum)) return prev;
                return [...prev, { number: nextChapterNum, data: chapterData }];
            });
        }

        isLoadingRef.current = false;
    }, [chapters, customizationTemplate.infinite_scrolling, novelData.chapter_count, fetchChapter, loadingChapters]);

    // Load previous chapter for infinite scroll
    const loadPreviousChapter = useCallback(async () => {
        if (isLoadingRef.current) return;
        if (!customizationTemplate.infinite_scrolling) return;

        const minLoadedChapter = Math.min(...chapters.map(c => c.number));
        const prevChapterNum = minLoadedChapter - 1;

        if (prevChapterNum < 1) return;
        if (chapters.some(ch => ch.number === prevChapterNum)) return;
        if (loadingChapters.includes(prevChapterNum)) return;

        isLoadingRef.current = true;
        const chapterData = await fetchChapter(prevChapterNum);

        if (chapterData) {
            setChapters(prev => {
                // Ensure we don't add duplicates and maintain order
                if (prev.some(ch => ch.number === prevChapterNum)) return prev;
                return [{ number: prevChapterNum, data: chapterData }, ...prev];
            });
        }

        isLoadingRef.current = false;
    }, [chapters, customizationTemplate.infinite_scrolling, fetchChapter, loadingChapters]);

    // Debounced scroll handler
    const handleScroll = useCallback(() => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
            if (!customizationTemplate.infinite_scrolling || isLoadingRef.current) return;

            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;

            const scrollableHeight = documentHeight - windowHeight;
            const scrollPercentage = (scrollTop / scrollableHeight) * 100;

            // Load next chapter when near bottom
            if (scrollPercentage >= LOAD_THRESHOLD) {
                loadNextChapter();
            }

            // Load previous chapter when near top
            if (scrollPercentage <= 20 && scrollTop > 0) {
                loadPreviousChapter();
            }
        }, SCROLL_DEBOUNCE_MS);
    }, [customizationTemplate.infinite_scrolling, loadNextChapter, loadPreviousChapter]);

    // Update user progress (debounced)
    const updateUserProgress = useCallback(async (chapterNum) => {
        if (chapterNum === lastProgressUpdateRef.current) return;

        lastProgressUpdateRef.current = chapterNum;

        try {
            await fetch('/api/user_novel/update-progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    novelId: novelData.id,
                    chapter: chapterNum,
                    formattedName: novelData.formatted_name,
                    source: novelData.source
                })
            });
        } catch (error) {
            console.error('Failed to update progress:', error);
        }
    }, [novelData]);

    // Unload chapters that are too far away
    const unloadDistantChapters = useCallback(() => {
        if (!customizationTemplate.infinite_scrolling) return;

        setChapters(prev => {
            const filtered = prev.filter(chapter => {
                const distance = Math.abs(chapter.number - currentVisibleChapter);
                const keepBelow = chapter.number > currentVisibleChapter && distance <= CHAPTERS_TO_KEEP_BELOW;
                const keepAbove = chapter.number < currentVisibleChapter && distance <= CHAPTERS_TO_KEEP_ABOVE;
                const isCurrent = chapter.number === currentVisibleChapter;

                return isCurrent || keepBelow || keepAbove;
            });

            // Only update if chapters were actually removed
            return filtered.length < prev.length ? filtered : prev;
        });
    }, [currentVisibleChapter, customizationTemplate.infinite_scrolling]);

    // Intersection observer to track visible chapter
    useEffect(() => {
        if (!customizationTemplate.infinite_scrolling) return;

        // Cleanup previous observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    // Trigger when chapter enters the central zone (isIntersecting = true with rootMargin)
                    if (entry.isIntersecting) {
                        const chapterNum = parseInt(entry.target.dataset.chapter);
                        setCurrentVisibleChapter(chapterNum);

                        // Update URL without navigation
                        const newUrl = `/${novelData.formatted_name}/${chapterNum}?${novelData.source}`;
                        if (pathname !== newUrl) {
                            window.history.replaceState({}, '', newUrl);
                        }

                        // Update user progress
                        updateUserProgress(chapterNum);
                    }
                });
            },
            {
                threshold: 0.1, // Just needs 10% in the zone
                rootMargin: '-20% 0px -20% 0px' // Only trigger in middle 60% of viewport
            }
        );

        // Observe all chapter elements
        Object.values(chapterRefs.current).forEach(ref => {
            if (ref) {
                observerRef.current.observe(ref);
            }
        });

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [chapters, customizationTemplate.infinite_scrolling, novelData, pathname, updateUserProgress]);

    // Scroll tracking for loading next/previous chapters
    useEffect(() => {
        if (!customizationTemplate.infinite_scrolling) return;

        window.addEventListener('scroll', handleScroll);

        // Initial check
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [handleScroll, customizationTemplate.infinite_scrolling]);

    // Unload distant chapters when current chapter changes
    useEffect(() => {
        if (!customizationTemplate.infinite_scrolling) return;

        const timeoutId = setTimeout(unloadDistantChapters, 1000);
        return () => clearTimeout(timeoutId);
    }, [currentVisibleChapter, unloadDistantChapters, customizationTemplate.infinite_scrolling]);

    // Regular prefetch for non-infinite scroll (unchanged)
    const prefetchNextChapter = useCallback(async () => {
        if (customizationTemplate.infinite_scrolling) return;
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
            } else {
                console.warn(`Failed to prefetch chapter ${nextChapter}:`, response.status);
            }
        } catch (error) {
            console.error(`Error prefetching chapter ${nextChapter}:`, error);
            // Reset flag on error so it can retry
            hasPrefetchedRef.current = false;
        }
    }, [customizationTemplate.infinite_scrolling, nextChapter, novelData, router]);

    // Scroll position tracking (vertical or horizontal)
    useEffect(() => {
        if (customizationTemplate.infinite_scrolling) return;

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
    }, [prefetchNextChapter, customizationTemplate.horizontal_reading, customizationTemplate.infinite_scrolling]);

    // Reset prefetch flag when chapter changes
    useEffect(() => {
        hasPrefetchedRef.current = false;
    }, [initialChapterNum]);

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


    return (
        <>
            <NavBar customizationTemplate={customizationTemplate} chapterPage={true} />
            <ChapterStyleWrapper customizationTemplate={customizationTemplate}>
                <main className={`mt-0 mb-0 ${customizationTemplate.horizontal_reading ? "px-1 mx-1 max-w-full" : "px-5 overflow-x-hidden"}`}>

                    {customizationTemplate.horizontal_reading ? (
                        <HorizontalReader
                            chapter={initialChapter}
                            novelData={novelData}
                            customizationTemplate={customizationTemplate}
                            inter={inter}
                            prevChapter={prevChapter}
                            nextChapter={nextChapter}
                            currentChapter={initialChapterNum}
                        />
                    ) : customizationTemplate.infinite_scrolling ? (
                        <div>
                            {/* Render all loaded chapters */}
                            {chapters
                                .sort((a, b) => a.number - b.number)
                                .map((chapter, index, sortedChapters) => (
                                    <div
                                        key={chapter.number}
                                        ref={el => {
                                            if (el) {
                                                chapterRefs.current[chapter.number] = el;
                                                el.dataset.chapter = chapter.number;
                                            }
                                        }}
                                        className="chapter-container mb-16"
                                    >
                                        <div className="flex justify-start">
                                            <BackButton formattedName={novelData.formatted_name} source={novelData.source} customizationTemplate={customizationTemplate} />
                                        </div>
                                        <ChapterTitle chapter={chapter.data} customizationTemplate={customizationTemplate} inter={inter} />
                                        <ChapterDetails chapter={chapter.data} customizationTemplate={customizationTemplate} inter={inter} />
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-start mb-5">
                                <BackButton formattedName={novelData.formatted_name} source={novelData.source} customizationTemplate={customizationTemplate} />
                            </div>

                            <ChapterTitle chapter={initialChapter} customizationTemplate={customizationTemplate} inter={inter} />
                            <ChapterDetails chapter={initialChapter} customizationTemplate={customizationTemplate} inter={inter} />
                            <ChapterNavigation
                                prevChapter={prevChapter}
                                nextChapter={nextChapter}
                                currentChapter={initialChapterNum}
                                chapterCount={novelData.chapter_count}
                                formattedName={novelData.formatted_name}
                                source={novelData.source}
                                customizationTemplate={customizationTemplate}
                            />
                        </div>
                    )}
                </main>
            </ChapterStyleWrapper>
        </>
    );
}


export default ChapterPageWrapper;