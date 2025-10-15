"use client"
import { useEffect, useState } from "react";
import NovelDetails from "@/components/novel-page/NovelDetails";
import ChapterButtonsList from "@/components/novel-page/ChapterButtonsList";
import { notFound } from "next/navigation";
import { fetchNovelByFormattedName } from "@/app/helper-functions/fetchNovelByFormattedName";
import { ChapterButtonsSkeleton, NovelPageSkeleton } from "@/components/general/SkeletonLoaders";


async function getUsersNovel(userId, novelId) {
    try {
        const response = await fetch(`/api/user_novel?userId=${encodeURIComponent(userId)}&novelId=${encodeURIComponent(novelId)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user progress');
        }
        const data = await response.json();
        return data[0];

    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
}

function Page({ params }) {
    const [novel, setNovel] = useState(null);
    const [userNovel, setUserNovel] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedNovels = await fetchNovelByFormattedName(params.formatted_name);

                if (fetchedNovels) {
                    const fetchedUser = await getUsersNovel(1, fetchedNovels.id); // Just me :)
                    setUserNovel(fetchedUser);
                    setNovel(fetchedNovels);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false); // Always set loading state to false
            }
        };

        fetchData();
    }, [params.formatted_name]);


    return (
        <main className="relative pt-20">
            {isLoading && (
                <>
                    <NovelPageSkeleton />
                    <ChapterButtonsSkeleton />
                </>
            )}

            {novel && !isLoading && (
                <>
                    <NovelDetails novel={novel} userNovel={userNovel} />
                    <ChapterButtonsList novel={novel} userNovel={userNovel} />
                </>
            )}

            {!novel && !isLoading && notFound()}
        </main>
    );
}


export default Page;