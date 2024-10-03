"use client"
import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import GetNovel from "@/app/components/functions/GetNovel";
import SetUserProgress from "@/app/components/functions/SetUserProgress";
import CircularProgress from "@mui/material/CircularProgress";
import {notFound} from "next/navigation";

function removeClutter(text) {
    // Regex for detecting clutter patterns
    const pattern = /[^.">]*[^\w\n]*r[^\w\n]*e[^\w\n]*e[^\w\n]*w[^\w\n]*.*b[^\w\n]*n[^\w\n]*o[^\w\n]*v[^\w\n]*.[^\w\n]*l[^\w\n]*(?<!<\/)\b|[\W\n]*c[.\W\n]*o[.\W\n]*m*(?!\w)(\))?(?<!<\/)/gi;
    const chapterPattern = /<p>\s*<\/p><h4>Chapter \d+.*?<\/h4>\s*<p>\s*<\/p>|<p>\s*Chapter \d+\s.*?<\/p>/gi;
    const translatorPattern = /<p>\s*(<strong>)?Translator: (<\/strong>)?.*?<\/p>/gi;

    // Replace matched patterns with empty string
    let cleanText = text.replace(pattern, '');

    cleanText = cleanText.replace(chapterPattern, '');

    cleanText = cleanText.replace(translatorPattern, '');

    // Unicode ranges for non-weird characters
    const validRanges = [
        [0x0041, 0x005A],  // Uppercase Latin letters
        [0x0061, 0x007A],  // Lowercase Latin letters
        [0x0030, 0x0039],  // Digits
        [0x0020, 0x002F],  // Common punctuation
        [0x003A, 0x0040],
        [0x005B, 0x0060],
        [0x007B, 0x007E],
        [0x000A, 0x000A],   // New line character
        [0x201C, 0x201D],  // The characters “”
        [0x2018, 0x2019] // The character ‘’
    ];

    // Filter out characters not in the valid ranges
    cleanText = cleanText
        .split('')
        .filter((char, index, array) => {
            const charCode = char.charCodeAt(0);
            const isValid = validRanges.some(([start, end]) => start <= charCode && charCode <= end);

            if (!isValid) {
                return false;
            } else return !(char === '.' && (index === 0 || index === array.length - 1 || !isValidCharacter(array[index - 1]) && !isValidCharacter(array[index + 1])));
        })
        .join('');

    function isValidCharacter(character) {
        const charCode = character.charCodeAt(0);
        return validRanges.some(([start, end]) => start <= charCode && charCode <= end);
    }

    return cleanText;
}

function Page({ params }) {
    const link = useMemo(() => `https://freewebnovel.com/${params.formatted_name}/chapter-${params.chapter}.html`, [params]);
    const [isLoading, setIsLoading] = useState(true);
    const [chapter, setChapter] = useState({});
    const [novel, setNovel] = useState(null);
    const [currentChapter, setCurrentChapter] = useState(null);
    const [chapterCount, setChapterCount] = useState(null);

    useEffect(() => {
        async function fetchNovelAndChapter() {
            try {
                // Fetch novel data
                const novelData = await GetNovel(params.formatted_name);
                setNovel(novelData);

                const currentChapterNum = parseInt(params.chapter);
                setCurrentChapter(currentChapterNum);
                setChapterCount(novelData.chapter_count);

                if (currentChapterNum > novelData.chapter_count || currentChapterNum < 1) {
                    notFound();
                    return;
                }

                // Fetch chapter content
                const res = await fetch(link);
                const html = await res.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const chapterTitle = doc.querySelector('.chapter').textContent.trim();
                let chapterContent = doc.querySelector('#article').innerHTML.trim();
                chapterContent = chapterContent.substring(0, chapterContent.lastIndexOf('<p>'));
                chapterContent = removeClutter(chapterContent);

                setChapter({ chapterTitle, chapterContent });

                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        }
        fetchNovelAndChapter();
    }, [link, params.formatted_name, params.chapter]);

    if (isLoading) {
        return (
            <div className="relative flex justify-center items-center h-full top-60">
                <CircularProgress sx={{color: "#5e42cf"}} size={150} thickness={6}/>
            </div>
        );
    }

    const prevChapter = currentChapter - 1;
    const nextChapter = currentChapter + 1;

    return (
        <main className={'relative px-5'}>
            <style jsx global>{`
              body {
                background-image: none;
                background-color: #171717;
              }
            `}</style>
            <div>
                <div className="flex justify-start mb-5">
                    <Link href={`/${params.formatted_name}`}>
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="max-sm:w-6 max-sm:h-6 w-7 h-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                            </svg>
                        </button>
                    </Link>
                </div>
                <h1 className="border-b-gray-400 border-b-2 text-center max-sm:text-2xl text-3xl mb-4 pb-6">{chapter.chapterTitle}</h1>
                <div className="text-secondary max-sm:text-base text-lg pb-4 border-b-gray-400 border-b-2" dangerouslySetInnerHTML={{ __html: chapter.chapterContent.replace(/<p>/g, '<p style="margin: 1rem 0;">') }} />
                <div className="flex justify-around py-4">
                    {currentChapter > 1 &&(
                        <Link href={`/${params.formatted_name}/${prevChapter}`}>
                            <button className="md:pr-10 max-sm:py-4 max-sm:px-8" aria-label={"Previous chapter"}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                </svg>
                                <p className={'max-sm:hidden'}>Previous chapter</p>
                            </button>
                        </Link>
                    )}

                    {currentChapter < chapterCount &&(
                        <Link href={`/${params.formatted_name}/${nextChapter}`}>
                            <button className="md:pl-10 max-sm:py-4 max-sm:px-8" aria-label={"Next chapter"}>
                                <p className={'max-sm:hidden'}>Next chapter</p>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </Link>
                    )}
                </div>
            </div>
            {novel && (
                <SetUserProgress
                    userID={1}
                    novelID={novel.id}
                    currentChapter={currentChapter}
                />
            )}
        </main>
    );
}

export default Page;