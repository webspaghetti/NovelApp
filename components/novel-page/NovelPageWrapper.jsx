"use client"
import { createContext, useContext, useState } from "react";
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

    const value = {
        isLoading,
        setIsLoading,
        loadingChapter,
        setLoadingChapter,
    };

    return (
        <NovelLoadingContext.Provider value={value}>
            <NovelDetails novel={novel} userNovel={userNovel} />
            <ChapterButtonsList novel={novel} userNovel={userNovel} />
        </NovelLoadingContext.Provider>
    );
}


export default NovelPageWrapper;