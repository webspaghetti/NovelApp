"use client"
import sourceConfig from "@/config/sourceConfig"
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

            // Scrape log
            // console.log(`Starting sync for ${novels.length} novels...`);

            // Process in batches of 5 to avoid overwhelming the server
            const BATCH_SIZE = 5;
            const results = [];

            for (let i = 0; i < novels.length; i += BATCH_SIZE) {
                const batch = novels.slice(i, i + BATCH_SIZE);

                // Scrape log
                // console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(novels.length / BATCH_SIZE)}...`);

                const batchResults = await Promise.all(
                    batch.map(novel => syncNovelData(novel.formatted_name, novel.source))
                );
                results.push(...batchResults);

                // Small delay between batches
                if (i + BATCH_SIZE < novels.length) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // Log summary
            /*const successful = results.filter(r => r.success).length;
            const updated = results.filter(r => r.updated).length;
            const failed = results.filter(r => !r.success);

            console.log(`\n=== Sync Summary ===`);
            console.log(`Total: ${novels.length}`);
            console.log(`Successful: ${successful}`);
            console.log(`Updated: ${updated}`);
            console.log(`Failed: ${failed.length}`);*/

            const failed = results.filter(r => !r.success);
            if (failed.length > 0) {
                console.error('\nFailed novels:', failed.map(f => f.name).join(', '));
            }

            // Reload after all updates complete
            setTimeout(() => {
                location.reload();
            }, 500);

        } catch (error) {
            console.error("Error fetching or updating novels:", error);
            throw error;
        }
    }

    async function syncNovelData(formattedName, source, retries = 2) {
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                // Add a small delay between attempts to avoid overwhelming the server
                if (attempt > 0) {
                    console.log(`Retrying ${formattedName} (attempt ${attempt + 1}/${retries + 1})...`);
                    await new Promise(resolve => setTimeout(resolve, 2000 * attempt)); // Exponential backoff
                }

                const sourceUrl = sourceConfig[source].getInfoLink(formattedName);
                if (!sourceUrl) throw new Error('Invalid source URL');

                const response = await fetch('/api/scrape', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: sourceUrl }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Scrape failed (${response.status}): ${errorText}`);
                }

                const data = await response.json();
                const { novelStatus, lastUpdate, chapterCount } = data.content;

                let updatedStatus = novelStatus;
                let formattedLastUpdate = formatLastUpdate(lastUpdate);

                if (updatedStatus === 'OnGoing' && isMoreThanTwoMonthsOld(formattedLastUpdate)) {
                    updatedStatus = 'Hiatus';
                }

                const databaseNovel = await fetchNovelByFormattedName(formattedName);
                const parsedChapterCount = chapterCount ? parseInt(chapterCount, 10) : 0;

                // Scrape log
                /*console.log(`✓ Scraped ${formattedName}:`, {
                    dbChapters: databaseNovel.chapter_count,
                    scrapedChapters: parsedChapterCount,
                    dbStatus: databaseNovel.status,
                    scrapedStatus: updatedStatus,
                });*/

                if (
                    databaseNovel.chapter_count !== parsedChapterCount ||
                    databaseNovel.status !== updatedStatus ||
                    databaseNovel.latest_update !== formattedLastUpdate
                ) {
                    const updateResponse = await fetch('/api/novels', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            formattedName,
                            chapterCount: parsedChapterCount,
                            status: updatedStatus,
                            latestUpdate: formattedLastUpdate,
                        }),
                    });

                    if (!updateResponse.ok) {
                        const errorText = await updateResponse.text();
                        throw new Error(`Failed to update: ${errorText}`);
                    }

                    console.log(`✓ ${formattedName} updated successfully`);
                    return { success: true, updated: true, name: formattedName };
                } else {
                    console.log(`✓ ${formattedName} is already up to date`);
                    return { success: true, updated: false, name: formattedName };
                }
            } catch (error) {
                if (attempt === retries) {
                    console.error(`✗ Failed to sync ${formattedName} after ${retries + 1} attempts:`, error.message);
                    return { success: false, error: error.message, name: formattedName };
                }
            }
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