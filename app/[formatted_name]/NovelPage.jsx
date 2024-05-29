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
            <div className={'flex max-sm:flex-col flex-row max-sm:items-start justify-center items-center max-sm:gap-3 gap-8 border-b-3 border-b-gray-400 pb-4'}>

                <div className="w-1/2 max-sm:w-full">
                    <Image src={novel.alternative_image_url ? novel.alternative_image_url : novel.image_url} alt={`${novel.name} thumbnail`} width={350} height={350} quality={100} className={"select-none rounded-lg shadow-lg m-auto"} draggable="false" />
                </div>
                <div className="flex flex-col justify-center items-start md:w-1/3">
                    <div className={`badge ${novel.status} select-none relative top-20 mb-4 max-sm:left-7 max-sm:p-3`}>
                        <span><p>{novel.status}</p></span>
                    </div>
                    <h1 className="max-sm:text-2xl text-3xl font-bold mb-2">{novel.name}</h1>
                    <p className="max-sm:text-base text-lg mb-2">Chapters: {novel.chapter_count}</p>
                    <p className={"block text-gray-400 text-sm"}> Last updated: <span className={"font-bold"}>{isValidDate(novel.latest_update) ? (
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