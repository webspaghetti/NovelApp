import React from 'react';
import Image from "next/image";
import DateFormatter from "@/app/components/functions/DateFormatter";
import Link from "next/link";

function isValidDate(dateString) {
    return !isNaN(Date.parse(dateString));
}

function NovelPage({novel, user}) {
    const progressPercentage = user.current_chapter / novel.chapter_count * 100;

    return (
        <div className={'flex max-sm:flex-col flex-row max-sm:items-start justify-center items-center max-sm:gap-3 gap-8 border-b-[3px] border-gray-700 pb-4'}>

            <div className="w-1/2 max-sm:w-full">
                <Image src={novel.image_url_alternative ? novel.image_url_alternative : novel.image_url} alt={`${novel.name} thumbnail`} width={350} height={350} quality={100} className={"select-none rounded-lg shadow-cardB m-auto"} draggable="false" priority={true} />
            </div>
            <div className="flex flex-col justify-center items-start md:w-1/3 max-sm:w-full">
                <span className={'flex flex-row items-center sm:gap-2'}>
                    <div className={`badge ${novel.status} max-sm:left-7 max-sm:p-1.5 max-sm:mt-2 mb-4 max-sm:absolute max-sm:top-0`}>
                        <span className={'flex flex-row items-center'}>
                            {novel.status === "Completed" && (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={5} stroke="currentColor" className="size-5 sm:ml-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                    <span className="ml-1 mr-2 max-sm:hidden">Completed</span>
                                </>
                            )}
                            {novel.status === "OnGoing" && (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="max-sm:size-7 size-5 sm:ml-1">
                                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-1 mr-2 max-sm:hidden">OnGoing</span>
                                </>
                            )}
                            {novel.status === "Hiatus" && (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={5} stroke="currentColor" className="size-5 sm:ml-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                                    </svg>
                                    <span className="ml-1 mr-2 max-sm:hidden">Hiatus</span>
                                </>
                            )}
                            </span>
                        </div>
                    <div className={`source ${novel.source} max-sm:mt-[46px]`} />
                </span>
                <h1 className="max-sm:text-2xl text-3xl font-bold mb-2">{novel.name}</h1>
                <p className="max-sm:text-base text-lg mb-2">Chapters: {novel.chapter_count}</p>
                <p className={"block text-gray-400 text-sm"}> Last updated: {' '}
                    <span className={"font-bold"}>{isValidDate(novel.latest_update) ? (
                        <DateFormatter dateString={novel.latest_update} />
                    ) : (
                        novel.latest_update
                    )}
                    </span>
                </p>
                <button className="my-2 py-2 px-6 rounded-lg max-sm:px-4 shadow-md">
                    {user?.current_chapter === null
                        ? <Link href={`/${novel.formatted_name}/1`}><p className={'max-sm:text-sm'}>Start reading</p></Link>
                        : <Link href={`/${novel.formatted_name}/${user.current_chapter}`}><p className={'max-sm:text-sm'}>Continue reading - Chapter: {user.current_chapter} </p></Link>}
                </button>
                <div className="w-full bg-gray-700 h-2 mt-2 rounded-xl">
                    <div className="bg-green-600 h-2 rounded-xl" style={{ width: `${progressPercentage > 0 ? Math.max(progressPercentage, 2) : 0}%` }}></div>
                </div>
            </div>

        </div>
    );
}

export default NovelPage;