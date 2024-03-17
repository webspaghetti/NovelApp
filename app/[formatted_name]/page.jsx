"use client"
import executeQuery from "@/app/database/db";
import React, {useEffect, useState} from "react";
import NovelPage from "@/app/[formatted_name]/NovelPage";
import ChapterButtons from "@/app/[formatted_name]/ChapterButtons";
import {notFound} from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";

export const dynamicParams = true;

async function getNovel(f_name){
    try {
        // Problems with ("SELECT * FROM novel_table WHERE formatted_name = ?", [f_name])
        return await executeQuery(`SELECT * FROM novel_table WHERE formatted_name = '${f_name}'`);
    } catch (error) {
        console.error("Oops, an error occurred:", error);
        return null;
    }
}

async function getUserInfo(n_id){
    try {
        return await executeQuery(`SELECT * FROM user_progress WHERE user_id = 1 AND novel_id = ${n_id}`); // Just me :)
    } catch (error) {
        console.error("Oops, an error occurred:", error);
        return null;
    }
}

function Page({params}) {
    const [novel, setNovel] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedNovels = await getNovel(params.formatted_name);

                if (fetchedNovels && fetchedNovels.length > 0) {
                    const fetchedUser = await getUserInfo(fetchedNovels[0].id);
                    setUser(fetchedUser[0]);
                    setNovel(fetchedNovels[0]);
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
        <main className="relative top-20">
            {isLoading ? (
                <div className="relative flex justify-center items-center top-60">
                    <CircularProgress sx={{color: "#5e42cf"}} size={150}/>
                </div>
            ) : novel ?(
                <>
                <NovelPage user={user} novel={novel} />
                <ChapterButtons novel={novel} user={user} />
                </>
            ): (
                notFound()
            )}
        </main>
    );

}

export default Page;