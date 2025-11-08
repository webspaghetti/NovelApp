"use client"
import sourceConfig from "@/config/sourceConfig"
import { useState, useMemo } from "react";
import { dateFormatter } from "@/app/helper-functions/dateFormatter";
import { isMoreThanTwoMonthsOld } from "@/app/helper-functions/isMoreThanTwoMonthsOld";
import { parseRelativeTime } from "@/app/helper-functions/parseRelativeTime";
import { isValidDate } from "@/app/helper-functions/isValidDate";
import { fetchNovelByFormattedNameAndSource } from "@/app/api/novels/util/fetchNovelByFormattedNameAndSource";
import LoadingOverlay from "@/components/general/LoadingOverlay";
import AnimatedIconButton from "@/components/general/AnimatedIconButton";
import formatLastUpdate from "@/app/helper-functions/formatLastUpdate";


function SyncNovelsButton({ novelList, userNovel, isOnline }) {
    const [overlayTrigger, setOverlayTrigger] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedNovels, setSelectedNovels] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortOption, setSortOption] = useState("default");


    // Create a lookup object mapping novel IDs to user novel data
    const unObj = useMemo(() => {
        return userNovel.reduce((acc, item) => {
            acc[item.novel_id] = item;
            return acc;
        }, {});
    }, [userNovel]);

    // Filter and sort novels
    const filteredAndSortedNovels = useMemo(() => {
        let filtered = [...novelList];

        if (searchTerm) {
            filtered = filtered.filter(novel => {
                const userNovelData = unObj[novel.id];
                const nameToSearch = userNovelData?.name_alternative || novel.name;
                return nameToSearch.toLowerCase().includes(searchTerm.toLowerCase());
            });
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(novel => novel.status === statusFilter);
        }


        // Sort
        switch (sortOption) {
            case "name-asc":
                filtered.sort((a, b) => {
                    const nameA = unObj[a.id]?.name_alternative || a.name;
                    const nameB = unObj[b.id]?.name_alternative || b.name;
                    return nameA.localeCompare(nameB);
                });
                break;
            case "name-desc":
                filtered.sort((a, b) => {
                    const nameA = unObj[a.id]?.name_alternative || a.name;
                    const nameB = unObj[b.id]?.name_alternative || b.name;
                    return nameB.localeCompare(nameA);
                });
                break;
            case "update-newest":
                filtered.sort((a, b) => {
                    const dateA = isValidDate(a.latest_update)? a.latest_update : parseRelativeTime(a.latest_update);
                    const dateB = isValidDate(b.latest_update)? b.latest_update : parseRelativeTime(b.latest_update);
                    return dateB - dateA;
                });
                break;
            case "update-oldest":
                filtered.sort((a, b) => {
                    const dateA = isValidDate(a.latest_update)? a.latest_update : parseRelativeTime(a.latest_update);
                    const dateB = isValidDate(b.latest_update)? b.latest_update : parseRelativeTime(b.latest_update);
                    return dateA - dateB;
                });
                break;
            case "chapters-asc":
                filtered.sort((a, b) => (a.chapter_count || 0) - (b.chapter_count || 0));
                break;
            case "chapters-desc":
                filtered.sort((a, b) => (b.chapter_count || 0) - (a.chapter_count || 0));
                break;
            case "last-read":
                filtered.sort((a, b) => {
                    const lastReadA = unObj[a.id]?.last_read ? new Date(unObj[a.id].last_read).getTime() : 0;
                    const lastReadB = unObj[b.id]?.last_read ? new Date(unObj[b.id].last_read).getTime() : 0;
                    return lastReadB - lastReadA; // descending order, most recent first
                });
                break;
            case "oldest-read":
                filtered.sort((a, b) => {
                    const lastReadA = unObj[a.id]?.last_read ? new Date(unObj[a.id].last_read).getTime() : 0;
                    const lastReadB = unObj[b.id]?.last_read ? new Date(unObj[b.id].last_read).getTime() : 0;
                    return lastReadA - lastReadB; // ascending order, oldest first
                });
                break;
            default:
                // Keep original order
                break;
        }

        return filtered;
    }, [novelList, searchTerm, statusFilter, sortOption, unObj]);


    // Initialize selected novels when dialog opens
    function handleDialogOpen() {
        const initialSelected = new Set(
            novelList
                .filter(novel => novel.status !== 'Completed')
                .map(novel => novel.formatted_name)
        );
        setSelectedNovels(initialSelected);
        setSearchTerm("");
        setStatusFilter("all");
        setSortOption("default");
        setIsDialogOpen(true);
    }

    function toggleNovel(formattedName) {
        setSelectedNovels(prev => {
            const newSet = new Set(prev);
            if (newSet.has(formattedName)) {
                newSet.delete(formattedName);
            } else {
                newSet.add(formattedName);
            }
            return newSet;
        });
    }

    function handleSelectByStatus(status) {
        const novelsWithStatus = novelList
            .filter(novel => novel.status === status)
            .map(novel => novel.formatted_name);

        setSelectedNovels(prev => {
            const newSet = new Set(prev);
            novelsWithStatus.forEach(name => newSet.add(name));
            return newSet;
        });
    }

    function handleUnselectByStatus(status) {
        const novelsWithStatus = new Set(
            novelList
                .filter(novel => novel.status === status)
                .map(novel => novel.formatted_name)
        );

        setSelectedNovels(prev => {
            const newSet = new Set(prev);
            novelsWithStatus.forEach(name => newSet.delete(name));
            return newSet;
        });
    }

    function handleSelectAll() {
        setSelectedNovels(new Set(novelList.map(novel => novel.formatted_name)));
    }

    function handleUnselectAll() {
        setSelectedNovels(new Set());
    }

    function handleSelectFiltered() {
        setSelectedNovels(prev => {
            const newSet = new Set(prev);
            filteredAndSortedNovels.forEach(novel => newSet.add(novel.formatted_name));
            return newSet;
        });
    }

    function handleUnselectFiltered() {
        const filteredNames = new Set(filteredAndSortedNovels.map(n => n.formatted_name));
        setSelectedNovels(prev => {
            const newSet = new Set(prev);
            filteredNames.forEach(name => newSet.delete(name));
            return newSet;
        });
    }

    function clearSearch() {
        setSearchTerm("");
    }


    async function handleSync() {
        setIsDialogOpen(false);
        setOverlayTrigger(true);
        try {
            await fetchAndUpdateNovels(Array.from(selectedNovels));
        } catch (error) {
            console.error("Error in fetching and updating novels:", error);
        } finally {
            setOverlayTrigger(false);
        }
    }


    async function fetchAndUpdateNovels(selectedFormattedNames) {
        try {
            const novelsToSync = novelList.filter(novel =>
                selectedFormattedNames.includes(novel.formatted_name)
            );

            // Scrape log
            // console.log(`Starting sync for ${novels.length} novels...`);

            // Process in batches of 5 to avoid overwhelming the server
            const BATCH_SIZE = 5;
            const results = [];

            for (let i = 0; i < novelsToSync.length; i += BATCH_SIZE) {
                const batch = novelsToSync.slice(i, i + BATCH_SIZE);

                // Scrape log
                // console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(novels.length / BATCH_SIZE)}...`);

                const batchResults = await Promise.all(
                    batch.map(novel => syncNovelData(novel.formatted_name, novel.source))
                );
                results.push(...batchResults);

                // Small delay between batches
                if (i + BATCH_SIZE < novelsToSync.length) {
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

                const databaseNovel = await fetchNovelByFormattedNameAndSource(formattedName, source);
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

                    // Scrape log
                    // console.log(`✓ ${formattedName} updated successfully`);
                    return { success: true, updated: true, name: formattedName };
                } else {
                    // Scrape log
                    // console.log(`✓ ${formattedName} is already up-to-date`);
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


    const statusColors = {
        'OnGoing': 'text-yellow-400',
        'Completed': 'text-emerald-400',
        'Hiatus': 'text-red-400'
    };


    return (
        <>
            <AnimatedIconButton label={"Refresh novels"} isActive={isDialogOpen} onClick={handleDialogOpen} animation={'svg-animate-rotate'} shape={'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99'} isDisabled={!isOnline} />
            <LoadingOverlay trigger={overlayTrigger}/>

            {isDialogOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
                    <div className="bg-navbar border border-gray-700 rounded-2xl p-6 shadow-2xl w-full max-w-4xl text-center animate-fadeIn max-h-[90vh] flex flex-col">
                        <h2 className="text-lg font-semibold text-secondary mb-3 select-none">Refresh novels</h2>
                        <p className="text-gray-400 mb-4 select-none">Select novels to refresh ({selectedNovels.size} selected)</p>

                        {/* Search Bar */}
                        <div className="relative mb-4">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search novels by name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-main_background border border-gray-700 rounded-lg text-secondary pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary caret-primary placeholder-gray-500 select-none"
                            />
                            {searchTerm && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 sm:hover:scale-105 transition-transform">
                                    <button
                                        onClick={clearSearch} className="p-1 rounded-lg bg-red-600 sm:hover:bg-red-700 border border-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 sm:size-5">
                                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"/>
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Filters Row */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="relative">
                                <label className="block text-sm font-semibold text-secondary mb-2 text-left select-none">Status</label>
                                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="appearance-none w-full px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary select-none">
                                    <option value="all">All Status</option>
                                    <option value="Completed">Completed</option>
                                    <option value="OnGoing">On Going</option>
                                    <option value="Hiatus">Hiatus</option>
                                </select>
                                <div className="pointer-events-none absolute bottom-2 right-3 text-secondary">
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 12a1 1 0 01-.7-.3l-4-4a1 1 0 111.4-1.4L10 9.6l3.3-3.3a1 1 0 011.4 1.4l-4 4a1 1 0 01-.7.3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-semibold text-secondary mb-2 text-left select-none">Sort By</label>
                                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="appearance-none w-full px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary select-none">
                                    <option value="default">Default</option>
                                    <option value="last-read">Last read</option>
                                    <option value="oldest-read">Oldest read</option>
                                    <option value="name-asc">Name (A-Z)</option>
                                    <option value="name-desc">Name (Z-A)</option>
                                    <option value="update-newest">Latest Update (Newest)</option>
                                    <option value="update-oldest">Latest Update (Oldest)</option>
                                    <option value="chapters-asc">Chapter Count (Low to High)</option>
                                    <option value="chapters-desc">Chapter Count (High to Low)</option>
                                </select>
                                <div className="pointer-events-none absolute bottom-2 right-3 text-secondary">
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 12a1 1 0 01-.7-.3l-4-4a1 1 0 111.4-1.4L10 9.6l3.3-3.3a1 1 0 011.4 1.4l-4 4a1 1 0 01-.7.3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Quick Selection Buttons small screen */}
                        <div className="mb-4 sm:hidden">
                            <div className="border border-gray-700 rounded-lg overflow-hidden">
                                <div className="overflow-x-auto px-2 py-2">
                                    <div className="flex gap-2 min-w-min">
                                        {/* All */}
                                        <button onClick={handleSelectAll} className="px-3 py-2 text-sm rounded-lg border-2 border-secondary bg-gray-700 sm:hover:bg-gray-600 text-secondary transition-all whitespace-nowrap">
                                            Select All
                                        </button>
                                        <button onClick={handleUnselectAll} className="px-3 py-2 text-sm rounded-lg border-2 border-secondary bg-gray-700 sm:hover:bg-gray-600 text-secondary transition-all whitespace-nowrap">
                                            Unselect All
                                        </button>

                                        {/* Filtered */}
                                        <div className="w-px bg-gray-600" />
                                        <button onClick={handleSelectFiltered} className="px-3 py-2 text-sm rounded-lg border-2 border-purple-400 bg-purple-900/30 sm:hover:bg-purple-900/50 text-purple-400 transition-all whitespace-nowrap">
                                            + Filtered
                                        </button>
                                        <button onClick={handleUnselectFiltered} className="px-3 py-2 text-sm rounded-lg border-2 border-purple-400 bg-purple-900/30 sm:hover:bg-purple-900/50 text-purple-400 transition-all whitespace-nowrap">
                                            - Filtered
                                        </button>

                                        {/* OnGoing */}
                                        <div className="w-px bg-gray-600" />
                                        <button onClick={() => handleSelectByStatus('OnGoing')} className="px-3 py-2 text-sm rounded-lg border-2 border-yellow-400 bg-yellow-900/30 sm:hover:bg-yellow-900/50 text-yellow-400 transition-all whitespace-nowrap">
                                            + OnGoing
                                        </button>
                                        <button onClick={() => handleUnselectByStatus('OnGoing')} className="px-3 py-2 text-sm rounded-lg border-2 border-yellow-400 bg-yellow-900/30 sm:hover:bg-yellow-900/50 text-yellow-400 transition-all whitespace-nowrap">
                                            - OnGoing
                                        </button>

                                        {/* Completed */}
                                        <div className="w-px bg-gray-600"></div>
                                        <button onClick={() => handleSelectByStatus('Completed')} className="px-3 py-2 text-sm rounded-lg border-2 border-green-400 bg-green-900/30 sm:hover:bg-green-900/50 text-green-400 transition-all whitespace-nowrap">
                                            + Completed
                                        </button>
                                        <button onClick={() => handleUnselectByStatus('Completed')} className="px-3 py-2 text-sm rounded-lg border-2 border-green-400 bg-green-900/30 sm:hover:bg-green-900/50 text-green-400 transition-all whitespace-nowrap">
                                            - Completed
                                        </button>

                                        {/* Hiatus */}
                                        <div className="w-px bg-gray-600"></div>
                                        <button onClick={() => handleSelectByStatus('Hiatus')} className="px-3 py-2 text-sm rounded-lg border-2 border-red-400 bg-red-900/30 sm:hover:bg-red-900/50 text-red-400 transition-all whitespace-nowrap">
                                            + Hiatus
                                        </button>
                                        <button onClick={() => handleUnselectByStatus('Hiatus')} className="px-3 py-2 text-sm rounded-lg border-2 border-red-400 bg-red-900/30 sm:hover:bg-red-900/50 text-red-400 transition-all whitespace-nowrap">
                                            - Hiatus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Quick Selection Buttons */}
                        <div className="hidden sm:flex flex-wrap justify-center gap-2 mb-4">
                            {/* All */}
                            <button onClick={handleSelectAll} className="px-3 py-2 text-sm rounded-lg border-2 border-secondary bg-gray-700 sm:hover:bg-gray-600 text-secondary transition-all whitespace-nowrap">
                                Select All
                            </button>
                            <button onClick={handleUnselectAll} className="px-3 py-2 text-sm rounded-lg border-2 border-secondary bg-gray-700 sm:hover:bg-gray-600 text-secondary transition-all whitespace-nowrap">
                                Unselect All
                            </button>

                            {/* Filtered */}
                            <div className="w-px bg-gray-600" />
                            <button onClick={handleSelectFiltered} className="px-3 py-2 text-sm rounded-lg border-2 border-purple-400 bg-purple-900/30 sm:hover:bg-purple-900/50 text-purple-400 transition-all whitespace-nowrap">
                                + Filtered
                            </button>
                            <button onClick={handleUnselectFiltered} className="px-3 py-2 text-sm rounded-lg border-2 border-purple-400 bg-purple-900/30 sm:hover:bg-purple-900/50 text-purple-400 transition-all whitespace-nowrap">
                                - Filtered
                            </button>

                            {/* OnGoing */}
                            <div className="w-px bg-gray-600" />
                            <button onClick={() => handleSelectByStatus('OnGoing')} className="px-3 py-2 text-sm rounded-lg border-2 border-yellow-400 bg-yellow-900/30 sm:hover:bg-yellow-900/50 text-yellow-400 transition-all whitespace-nowrap">
                                + OnGoing
                            </button>
                            <button onClick={() => handleUnselectByStatus('OnGoing')} className="px-3 py-2 text-sm rounded-lg border-2 border-yellow-400 bg-yellow-900/30 sm:hover:bg-yellow-900/50 text-yellow-400 transition-all whitespace-nowrap">
                                - OnGoing
                            </button>

                            {/* Completed */}
                            <div className="w-px bg-gray-600 xl:hidden"></div>
                            <button onClick={() => handleSelectByStatus('Completed')} className="px-3 py-2 text-sm rounded-lg border-2 border-green-400 bg-green-900/30 sm:hover:bg-green-900/50 text-green-400 transition-all whitespace-nowrap">
                                + Completed
                            </button>
                            <button onClick={() => handleUnselectByStatus('Completed')} className="px-3 py-2 text-sm rounded-lg border-2 border-green-400 bg-green-900/30 sm:hover:bg-green-900/50 text-green-400 transition-all whitespace-nowrap">
                                - Completed
                            </button>

                            {/* Hiatus */}
                            <div className="w-px bg-gray-600"></div>
                            <button onClick={() => handleSelectByStatus('Hiatus')} className="px-3 py-2 text-sm rounded-lg border-2 border-red-400 bg-red-900/30 sm:hover:bg-red-900/50 text-red-400 transition-all whitespace-nowrap">
                                + Hiatus
                            </button>
                            <button onClick={() => handleUnselectByStatus('Hiatus')} className="px-3 py-2 text-sm rounded-lg border-2 border-red-400 bg-red-900/30 sm:hover:bg-red-900/50 text-red-400 transition-all whitespace-nowrap">
                                - Hiatus
                            </button>
                        </div>

                        {/* Novel List */}
                        <div className="overflow-y-auto flex-1 mb-4 border border-gray-700 rounded-lg">
                            {filteredAndSortedNovels.length === 0 ? (
                                <div className="p-8 text-gray-400 text-center">No novels found</div>
                            ) : (
                                filteredAndSortedNovels.map((novel) => (
                                    <div
                                        key={novel.formatted_name}
                                        onClick={() => toggleNovel(novel.formatted_name)}
                                        className="flex items-center gap-3 p-3 sm:hover:bg-gray-800/50 cursor-pointer border-b border-gray-700/50 last:border-b-0 transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedNovels.has(novel.formatted_name)}
                                            onChange={() => {}}
                                            className="w-4 h-4 rounded accent-green-600 cursor-pointer"
                                        />
                                        <div className="flex-1 text-left">
                                            <div className="text-white font-medium line-clamp-1 overflow-hidden">{unObj[novel.id]?.name_alternative ?? novel.name}</div>
                                            <div className="text-sm text-gray-400 flex items-center gap-2">
                                                <span className={statusColors[novel.status]}>
                                                    {novel.status}
                                                </span>
                                                <span className={"select-none"}>•</span>
                                                <span>{novel.latest_update}</span>
                                                <span className={"select-none"}>•</span>
                                                <span>{novel.chapter_count} Chapters</span>
                                                {unObj[novel.id].last_read ? (
                                                    <>
                                                        <span className={"select-none"}>•</span>
                                                        <span>Last read {dateFormatter(unObj[novel.id].last_read)}</span>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between gap-3">
                            <button onClick={() => setIsDialogOpen(false)} className="px-4 py-2 rounded-lg">
                                Cancel
                            </button>
                            <button
                                onClick={handleSync}
                                disabled={selectedNovels.size === 0}
                                className="px-4 py-2 rounded-lg bg-green-700 sm:hover:bg-green-800 border-green-800 text-white font-medium transition-all disabled:opacity-50"
                            >
                                Refresh {selectedNovels.size > 0 ? `(${selectedNovels.size})` : ''}
                            </button>
                        </div>
                    </div>
                </div>
            ): null
            }
        </>
    );
}


export default SyncNovelsButton;