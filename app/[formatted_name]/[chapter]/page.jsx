"use client"
import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import GetNovel from "@/app/components/functions/GetNovel";

function removeClutter(text) {
    // Regex for detecting clutter patterns
    const pattern = /[^."]*[^\w\n]*r[^\w\n]*e[^\w\n]*e[^\w\n]*w[^\w\n]*.*b[^\w\n]*n[^\w\n]*o[^\w\n]*v[^\w\n]*.[^\w\n]*l[^\w\n]*(?<!<\/)\b|[.\W\n]*c[.\W\n]*o[.\W\n]*m*\b(?<!\n)/gi;

    // Replace matched patterns with empty string
    let cleanText = text.replace(pattern, '');

    // Unicode ranges for non-weird characters
    const validRanges = [
        [0x0041, 0x005A],  // Uppercase Latin letters
        [0x0061, 0x007A],  // Lowercase Latin letters
        [0x0030, 0x0039],  // Digits
        [0x0020, 0x002F],  // Common punctuation
        [0x003A, 0x0040],
        [0x005B, 0x0060],
        [0x007B, 0x007E],
        [0x000A, 0x000A]   // New line character
    ];

    // Filter out characters not in the valid ranges
    let insideInvalidRange = false;
    cleanText = cleanText
        .split('')
        .filter(char => {
            const charCode = char.charCodeAt(0);
            const isValid = validRanges.some(([start, end]) => start <= charCode && charCode <= end);

            if (!isValid) {
                // Check if the character is a period and it's surrounded by invalid characters
                if (char === '.' && insideInvalidRange) {
                    insideInvalidRange = false; // Reset the flag
                    return true; // Include the period
                } else {
                    insideInvalidRange = true; // Mark that we're inside an invalid range
                    return false; // Exclude the character
                }
            } else {
                insideInvalidRange = false; // Reset the flag
                return true; // Include the character
            }
        })
        .join('');

    // Remove extra period following an invalid character
    cleanText = cleanText.replace(/(.)\.(?=[^\w\s]|$)/g, '$1');

    return cleanText;
}

function useFetchChapter(link) {
    const [chapter, setChapter] = useState({});

    useEffect(() => {
        async function fetchChapter() {
            try {
                const res = await fetch(link);

                const html = await res.text();
                const parser = new DOMParser();

                const doc = parser.parseFromString(html, 'text/html');

                const chapterTitle = doc.querySelector('.chapter').textContent.trim();
                let chapterContent = doc.querySelector('#article').innerHTML.trim();

                chapterContent = chapterContent.substring(0, chapterContent.lastIndexOf('<p>'));

                chapterContent = removeClutter(chapterContent)

                setChapter({ chapterTitle, chapterContent});
            } catch (error) {
                console.error(error);
            }
        }
        fetchChapter();
    }, [link]);

    return chapter;
}

function Page({ params }) {
    const link = useMemo(() => `https://freewebnovel.com/${params.formatted_name}/chapter-${params.chapter}.html`, [params]);
    const chapter = useFetchChapter(link);

    const currentChapter = parseInt(params.chapter);

    const prevChapter = currentChapter - 1;

    const nextChapter = currentChapter + 1;

    const chapterCount = GetNovel({ formattedName: params.formatted_name }).chapter_count; // Fetch on the server

    return (
        <main className={'relative top-10'}>
            <div>
                <h1 className="border-b-gray-400 border-b-2 text-center text-3xl mb-4 pb-6">{chapter.chapterTitle}</h1>
                <div className="text-secondary text-lg pb-4 border-b-gray-400 border-b-2" dangerouslySetInnerHTML={{ __html: chapter.chapterContent }} />
                <div className="flex justify-around py-4">
                    {currentChapter > 1 &&(
                    <button className="pr-10">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                        <Link href={`/${params.formatted_name}/${prevChapter}`}>Previous chapter</Link>
                    </button>)}
                    {currentChapter < chapterCount &&(
                    <button className="pl-10">
                        <Link href={`/${params.formatted_name}/${nextChapter}`}>Next chapter</Link>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>)}
                </div>
            </div>
        </main>
    );
}

export default Page;