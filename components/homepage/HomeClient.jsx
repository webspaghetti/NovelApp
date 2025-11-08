"use client"
import { useState, useMemo } from 'react';
import { parseRelativeTime } from "@/app/helper-functions/parseRelativeTime";
import { isValidDate } from "@/app/helper-functions/isValidDate";
import NovelList from "@/components/homepage/NovelList";
import AddNovelButton from "@/components/homepage/AddNovelButton";
import SyncNovelsButton from "@/components/homepage/SyncNovelsButton";
import NovelSearchFilter from "@/components/homepage/NovelSearchFilter";
import AnimatedIconButton from "@/components/general/AnimatedIconButton";


function HomeClient({ novelList, userNovel, session }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortOption, setSortOption] = useState('default');
    const [sfVisible, setSfVisible] = useState(false)


    const unObj = useMemo(() => {
        return userNovel.reduce((acc, item) => {
            acc[item.novel_id] = item;
            return acc;
        }, {});
    }, [userNovel]);

    const filteredAndSortedNovels = useMemo(() => {
        let filtered = [...novelList];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(novel => {
                const userNovelData = unObj[novel.id];
                const nameToSearch = userNovelData?.name_alternative || novel.name;
                return nameToSearch.toLowerCase().includes(searchTerm.toLowerCase());
            });
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(novel => novel.status === statusFilter);
        }

        // Apply sorting
        switch (sortOption) {
            case 'last-read':
                filtered.sort((a, b) => {
                    const lastReadA = unObj[a.id]?.last_read ? new Date(unObj[a.id].last_read).getTime() : 0;
                    const lastReadB = unObj[b.id]?.last_read ? new Date(unObj[b.id].last_read).getTime() : 0;
                    return lastReadB - lastReadA; // descending order, most recent first
                });
                break;
            case 'oldest-read':
                filtered.sort((a, b) => {
                    const lastReadA = unObj[a.id]?.last_read ? new Date(unObj[a.id].last_read).getTime() : 0;
                    const lastReadB = unObj[b.id]?.last_read ? new Date(unObj[b.id].last_read).getTime() : 0;
                    return lastReadA - lastReadB; // descending order, most recent first
                });
                break;
            case 'name-asc':
                filtered.sort((a, b) => {
                    const nameA = unObj[a.id]?.name_alternative || a.name;
                    const nameB = unObj[b.id]?.name_alternative || b.name;
                    return nameA.localeCompare(nameB);
                });
                break;
            case 'name-desc':
                filtered.sort((a, b) => {
                    const nameA = unObj[a.id]?.name_alternative || a.name;
                    const nameB = unObj[b.id]?.name_alternative || b.name;
                    return nameB.localeCompare(nameA);
                });
                break;
            case 'progress-asc':
                filtered.sort((a, b) => {
                    const progressA = (unObj[a.id]?.current_chapter || 0) / a.chapter_count * 100;
                    const progressB = (unObj[b.id]?.current_chapter || 0) / b.chapter_count * 100;
                    return progressA - progressB;
                });
                break;
            case 'progress-desc':
                filtered.sort((a, b) => {
                    const progressA = (unObj[a.id]?.current_chapter || 0) / a.chapter_count * 100;
                    const progressB = (unObj[b.id]?.current_chapter || 0) / b.chapter_count * 100;
                    return progressB - progressA;
                });
                break;
            case 'update-newest':
                filtered.sort((a, b) => {
                    const dateA = isValidDate(a.latest_update) ? a.latest_update : parseRelativeTime(a.latest_update);
                    const dateB = isValidDate(b.latest_update) ? b.latest_update : parseRelativeTime(b.latest_update);
                    return dateB - dateA;
                });
                break;

            case 'update-oldest':
                filtered.sort((a, b) => {
                    const dateA = isValidDate(a.latest_update) ? a.latest_update : parseRelativeTime(a.latest_update);
                    const dateB = isValidDate(b.latest_update) ? b.latest_update : parseRelativeTime(b.latest_update);
                    return dateA - dateB;
                });
                break;
            case 'chapters-asc':
                filtered.sort((a, b) => a.chapter_count - b.chapter_count);
                break;
            case 'chapters-desc':
                filtered.sort((a, b) => b.chapter_count - a.chapter_count);
                break;
            default:
                // Keep original order
                break;
        }

        return filtered;
    }, [novelList, searchTerm, statusFilter, sortOption, unObj]);


    return (
        <main>
            <div className={"flex justify-between w-full mb-5 relative top-[76px] max-sm:top-[70px]"}>
                <AddNovelButton session={session} isOnline={isOnline} />
                <AnimatedIconButton label={'Search filter'} isActive={sfVisible} onClick={() => setSfVisible(!sfVisible)} animation={'svg-animate-scale'} shape={'M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75'} isDisabled={false} />
                <SyncNovelsButton novelList={novelList} userNovel={userNovel} isOnline={isOnline} />
            </div>
            <div hidden={!sfVisible}>
                <NovelSearchFilter
                    onSearchChange={setSearchTerm}
                    onStatusFilter={setStatusFilter}
                    onSortChange={setSortOption}
                    currentStatus={statusFilter}
                    currentSort={sortOption}
                />
            </div>

            <div className="w-full h-[4px] bg-gradient-to-r from-primary via-secondary to-primary relative top-[76px] max-sm:top-[70px] mb-8 max-sm:mb-4 rounded-full" />

            <div className={'max-md:flex max-md:justify-center'}>
                <div className={"grid grid-cols-2 md:grid-cols-3 max-sm:gap-4 gap-5 md:gap-10 relative top-20 max-sm:pb-3 pb-9"}>
                    {filteredAndSortedNovels.length > 0 ? (
                        <NovelList novelList={filteredAndSortedNovels} initialUserNovel={unObj} session={session} />
                    ) : (
                        <div className="col-span-full text-center max-sm:text-base text-lg text-gray-400 py-10">
                            No novels found matching your filters.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}


export default HomeClient;