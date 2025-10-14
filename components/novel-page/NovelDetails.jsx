import React from 'react';
import sourceConfig from "@/config/sourceConfig"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { isValidDate } from "@/app/helper-functions/isValidDate";
import { dateFormatter } from "@/app/helper-functions/dateFormatter";
import NovelSettingsPopup from "@/components/novel-page/NovelSettingsPopup";


function NovelDetails({novel, user}) {
    const progressPercentage = user.current_chapter / novel.chapter_count * 100;
    const [popupTrigger, setPopupTrigger] = useState(false);

    return (
        <div className={'flex max-sm:flex-col flex-row max-sm:items-start justify-center items-center max-sm:gap-3 gap-8 border-b-[3px] border-gray-700 pb-4'}>

            <div className="w-1/2 max-sm:w-full">
                <Image src={novel.image_url_alternative ? novel.image_url_alternative : novel.image_url} alt={`${novel.name} thumbnail`} width={350} height={350} quality={100} className={"select-none rounded-lg shadow-cardB m-auto"} draggable="false" priority={true} />
            </div>
            <div className="flex flex-col justify-center items-start md:w-1/3 max-sm:w-full">
                <button className="absolute top-0 max-sm:top-1 max-md:right-1 right-16 text-secondary p-1 z-10" onClick={() => setPopupTrigger(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
                    </svg>
                </button>
                <span className={'flex flex-row items-center sm:gap-2'}>
                    <div className={`badge ${novel.status} max-sm:left-7 max-sm:p-1.5 max-sm:mt-2 mb-4 max-sm:absolute max-sm:top-20`}>
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
                    <div
                        className="source max-sm:mt-[8rem]"
                        style={{
                            backgroundImage: `url(${sourceConfig[novel.source].icon_url})`,
                        }}
                    />
                </span>
                <h1 className="max-sm:text-2xl text-3xl font-bold mb-2">{novel.name}</h1>
                <p className="max-sm:text-base text-lg mb-2">Chapters: {novel.chapter_count}</p>
                <p className={"block text-gray-400 text-sm"}> Last updated: {' '}
                    <span className={"font-bold"}>{isValidDate(novel.latest_update) ? (
                        dateFormatter(novel.latest_update)
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

            <NovelSettingsPopup trigger={popupTrigger} setTrigger={setPopupTrigger} novel={novel} />
        </div>
    );
}


export default NovelDetails;