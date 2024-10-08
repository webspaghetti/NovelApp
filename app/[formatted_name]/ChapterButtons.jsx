"use client"

import React from "react";
import Link from "next/link";

function ChapterButtons({ novel, user }) {

    return (
        <div className="grid max-sm:grid-cols-3 grid-cols-5 gap-4 justify-center items-center mt-4 pb-4">
            {Array.from({ length: novel.chapter_count }, (_, index) => {
                const chapterNumber = novel.chapter_count - index;
                const isBreakpoint = (chapterNumber % 100) === 0;

                if (isBreakpoint) {
                    return (
                        <React.Fragment key={`fragment${chapterNumber/100}`}>
                        <h1 key={`breakPoint${chapterNumber/100}`} className="col-span-full max-sm:text-xl text-2xl font-bold text-center my-4 text-secondary link_outline select-none">
                                Chapters {chapterNumber} - {chapterNumber - 99}
                            </h1>
                            <button
                                key={`chapter-${chapterNumber}`}
                                className={`normal-case px-4 py-2 rounded-md text-lg flex justify-center items-center bg-primary ${
                                    user?.read_chapters.includes(chapterNumber) && user?.current_chapter !== chapterNumber ? 'border-[#3d2a84] !bg-[#3d2a84] hover:bg-[#3d2a84] text-gray-400 hover:text-gray-400' : ''
                                } ${
                                    user?.current_chapter === chapterNumber ? 'border-green-600 !bg-green-600' : ''
                                }`}
                            >
                                <Link href={`/${novel.formatted_name}/${chapterNumber}`}><p className={'max-sm:text-base'}> Chapter {chapterNumber} </p></Link>
                            </button>
                        </React.Fragment>
                    );
                } else {
                    return (
                        <button
                            key={`chapter-${chapterNumber}`}
                            className={`normal-case px-4 py-2 rounded-md text-lg flex justify-center items-center bg-primary  ${
                                user?.read_chapters.includes(chapterNumber) && user?.current_chapter !== chapterNumber ? 'border-[#3d2a84] !bg-[#3d2a84] hover:bg-[#3d2a84] text-gray-400 hover:text-gray-400' : ''
                            } ${
                                user?.current_chapter === chapterNumber ? 'border-green-600 !bg-green-600' : ''
                            }`}
                        >
                            <Link href={`/${novel.formatted_name}/${chapterNumber}`}><p className={'max-sm:text-base'}> Chapter {chapterNumber} </p></Link>
                        </button>
                    );
                }
            })}
        </div>
    );
}

export default ChapterButtons;