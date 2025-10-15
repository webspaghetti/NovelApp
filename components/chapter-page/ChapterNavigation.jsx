"use client"
import Link from "next/link";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";


function ChapterNavigation({ prevChapter, nextChapter, currentChapter, chapterCount, formattedName }) {
    const [isLoading, setIsLoading] = useState(true);
    const [loadingButton, setLoadingButton] = useState(null);

    return (
        <div className="flex justify-between py-4">
            {currentChapter > 1 && (
                <Link className={`disabled:${isLoading} ${isLoading ? 'opacity-60' : ''}`} href={`/${formattedName}/${prevChapter}`} onClick={() => {
                    setIsLoading(true)
                    setLoadingButton("Previous")
                }}>
                    <button className='md:pr-5 max-sm:py-4 max-sm:px-6 group' aria-label={"Previous chapter"} disabled={isLoading}>
                        {isLoading && loadingButton === "Previous" ? (
                            <CircularProgress sx={{color: "#FAFAFA"}} size={20} thickness={8} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        )}
                        <span className="max-sm:hidden overflow-hidden opacity-0 max-w-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-1000 ease-in-out">
                            <span className="pl-2 whitespace-nowrap">Previous chapter</span>
                        </span>
                    </button>
                </Link>
            )}

            {currentChapter === 1 && <div />}

            {currentChapter < chapterCount && (

                <Link className={`disabled:${isLoading} ${isLoading ? 'opacity-60' : ''}`} href={`/${formattedName}/${nextChapter}`} onClick={() => {
                    setIsLoading(true)
                    setLoadingButton("Next")
                }}>
                    <button className='md:pl-5 max-sm:py-4 max-sm:px-6 group' aria-label={"Next chapter"} disabled={isLoading}>
                        <span className="max-sm:hidden overflow-hidden opacity-0 max-w-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-1000 ease-in-out">
                            <span className="pl-2 whitespace-nowrap">Next chapter</span>
                        </span>
                        {isLoading && loadingButton === "Next" ? (
                            <CircularProgress sx={{color: "#FAFAFA"}} size={20} thickness={8} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        )}
                    </button>
                </Link>
            )}
        </div>
    );
}


export default ChapterNavigation;
