"use client"
import React, {useEffect, useState} from "react";
import NovelPage from "@/app/[formatted_name]/NovelPage";
import ChapterButtons from "@/app/[formatted_name]/ChapterButtons";
import {notFound} from "next/navigation";
import GetNovel from "@/components/functions/GetNovel";
import {ChapterButtonsSkeleton, NovelPageSkeleton} from "@/components/Skeletons";

export const dynamicParams = { dynamicParams: true }

async function getUserInfo(userId, novelId) {
    try {
        const response = await fetch(`/api/user_progress?userId=${encodeURIComponent(userId)}&novelId=${encodeURIComponent(novelId)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user progress');
        }
        const data = await response.json();
        return data[0]; // Assuming the API returns an array with one item
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
}

function Page({ params }) {
    const [novel, setNovel] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedNovels = await GetNovel(params.formatted_name);

                if (fetchedNovels) {
                    const fetchedUser = await getUserInfo(1, fetchedNovels.id); // Just me :)
                    setUser(fetchedUser);
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
            {isLoading ? (
                <>
                    <NovelPageSkeleton />
                    <ChapterButtonsSkeleton />
                </>
            ) : novel ? (
                <>
                    <NovelPage user={user} novel={novel} />
                    <ChapterButtons novel={novel} user={user} />
                </>
            ) : (
                notFound()
            )}
        </main>
    );
}

export default Page;