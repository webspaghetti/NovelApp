"use client"
import { signOut } from "next-auth/react";
import { dateFormatter } from "@/app/helper-functions/dateFormatter";
import React, { useState, useMemo, useEffect } from 'react';
import NavBar from "@/components/general/layout/NavBar";
import BodyStyler from "@/components/general/BodyStyler";
import AlertDialog from "@/components/general/AlertDialog";
import NovelProfileCard from "@/components/profile/NovelProfileCard";

function ProfilePageClient({ userNovels, novels, templateList, session, inter, createdAt, userObject }) {
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const { normal_general_template_id: normalTemplateId, small_general_template_id: smallTemplateId } = userObject[0] || {};

    const normalTemplate = templateList.find(t => t.id === normalTemplateId);
    const smallTemplate = templateList.find(t => t.id === smallTemplateId);

    // Memoize the parsed templates
    const normalTemplateData = useMemo(() =>
            JSON.parse(normalTemplate.customization),
        [normalTemplate]
    );

    const smallTemplateData = useMemo(() =>
            JSON.parse(smallTemplate.customization),
        [smallTemplate]
    );

    const [isSmallScreen, setIsSmallScreen] = useState(false);

    const customizationTemplate = isSmallScreen ? smallTemplateData : normalTemplateData;

    // Screen size detection
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 640px)");
        setIsSmallScreen(mediaQuery.matches);

        function handleChange(e) {
            setIsSmallScreen(e.matches);
        }

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const adjustedTemplateList = templateList.map(template => {
        let newName = template.name;

        // Replace specific names
        if (newName === 'normal-default-reader') {
            newName = 'Normal Default Reader';
        } else if (newName === 'small-default-reader') {
            newName = 'Small Default Reader';
        }

        return { ...template, name: newName };
    });


    // Parse read_chapters if it's a string
    function parseReadChapters(chapters) {
        if (Array.isArray(chapters)) return chapters;
        if (typeof chapters === 'string') {
            try {
                return JSON.parse(chapters);
            } catch {
                return [];
            }
        }
        return [];
    }

    // Calculate most used normal template
    const mostUsedNormalTemplate = useMemo(() => {
        if (!userNovels || !adjustedTemplateList) return null;

        const templateCounts = {};
        userNovels.forEach(un => {
            if (un.normal_template_id) {
                templateCounts[un.normal_template_id] = (templateCounts[un.normal_template_id] || 0) + 1;
            }
        });

        const mostUsedId = Object.entries(templateCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

        return adjustedTemplateList.find(t => t.id === parseInt(mostUsedId));
    }, [userNovels, adjustedTemplateList]);

    let normalTemplatePreview = {};

    try {
        if (mostUsedNormalTemplate?.customization) {
            normalTemplatePreview = JSON.parse(mostUsedNormalTemplate.customization);
        }
    } catch {
        normalTemplatePreview = {};
    }

    // Calculate most used small template
    const mostUsedSmallTemplate = useMemo(() => {
        if (!userNovels || !adjustedTemplateList) return null;

        const templateCounts = {};
        userNovels.forEach(un => {
            if (un.small_template_id) {
                templateCounts[un.small_template_id] = (templateCounts[un.small_template_id] || 0) + 1;
            }
        });

        const mostUsedId = Object.entries(templateCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
        return adjustedTemplateList.find(t => t.id === parseInt(mostUsedId));
    }, [userNovels, adjustedTemplateList]);

    let smallTemplatePreview = {};

    try {
        if (mostUsedSmallTemplate?.customization) {
            smallTemplatePreview = JSON.parse(mostUsedSmallTemplate.customization);
        }
    } catch {
        smallTemplatePreview = {};
    }

    // Find last read novel with userNovel data
    const lastReadNovelData = useMemo(() => {
        if (!novels || !userNovels) return null;

        // Filter userNovels that have been read (last_read is not null)
        const readUserNovels = userNovels.filter(un => un.last_read !== null);

        if (readUserNovels.length === 0) return null;

        return readUserNovels.reduce((latest, userNovel) => {
            const novel = novels.find(n => n.id === userNovel.novel_id);
            if (!novel) return latest;

            if (!latest || new Date(userNovel.last_read) > new Date(latest.userNovel.last_read)) {
                return { novel, userNovel };
            }
            return latest;
        }, null);
    }, [novels, userNovels]);

    // Find latest added novel with userNovel data
    const latestAddedNovelData = useMemo(() => {
        if (!novels || !userNovels) return null;
        return novels.reduce((latest, novel) => {
            const userNovel = userNovels.find(un => un.novel_id === novel.id);
            if (!userNovel) return latest;

            if (!latest || novel.id > latest.novel.id) {
                return { novel, userNovel };
            }
            return latest;
        }, null);
    }, [novels, userNovels]);

    // Find most read novel with userNovel data
    const mostReadNovelData = useMemo(() => {
        if (!userNovels || !novels) return null;

        const novelWithCounts = userNovels.map(un => {
            const novel = novels.find(n => n.id === un.novel_id);
            const readCount = parseReadChapters(un.read_chapters).length;
            return { novel, readCount, userNovel: un };
        }).filter(item => item.novel);

        const mostRead = novelWithCounts.reduce((max, item) => {
            if (!max || item.readCount > max.readCount) {
                return item;
            }
            return max;
        }, null);

        return mostRead ? { novel: mostRead.novel, userNovel: mostRead.userNovel, readCount: mostRead.readCount } : null;
    }, [userNovels, novels]);

    const totalNovels = novels?.length || 0;
    const totalChaptersRead = useMemo(() => {
        if (!userNovels) return 0;
        return userNovels.reduce((total, un) => {
            return total + parseReadChapters(un.read_chapters).length;
        }, 0);
    }, [userNovels]);

    const handleLogout = () => {
        signOut({ callbackUrl: "/" });
    };


    return (
        <>
            <BodyStyler customizationTemplate={customizationTemplate} />
            <NavBar customizationTemplate={customizationTemplate} />
            <main className="pt-24 max-w-7xl mx-auto px-4 pb-12">
                {/* Profile Header */}
                <div className="bg-gradient-to-b from-main_background to-[#070707] rounded-3xl p-8 mb-8 border border-gray-800 shadow-2xl">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                                <div className="relative rounded-full size-32 bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center border-4 border-gray-800 shadow-xl">
                                    <span className="text-5xl font-bold text-white select-none">
                                        {session?.user?.username?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-center sm:text-left">
                                <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                    {session?.user?.username || 'User'}
                                </h1>
                                <div className="flex flex-col sm:flex-row gap-4 text-gray-400 mb-3">
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                            <path d="M12 7v14"/>
                                            <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>
                                        </svg>
                                        <span className="font-semibold">{totalNovels}</span> Novels
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                                            <polyline points="14 2 14 8 20 8"/>
                                        </svg>
                                        <span className="font-semibold">{totalChaptersRead}</span> Chapters Read
                                    </div>
                                </div>
                                <p className={"text-xs text-gray-400"}>Account created: {dateFormatter(createdAt[0].created_at)}</p>
                            </div>
                        </div>
                        <button
                            className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 border-red-800 text-secondary font-medium"
                            onClick={() => setShowLogoutConfirm(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                <polyline points="16 17 21 12 16 7"/>
                                <line x1="21" x2="9" y1="12" y2="12"/>
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>

                {/* Template Stats */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-6 flex text-secondary items-center gap-3 select-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                        Favorite Templates
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-b from-main_background to-[#070707] rounded-2xl p-6 border border-gray-800 hover:border-primary/50 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Most Used Normal Template</h3>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                    <rect width="18" height="18" x="3" y="3" rx="2"/>
                                    <path d="M7 7h10"/>
                                    <path d="M7 12h10"/>
                                    <path d="M7 17h10"/>
                                </svg>
                            </div>

                            <p className="text-2xl font-bold text-primary">
                                {mostUsedNormalTemplate?.name || 'No template used yet'}
                            </p>

                            {(Object.keys(normalTemplatePreview).length > 0) ?
                                (
                                    <div className="mt-4 p-3 sm:p-4 border border-gray-700 rounded-lg overflow-x-auto" style={{
                                        backgroundColor: normalTemplatePreview.background.color,
                                        backgroundImage: normalTemplatePreview.background.image !== 'none' ? `url(${normalTemplatePreview.background.image})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}>
                                        <div>
                                            <h3 className={`text_outline ${normalTemplatePreview.title.outline}`} style={{
                                                '--shadow-color': normalTemplatePreview.title.outline_color,
                                                fontFamily: normalTemplatePreview.title.family === 'Inter' ? inter.style.fontFamily : normalTemplatePreview.title.family,
                                                fontSize: normalTemplatePreview.title.size,
                                                fontWeight: normalTemplatePreview.title.weight,
                                                color: normalTemplatePreview.chapter_title_color,
                                                borderBottom: `${normalTemplatePreview.text.separator_width} solid ${normalTemplatePreview.text.separator_color}`,
                                                lineHeight: normalTemplatePreview.title_spacing.line_height,
                                                wordSpacing: normalTemplatePreview.title_spacing.word_spacing,
                                                letterSpacing: normalTemplatePreview.title_spacing.letter_spacing
                                            }}>
                                                Chapter 42: The Adventure Begins
                                            </h3>
                                            <div className={`text_outline ${normalTemplatePreview.text.outline}`} style={{
                                                '--shadow-color': normalTemplatePreview.text.outline_color,
                                                fontFamily: normalTemplatePreview.text.family === 'Inter' ? inter.style.fontFamily : normalTemplatePreview.text.family,
                                                fontSize: normalTemplatePreview.text.size,
                                                fontWeight: normalTemplatePreview.text.weight,
                                                color: normalTemplatePreview.chapter_content_color,
                                            }}>
                                                <p style={{
                                                    margin: `${normalTemplatePreview.text_spacing.block_spacing} 0`,
                                                    lineHeight: normalTemplatePreview.text_spacing.line_height,
                                                    wordSpacing: normalTemplatePreview.text_spacing.word_spacing,
                                                    letterSpacing: normalTemplatePreview.text_spacing.letter_spacing
                                                }}>
                                                    This is the first paragraph. Notice the spacing between lines, words, and letters.
                                                </p>
                                                <p style={{
                                                    marginTop: normalTemplatePreview.text_spacing.block_spacing,
                                                    lineHeight: normalTemplatePreview.text_spacing.line_height,
                                                    wordSpacing: normalTemplatePreview.text_spacing.word_spacing,
                                                    letterSpacing: normalTemplatePreview.text_spacing.letter_spacing
                                                }}>
                                                    This is the second paragraph. The block spacing controls the gap between these paragraphs.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : null
                            }
                        </div>

                        <div className="bg-gradient-to-b from-main_background to-[#070707] rounded-2xl p-6 border border-gray-800 hover:border-primary/50 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Most Used Small Template</h3>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                    <rect width="14" height="14" x="5" y="5" rx="2"/>
                                    <path d="M9 9h6"/>
                                    <path d="M9 13h6"/>
                                </svg>
                            </div>

                            <p className="text-2xl font-bold text-primary">
                                {mostUsedSmallTemplate?.name || 'No template used yet'}
                            </p>

                            {(Object.keys(normalTemplatePreview).length > 0) ?
                                (
                                    <div className="mt-4 p-3 sm:p-4 border border-gray-700 rounded-lg overflow-x-auto" style={{
                                        backgroundColor: smallTemplatePreview.background.color,
                                        backgroundImage: smallTemplatePreview.background.image !== 'none' ? `url(${smallTemplatePreview.background.image})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}>
                                        <div>
                                            <h3 className={`text_outline ${smallTemplatePreview.title.outline}`} style={{
                                                '--shadow-color': smallTemplatePreview.title.outline_color,
                                                fontFamily: smallTemplatePreview.title.family === 'Inter' ? inter.style.fontFamily : smallTemplatePreview.title.family,
                                                fontSize: smallTemplatePreview.title.size,
                                                fontWeight: smallTemplatePreview.title.weight,
                                                color: smallTemplatePreview.chapter_title_color,
                                                borderBottom: `${smallTemplatePreview.text.separator_width} solid ${smallTemplatePreview.text.separator_color}`,
                                                lineHeight: smallTemplatePreview.title_spacing.line_height,
                                                wordSpacing: smallTemplatePreview.title_spacing.word_spacing,
                                                letterSpacing: smallTemplatePreview.title_spacing.letter_spacing
                                            }}>
                                                Chapter 42: The Adventure Begins
                                            </h3>
                                            <div className={`text_outline ${smallTemplatePreview.text.outline}`} style={{
                                                '--shadow-color': smallTemplatePreview.text.outline_color,
                                                fontFamily: smallTemplatePreview.text.family === 'Inter' ? inter.style.fontFamily : smallTemplatePreview.text.family,
                                                fontSize: smallTemplatePreview.text.size,
                                                fontWeight: smallTemplatePreview.text.weight,
                                                color: smallTemplatePreview.chapter_content_color,
                                            }}>
                                                <p style={{
                                                    margin: `${smallTemplatePreview.text_spacing.block_spacing} 0`,
                                                    lineHeight: smallTemplatePreview.text_spacing.line_height,
                                                    wordSpacing: smallTemplatePreview.text_spacing.word_spacing,
                                                    letterSpacing: smallTemplatePreview.text_spacing.letter_spacing
                                                }}>
                                                    This is the first paragraph. Notice the spacing between lines, words, and letters.
                                                </p>
                                                <p style={{
                                                    marginTop: smallTemplatePreview.text_spacing.block_spacing,
                                                    lineHeight: smallTemplatePreview.text_spacing.line_height,
                                                    wordSpacing: smallTemplatePreview.text_spacing.word_spacing,
                                                    letterSpacing: smallTemplatePreview.text_spacing.letter_spacing
                                                }}>
                                                    This is the second paragraph. The block spacing controls the gap between these paragraphs.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                        </div>
                    </div>
                </div>

                {/* Novel Stats */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-secondary mb-6 flex items-center gap-3 select-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                            <path d="M3 3v18h18"/>
                            <path d="m19 9-5 5-4-4-3 3"/>
                        </svg>
                        Reading Activity
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <NovelProfileCard
                            novelData={mostReadNovelData}
                            showCaseData={`- ${mostReadNovelData.readCount} Chapters`}
                            title="Most Read"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                    <path d="M12 7v14"/>
                                    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>
                                </svg>
                            }
                            parseReadChapters={parseReadChapters}
                        />

                        <NovelProfileCard
                            novelData={lastReadNovelData}
                            title="Last Read"
                            showCaseData={`- ${dateFormatter(lastReadNovelData.userNovel.last_read)}`}
                            subtitle={lastReadNovelData?.novel?.last_read ? new Date(lastReadNovelData.novel.last_read).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                    <circle cx="12" cy="12" r="10"/>
                                    <polyline points="12 6 12 12 16 14"/>
                                </svg>
                            }
                            parseReadChapters={parseReadChapters}
                        />

                        <NovelProfileCard
                            novelData={latestAddedNovelData}
                            title="Latest Added"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                    <path d="M12 5v14"/>
                                    <path d="M5 12h14"/>
                                </svg>
                            }
                            parseReadChapters={parseReadChapters}
                        />
                    </div>
                </div>

                <AlertDialog
                    isOpen={showLogoutConfirm}
                    title="Confirm Logout"
                    message="Are you sure you want to logout?"
                    confirmText="Logout"
                    cancelText="Cancel"
                    onConfirm={handleLogout}
                    onCancel={() => setShowLogoutConfirm(false)}
                />
            </main>
        </>
    );
}

export default ProfilePageClient;