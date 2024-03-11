"use client"
import {useEffect, useMemo, useState} from "react";

function removeClutter(text) {
    // Define a regular expression pattern to match variations of 'freewebnovel'
    const pattern = /f[^\w\n]*r[^\w\n]*e[^\w\n]*e[^\w\n]*w[^\w\n]*.*b[^\w\n]*n[^\w\n]*o[^\w\n]*v[^\w\n]*.[^\w\n]*l[^\w\n]*(?<!<\/)\b|[.\W\n]*c[.\W\n]*o[.\W\n]*m*\b(?<!\n)/gi;

    // Replace matched patterns with empty string
    let cleanText = text.replace(pattern, '');

    // Define Unicode ranges for characters you want to keep
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
    cleanText = cleanText.split('').filter(char =>
        validRanges.some(([start, end]) => start <= char.charCodeAt(0) && char.charCodeAt(0) <= end)
    ).join('');

    // Remove extra period following an invalid character
    cleanText = cleanText.replace(new RegExp(`([${String.fromCharCode(...validRanges.flat().map((charCode) => Array.from({ length: charCode[1] - charCode[0] + 1 }, (_, i) => charCode[0] + i)).flat())}])\\..`, 'g'), '$1.');

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

                let clutter = chapterContent;

                chapterContent = removeClutter(chapterContent)

                setChapter({ chapterTitle, chapterContent, clutter });
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

    return (
        <main className={'relative top-20'}>
            <div>
                <h1 className={'border-b-gray-400 border-b-2'}>{chapter.chapterTitle}</h1>
                <div dangerouslySetInnerHTML={{ __html: chapter.clutter }} className={'text-secondary'}/>
                <div dangerouslySetInnerHTML={{ __html: chapter.chapterContent }} className={'text-secondary'}/>
            </div>
        </main>
    );
}

export default Page;