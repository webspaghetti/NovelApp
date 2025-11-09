"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { getChaptersByNovel } from "@/lib/indexed-db";
import { getCollapsedStyleCookie, setCollapsedStyleCookie } from "@/lib/cookies";
import NovelDetails from "@/components/novel-page/NovelDetails";
import ChapterButtonsList from "@/components/novel-page/ChapterButtonsList";
import DownloadControls from "@/components/novel-page/DownloadControls";


// Create context
const NovelLoadingContext = createContext();

// Custom hook for easy access
export function useNovelLoading() {
    const context = useContext(NovelLoadingContext);
    if (!context) {
        throw new Error('useNovelLoading must be used within NovelPageWrapper');
    }
    return context;
}


function NovelPageWrapper({ novel, userNovel, session, userTemplateList }) {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingChapter, setLoadingChapter] = useState(null);
    const [userNovelState, setUserNovelState] = useState(userNovel);

    // Initialize collapsedStyle from cookie
    const [collapsedStyle, setCollapsedStyleState] = useState(() => {
        return getCollapsedStyleCookie(novel.id);
    });

    // Download mode states
    const [downloadMode, setDownloadMode] = useState(false);
    const [selectedChapters, setSelectedChapters] = useState(new Set());
    const [downloadedChapters, setDownloadedChapters] = useState(new Set());
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });

    const [downloadControls, setDownloadControls] = useState(false)

    const [isOnline, setIsOnline] = useState(
        typeof window !== 'undefined' ? navigator.onLine : true
    );

    // Track online/offline status
    useEffect(() => {
        setIsOnline(navigator.onLine);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Wrapper function to update both state and cookie
    function setCollapsedStyle(value) {
        const newValue = typeof value === 'function' ? value(collapsedStyle) : value;
        setCollapsedStyleState(newValue);
        setCollapsedStyleCookie(novel.id, newValue);
    }

    const value = {
        isLoading,
        setIsLoading,
        loadingChapter,
        setLoadingChapter,
        collapsedStyle,
        setCollapsedStyle,
        // Download mode values
        downloadMode,
        setDownloadMode,
        selectedChapters,
        setSelectedChapters,
        downloadedChapters,
        setDownloadedChapters,
        isDownloading,
        setIsDownloading,
        downloadProgress,
        setDownloadProgress,
    };


    useEffect(() => {
        async function fetchUserNovel() {
            try {
                const res = await fetch(`/api/user_novel?userId=${encodeURIComponent(session.user.id)}&novelId=${encodeURIComponent(novel.id)}`);
                if (!res.ok) throw new Error('Failed to fetch user novel');
                const data = await res.json();
                setUserNovelState(data[0]);
            } catch (error) {
                console.error('Error fetching user novel:', error);
            }
        }
        fetchUserNovel();
    }, [userNovel, session.user.id, novel.id]);


    // Load downloaded chapters from IndexedDB on mount
    useEffect(() => {
        async function loadDownloadedChapters() {
            try {
                const chapters = await getChaptersByNovel(novel.id);
                const chapterNumbers = new Set(chapters.map(ch => ch.chapterNumber));
                setDownloadedChapters(chapterNumbers);
            } catch (error) {
                console.error('Error loading downloaded chapters:', error);
            }
        }
        loadDownloadedChapters();
    }, [novel.id]);


    return (
        <NovelLoadingContext.Provider value={value}>
            <NovelDetails novel={novel} userNovel={userNovelState} userTemplateList={userTemplateList} downloadControls={downloadControls} setDownloadControls={setDownloadControls} isOnline={isOnline} />
            <DownloadControls novel={novel} downloadControls={downloadControls} isOnline={isOnline} />
            <ChapterButtonsList novel={novel} userNovel={userNovelState} isOnline={isOnline} />
        </NovelLoadingContext.Provider>
    );
}


export default NovelPageWrapper;