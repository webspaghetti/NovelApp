"use client"
import { useState } from "react";
import LoadingOverlay from "@/components/general/LoadingOverlay";
import { fetchNovelByFormattedName } from "@/app/helper-functions/fetchNovelByFormattedName";
import AnimatedIconButton from "@/components/general/AnimatedIconButton";
import { isMoreThanTwoMonthsOld } from "@/app/helper-functions/isMoreThanTwoMonthsOld";
import formatLastUpdate from "@/app/helper-functions/formatLastUpdate";


function SyncNovelsButton() {
    const [overlayTrigger, setOverlayTrigger] = useState(false);

    async function handleButtonClick() {
        setOverlayTrigger(true); // Show the loading overlay
        try {
            await fetchAndUpdateNovels();
        } catch (error) {
            console.error("Error in fetching and updating novels:", error);
        } finally {
            setOverlayTrigger(false);
        }
    }


    async function fetchAndUpdateNovels() {
        try {
            const response = await fetch('/api/novels');
            if (!response.ok) {
                throw new Error('Failed to fetch novels');
            }
            const novels = await response.json();

            // Use Promise.all to run syncNovelData concurrently for all novels
            await Promise.all(novels.map(novel => syncNovelData(novel.formatted_name, novel.source)));

            setTimeout(() => {
                location.reload();
            }, 0);
        } catch (error) {
            console.error("Error fetching or updating novels:", error);
            return [];
        }
    }

    async function syncNovelData(formattedName, source) {
        try {
            const sourceUrlsMap = {
                'freewebnovel': `https://freewebnovel.com/${formattedName}.html`,
                'lightnovelworld': `https://www.lightnovelworld.co/novel/${formattedName}`,
            };

            const sourceUrl = sourceUrlsMap[source];


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

            let updatedStatus = novelStatus;
            let formattedLastUpdate = formatLastUpdate(lastUpdate);

            if (updatedStatus === 'OnGoing' && isMoreThanTwoMonthsOld(formattedLastUpdate)) {
                updatedStatus = 'Hiatus';
            }

            const databaseNovel = await fetchNovelByFormattedName(formattedName);

            if (databaseNovel.chapter_count !== parseInt(chapterCount) ||
                databaseNovel.status !== updatedStatus ||
                databaseNovel.latest_update !== formattedLastUpdate
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
                        latestUpdate: formattedLastUpdate
                    }),
                });

                if (!updateResponse.ok) {
                    throw new Error('Failed to fetch novel data');
                }
            }
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <>
            <AnimatedIconButton label={'Refresh novels'} onClick={handleButtonClick} animation={'svg-animate-rotate'} shape={'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99'} />
            <LoadingOverlay trigger={overlayTrigger}/>
        </>
    );
}


export default SyncNovelsButton;