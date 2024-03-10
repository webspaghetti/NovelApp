"use client"

import React from "react";

function ChapterButtons({ novel, user }) {

    return (
        <div className="grid grid-cols-5 gap-4 justify-center items-center mt-4 pb-4">
            {Array.from({ length: novel.chapter_count }, (_, index) => {
                const chapterNumber = novel.chapter_count - index;
                const isBreakpoint = (chapterNumber % 100) === 0;

                if (isBreakpoint) {
                    return (
                        <React.Fragment key={`fragment${chapterNumber/100}`}>
                        <h1 key={`breakPoint${chapterNumber/100}`} className="col-span-full text-2xl font-bold text-center my-4 text-secondary link_outline select-none">
                                Chapters {chapterNumber - 99} - {chapterNumber}
                            </h1>
                            <button key={chapterNumber} className="normal-case px-4 py-2 rounded-md text-lg text-secondary flex justify-center items-center">
                                Chapter {chapterNumber}
                            </button>
                        </React.Fragment>
                    );
                } else {
                    return (
                        <button
                            key={chapterNumber}
                            className={`normal-case px-4 py-2 rounded-md text-lg flex justify-center items-center ${
                                user?.novel_chapter > chapterNumber ? 'border-green-700 hover:bg-green-700 text-gray-400' : ''
                            } ${
                                user?.novel_chapter === chapterNumber ? 'border-green-500 hover:bg-green-500' : ''
                            }`}
                        >
                            Chapter {chapterNumber}
                        </button>
                    );
                }
            })}
        </div>
    );
}

export default ChapterButtons;