"use client"
import { createContext, useContext, useEffect, useState } from "react";
import NovelDetails from "@/components/novel-page/NovelDetails";
import ChapterButtonsList from "@/components/novel-page/ChapterButtonsList";


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


function NovelPageWrapper({ novel, userNovel }) {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingChapter, setLoadingChapter] = useState(null);
    const [userNovelState, setUserNovelState] = useState(userNovel)
    const [collapsedStyle, setCollapsedStyle] = useState(false)


    const value = {
        isLoading,
        setIsLoading,
        loadingChapter,
        setLoadingChapter,
        collapsedStyle,
        setCollapsedStyle
    };


    useEffect(() => {
        async function fetchUserNovel() {
            try {
                const res = await fetch(`/api/user_novel?userId=1&novelId=${novel.id}`);
                if (!res.ok) throw new Error('Failed to fetch user novel');
                const data = await res.json();
                setUserNovelState(data[0])
            } catch (error) {
                console.error('Error fetching user novel:', error);
            }
        }
        fetchUserNovel();
    }, [userNovel]);


    return (
        <NovelLoadingContext.Provider value={value}>
            <NovelDetails novel={novel} userNovel={userNovelState} />
            <ChapterButtonsList novel={novel} userNovel={userNovelState} />
        </NovelLoadingContext.Provider>
    );
}


export default NovelPageWrapper;