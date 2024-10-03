"use client"
import LoadingPopup from "@/app/components/LoadingPopup";
import { useState } from "react";
import GetNovel from "@/app/components/functions/GetNovel";

function FetchNovels() {
    const [buttonPopup, setButtonPopup] = useState(false);

    function formatLastUpdate(lastUpdateText) {
        return lastUpdateText.replace(/Updated |\[|]/g, '').trim();
    }

    function extractChapterNumber(chapterText) {
        const match = chapterText.match(/\d+/);
        return match ? match[0] : '';
    }

    async function RefetchNovels(formattedName) {
        const response = await fetch(`https://freewebnovel.com/${formattedName}.html`);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        let novelStatus = doc.querySelector('.s1.s2, .s1.s3').textContent.trim();
        const lastUpdate = formatLastUpdate(doc.querySelector('.lastupdate').textContent);
        const chapterCountFetch = extractChapterNumber(doc.querySelector('.ul-list5 li').textContent);
        const chapterCount = parseInt(chapterCountFetch);

        function isMoreThanTwoMonthsOld(update) {
            if (update.includes('months ago')) {
                const monthsAgo = parseInt(update);
                return monthsAgo >= 3;
            } else if (update.includes('a year ago') || update.includes('years ago')) {
                return true;
            } else if (Date.parse(update)) {
                return true;
            }
            return false;
        }

        if (novelStatus === 'OnGoing' && isMoreThanTwoMonthsOld(lastUpdate)) {
            novelStatus = 'Hiatus';
        }

        try {
            const databaseNovel = await GetNovel(formattedName);

            if (databaseNovel.chapter_count !== chapterCount ||
                databaseNovel.status !== novelStatus ||
                databaseNovel.latest_update !== lastUpdate
            ) {
                const response = await fetch('/api/novels', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        formattedName,
                        chapterCount,
                        status: novelStatus,
                        latestUpdate: lastUpdate
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update novel');
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function GetAllNovels() {
        try {
            const response = await fetch('/api/novels');
            if (!response.ok) {
                throw new Error('Failed to fetch novels');
            }
            const novels = await response.json();

            for (const novel of novels) {
                await RefetchNovels(novel.formatted_name);
            }
            location.reload();
        } catch (error) {
            console.error("Error fetching formatted_names:", error);
        }
    }

    function handleButtonClick() {
        setButtonPopup(true);
        GetAllNovels();
    }

    return (
        <>
            <button onClick={handleButtonClick} className={"ml-2 svg-animate-rotate"}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <p className={'max-sm:hidden'}>Refresh novels</p>
            </button>
            <LoadingPopup trigger={buttonPopup}/>
        </>
    );
}

export default FetchNovels;