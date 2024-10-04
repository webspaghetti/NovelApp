"use client"
import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import DateFormatter from "@/app/components/functions/DateFormatter";
import CircularProgress from "@mui/material/CircularProgress";

function LoadNovels({ novels }) {
    const [userProgress, setUserProgress] = useState({});
    const [isLoadingProgress, setIsLoadingProgress] = useState(true);

    useEffect(() => {
        async function fetchUserProgress() {
            try {
                const res = await fetch('/api/user_progress?userId=1');
                if (!res.ok) {
                    throw new Error('Failed to fetch user progress');
                }
                const data = await res.json();
                // Convert array to object for easier lookup
                const progressObj = data.reduce((acc, item) => {
                    acc[item.novel_id] = item;
                    return acc;
                }, {});
                setUserProgress(progressObj);
            } catch (error) {
                console.error('Error fetching user progress:', error);
                // Handle error (e.g., show error message to user)
            } finally {
                setIsLoadingProgress(false);
            }
        }

        fetchUserProgress();
    }, []);

    function isValidDate(dateString) {
        return !isNaN(Date.parse(dateString));
    }

    return (
        novels.map((novel) => {
            const progress = userProgress[novel.id];
            const currentChapter = progress && progress.current_chapter !== null ? progress.current_chapter : 0;
            const progressPercentage = currentChapter / novel.chapter_count * 100;

            return (
                <div key={novel.id} className={"card glassy-animation"} style={{ height: "auto" }}>
                    <Link href={`/${novel.formatted_name}`}>
                        <Image src={novel.alternative_image_url ? novel.alternative_image_url : novel.image_url} alt={`${novel.name} thumbnail`} width={1000} height={1000} quality={100} className={"w-full h-100 md:h-96 max-sm:h-52 object-cover select-none img"} draggable="false" priority={true} />

                        <div className="m-4 max-sm:hidden">
                            <div className={"text-secondary font-bold text-lg max-w-30 truncate"}>{novel.name}</div>
                            <span className={"flex items-center justify-center text-gray-400 text-sm"}>
                                Progress: {
                                isLoadingProgress ? (
                                    <CircularProgress size={14} sx={{ color: "#16a34a"}} thickness={10} />
                                ) : (
                                    <span className={"text-green-600 font-bold ml-2 mr-1"}>{currentChapter}</span>
                                )
                            } / {novel.chapter_count}
                                {currentChapter === novel.chapter_count && (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#16a34a" className="size-4 ml-1">
                                        <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </span>
                            <span className={"block text-gray-400 text-sm"}> Last updated: <br className={"sm:hidden"} /> <span className={"font-bold"}>{isValidDate(novel.latest_update) ? (
                                <DateFormatter dateString={novel.latest_update} />
                            ) : (
                                novel.latest_update
                            )}
                                </span>
                            </span>

                            <div className="w-full bg-gray-700 h-2 mt-2 rounded-xl">
                                {!isLoadingProgress && (
                                    <div className="bg-green-600 h-2 rounded-xl" style={{ width: `${progressPercentage > 0 ? Math.max(progressPercentage, 2) : 0}%` }}></div>
                                )}
                            </div>
                        </div>
                        <div className="m-2 sm:hidden">
                            <div className="w-full bg-gray-700 h-2 mt-2 rounded-xl">
                                {!isLoadingProgress && (
                                    <div className="bg-green-600 h-2 rounded-xl" style={{ width: `${progressPercentage > 0 ? Math.max(progressPercentage, 2) : 0}%` }}></div>
                                )}
                            </div>

                            <span className={"flex items-center justify-center text-gray-400 text-sm pt-1"}>
                                {
                                isLoadingProgress ? (
                                    <CircularProgress size={14} sx={{ color: "#16a34a"}} thickness={10} />
                                ) : (
                                    <span className={"text-green-600 font-bold ml-2 mr-1"}>{currentChapter}</span>
                                )
                            } / {novel.chapter_count}
                                {currentChapter === novel.chapter_count && (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#16a34a" className="size-4 ml-1">
                                        <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </span>
                        </div>

                        <div className={`badge ${novel.status} absolute top-2 right-2`}>
                            <span>
                                {novel.status === "Completed" && (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={5} stroke="currentColor" className="max-sm:size-3 size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                        </svg>
                                    </>
                                )}
                                {novel.status === "OnGoing" && (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="max-sm:size-4 size-7">
                                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
                                        </svg>
                                    </>
                                )}
                                {novel.status === "Hiatus" && (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={5} stroke="currentColor" className="max-sm:size-3 size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                                        </svg>
                                    </>
                                )}
                            </span>
                        </div>
                    </Link>
                </div>
            );
        })
    );
}

export default LoadNovels;