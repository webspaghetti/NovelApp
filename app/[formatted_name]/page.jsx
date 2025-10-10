"use client"
import { useEffect, useState } from "react";
import NovelDetails from "@/components/novel-page/NovelDetails";
import ChapterButtonsList from "@/components/novel-page/ChapterButtonsList";
import { notFound} from "next/navigation";
import { fetchNovelByFormattedName } from "@/app/helper-functions/fetchNovelByFormattedName";
import { ChapterButtonsSkeleton, NovelPageSkeleton } from "@/components/general/SkeletonLoaders";


async function getUsersProgress(userId, novelId) {
    try {
        const response = await fetch(`/api/user_progress?userId=${encodeURIComponent(userId)}&novelId=${encodeURIComponent(novelId)}`);
        if (!response.ok) {
            console.error('Failed to fetch user progress');
            return null;
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
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedNovels = await fetchNovelByFormattedName(params.formatted_name);

                if (fetchedNovels) {
                    const fetchedUser = await getUsersProgress(1, fetchedNovels.id); // Just me :)
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
            {isLoading && (
                <>
                    <NovelPageSkeleton />
                    <ChapterButtonsSkeleton />
                </>
            )}

            {novel && !isLoading && (
                <>
                    <NovelDetails user={user} novel={novel} />
                    <ChapterButtonsList novel={novel} user={user} />
                </>
            )}

            {!novel && !isLoading && notFound()}
        </main>
    );
}


export default Page;