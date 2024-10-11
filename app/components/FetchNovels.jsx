"use client"
import { useState } from "react";
import LoadingPopup from "@/app/components/LoadingPopup";
import GetNovel from "@/app/components/functions/GetNovel";
import HoverRevealButton from "@/app/components/HoverRevealButton";
import IsMoreThanTwoMonthsOld from "@/app/components/functions/IsMoreThanTwoMonthsOld";
import wordsToNumbers from "words-to-numbers";

function FetchNovels() {
    const [buttonPopup, setButtonPopup] = useState(false);

    function formatLastUpdate(lastUpdateText) {
        // Remove 'Updated' and surrounding brackets
        let formattedText = lastUpdateText.replace(/Updated |\[|]/g, '').trim();

        // Split the text to isolate the time-related part
        let timePart = formattedText.split(' ')[0];

        // Check if the time part is a written number, and convert it if needed
        const numericTimePart = isNaN(timePart) ? wordsToNumbers(timePart) : timePart;

        // Rebuild the final string with the converted time part
        return formattedText.replace(timePart, numericTimePart);
    }

    async function RefetchNovels(formattedName, source) {
        try {
            const sourceUrl = (source === 'freewebnovel') ? `https://freewebnovel.com/${formattedName}.html` : `https://www.lightnovelworld.co/novel/${formattedName}` ;

            const response = await fetch('/api/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: sourceUrl }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch novel data');
            }

            const data = await response.json();
            const { novelStatus, lastUpdate, chapterCount } = data.content;

            let updatedStatus = (novelStatus === 'Ongoing') ? 'OnGoing' : novelStatus;

            if (updatedStatus === 'OnGoing' && IsMoreThanTwoMonthsOld(formatLastUpdate(lastUpdate))) {
                updatedStatus = 'Hiatus';
            }

            const databaseNovel = await GetNovel(formattedName);

            if (databaseNovel.chapter_count !== parseInt(chapterCount) ||
                databaseNovel.status !== updatedStatus ||
                databaseNovel.latest_update !== formatLastUpdate(lastUpdate)
            ) {
                const updateResponse = await fetch('/api/novels', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        formattedName,
                        chapterCount: parseInt(chapterCount),
                        status: updatedStatus,
                        latestUpdate: formatLastUpdate(lastUpdate)
                    }),
                });

                if (!updateResponse.ok) {
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

            // Use Promise.all to run RefetchNovels concurrently for all novels
            await Promise.all(novels.map(novel => RefetchNovels(novel.formatted_name, novel.source)));

            setTimeout(() => {
                location.reload();
            }, 0);
        } catch (error) {
            console.error("Error fetching or updating novels:", error);
        }
    }

    function handleButtonClick() {
        setButtonPopup(true);
        GetAllNovels();
    }

    return (
        <>
            <HoverRevealButton label={'Refresh novels'} onClick={handleButtonClick} animation={'svg-animate-rotate'} shape={'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99'} />
            <LoadingPopup trigger={buttonPopup}/>
        </>
    );
}

export default FetchNovels;