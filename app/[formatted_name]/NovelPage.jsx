import React from 'react';
import Image from "next/image";
import DateFormatter from "@/app/components/functions/DateFormatter";
import Link from "next/link";

function isValidDate(dateString) {
    return !isNaN(Date.parse(dateString));
}

function NovelPage({novel, user}) {
    return (
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
                        {user?.current_chapter === undefined
                            ? <Link href={`/${novel.formatted_name}/1`}>Start reading</Link>
                            : <Link href={`/${novel.formatted_name}/${user.current_chapter}`}>Continue reading - Chapter: {user.current_chapter} </Link>}
                    </button>
                </div>

            </div>
    );
}

export default NovelPage;