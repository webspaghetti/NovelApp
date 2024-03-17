"use client"
import executeQuery from "@/app/database/db";
import DateFormatter from "@/app/components/functions/DateFormatter";
import ChapterButtons from "@/app/[formatted_name]/ChapterButtons";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from 'react';
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

function isValidDate(dateString) {
    return !isNaN(Date.parse(dateString));
}

function Page({params}) {
    const [novel, setNovel] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const novels = await getNovel(params.formatted_name);
                const novel = novels[0]; // Access the first novel in the array

                const users = await getUserInfo(novel.id);
                const user = users[0];

                setNovel(novel);
                setUser(user);
                setIsLoading(false);
            } catch (error) {
                setError(error);
                setIsLoading(false); // Hide loading indicator even in case of error
            }
        };

        fetchData();

        // ... polling logic for updates
    }, [params.formatted_name]);

    return (
        <main className="relative top-20">
            {isLoading || !user ? (
                <div className="relative flex justify-center items-center top-60">
                    <CircularProgress sx={{color: "#5e42cf"}} size={150}/>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-full">
                    <p>Error fetching data: {error.message}</p>
                </div>
            ) : (
                <>
                    <div className={'flex flex-col md:flex-row justify-center items-center gap-8 border-b-3 border-b-gray-400 pb-4'}>
                        <div className="w-full md:w-1/3">
                            <Image src={novel.alternative_image_url ? novel.alternative_image_url : novel.image_url} alt={`${novel.name} thumbnail`} width={350} height={350} quality={100} className="select-none rounded-lg shadow-lg" draggable="false" />
                        </div>
                        <div className="flex flex-col justify-center items-start md:w-1/3">
                            <div className={`badge ${novel.status} select-none relative top-20 mb-4`}>
                                <span>{novel.status}</span>
                            </div>
                            <h1 className="text-3xl font-bold mb-2">{novel.name}</h1>
                            <p className="text-lg mb-2">Chapters: {novel.chapter_count}</p>
                            <p className={"block text-gray-400 text-sm"}> Last updated: {isValidDate(novel.latest_update) ? (
                                <DateFormatter dateString={novel.latest_update} />
                            ) : (
                                novel.latest_update
                            )}
                            </p>
                            <button className="bg-primary text-secondary my-2 py-2 px-6 rounded-lg shadow-md hover:bg-primary-dark transition-colors duration-300">
                                {user?.current_chapter === null
                                    ? <Link href={`/${novel.formatted_name}/1`}>Start reading</Link>
                                    : <Link href={`/${novel.formatted_name}/${user.current_chapter}`}>Continue reading - Chapter: {user.current_chapter} </Link>}
                            </button>
                        </div>
                    </div>
                    <ChapterButtons novel={novel} user={user}/>
                </>
            )}
        </main>
    );
}

export default Page;