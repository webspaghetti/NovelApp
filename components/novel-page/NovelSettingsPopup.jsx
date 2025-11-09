import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Inter } from "next/font/google";
import CircularProgress from "@mui/material/CircularProgress";
import AlertDialog from "@/components/general/AlertDialog";


const inter = Inter({ subsets: ["latin"] });


function NovelSettingsPopup({ trigger, setTrigger, novel, userNovel, userTemplateList, downloadControls, setDownloadControls }) {
    const router = useRouter();

    const originalName = novel.name;
    const originalUrl = novel.image_url;
    const originalNormalTemplate = userNovel.normal_template_id;
    const originalSmallTemplate = userNovel.small_template_id;

    const adjustedTemplateList = userTemplateList.map(template => {
        let newName = template.name;

        // Replace specific names
        if (newName === 'normal-default-reader') {
            newName = 'Normal Default Reader';
        } else if (newName === 'small-default-reader') {
            newName = 'Small Default Reader';
        }

        return { ...template, name: newName };
    });


    // Form states
    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [normalUserTemplate, setNormalUserTemplate] = useState(originalNormalTemplate);
    const [smallUserTemplate, setSmallUserTemplate] = useState(originalSmallTemplate);

    // UI states
    const [isLoading, setIsLoading] = useState(false);
    const [shake, setShake] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Preview states
    const [isSmallScreen, setIsSmallScreen] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia("(max-width: 640px)").matches;
        }
        return false; // Default value for SSR
    });
    const [previewDevice, setPreviewDevice] = useState(isSmallScreen ? 'small' : 'normal');
    const [previewSettings, setPreviewSettings] = useState(() => {
        const smallDefaultObject = adjustedTemplateList.find(t => t.id === originalSmallTemplate);
        const normalDefaultObject = adjustedTemplateList.find(t => t.id === originalNormalTemplate);
        return isSmallScreen
            ? JSON.parse(smallDefaultObject.customization)
            : JSON.parse(normalDefaultObject.customization);
    });


    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 640px)");
        setIsSmallScreen(mediaQuery.matches);
    }, []);

    useEffect(() => {
        if (!novel) return;

        if (userNovel.name_alternative){
            setName(userNovel.name_alternative);
        } else setName(originalName)

        if (userNovel.image_url_alternative) {
            setImageUrl(userNovel.image_url_alternative);
        } else setImageUrl(originalUrl);

    }, [novel]);

    useEffect(() => {
        const templateId = previewDevice === 'normal' ? normalUserTemplate : smallUserTemplate;
        const template = userTemplateList.find(t => t.id === templateId);
        if (template) {
            setPreviewSettings(JSON.parse(template.customization));
        }
    }, [previewDevice, normalUserTemplate, smallUserTemplate, userTemplateList]);

    // Input handlers
    function handleNameChange(event) {
        setName(event.target.value);
    }

    function handleImageChange(event) {
        setImageUrl(event.target.value);
    }

    // Template handlers
    function handleNormalTemplateChange(e) {
        const templateId = Number(e.target.value);

        const newTemplate = adjustedTemplateList.find(t => t.id === templateId);

        if (newTemplate?.customization) {
            setNormalUserTemplate(templateId);
        }
    }

    function handleSmallTemplateChange(e) {
        const templateId = Number(e.target.value);

        const newTemplate = adjustedTemplateList.find(t => t.id === templateId);

        if (newTemplate?.customization) {
            setSmallUserTemplate(templateId);
        }
    }

    function handleDownloadButton() {
        setDownloadControls(!downloadControls);
        setTrigger(false);
    }

    // Restore handler
    async function handleRestore(field){
        switch (field){
            case "name":
                setName(originalName);
                break;
            case "image_url":
                setImageUrl(originalUrl)
                break;
            case "normal-template":
                setNormalUserTemplate(originalNormalTemplate)
                break;
            case "small-template":
                setSmallUserTemplate(originalSmallTemplate)
                break;
        }
    }

    // Dialog handler
    function handleClosing() {
        setName(userNovel.name_alternative ?? originalName);
        setImageUrl(userNovel.image_url_alternative ?? originalUrl);

        setNormalUserTemplate(originalNormalTemplate);
        setSmallUserTemplate(originalSmallTemplate);

        setPreviewDevice(isSmallScreen ? 'small' : 'normal')

        setIsDialogOpen(false);
        setTrigger(false);
    }

    // Form submission handlers
    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);

        let nameToSend;
        let imageUrlToSend;

        let hasChanges = false;

        // Handle name logic
        if (userNovel.name_alternative) {
            // Alternative exists
            if (name === originalName) {
                // User wants to revert to original - remove alternative
                nameToSend = null;
                hasChanges = true;
            } else if (userNovel.name_alternative !== name) {
                // User changed to a different alternative
                nameToSend = name;
                hasChanges = true;
            } else {
                // No change - keep existing alternative
                nameToSend = userNovel.name_alternative;
            }
        } else {
            // No alternative exists
            if (name !== originalName) {
                // User wants to set a new alternative
                nameToSend = name;
                hasChanges = true;
            } else {
                // No change - keep it null
                nameToSend = null;
            }
        }

        // Handle image URL logic
        if (userNovel.image_url_alternative) {
            // Alternative exists
            if (imageUrl === originalUrl) {
                // User wants to revert to original - remove alternative
                imageUrlToSend = null;
                hasChanges = true;
            } else if (userNovel.image_url_alternative !== imageUrl) {
                // User changed to a different alternative
                imageUrlToSend = imageUrl;
                hasChanges = true;
            } else {
                // No change - keep existing alternative
                imageUrlToSend = userNovel.image_url_alternative;
            }
        } else {
            // No alternative exists
            if (imageUrl !== originalUrl) {
                // User wants to set a new alternative
                imageUrlToSend = imageUrl;
                hasChanges = true;
            } else {
                // No change - keep it null
                imageUrlToSend = null;
            }
        }

        if (nameToSend === ''){
            nameToSend = null;
        } else if (imageUrlToSend === ''){
            imageUrlToSend = null;
        }

        if (!hasChanges && (normalUserTemplate === originalNormalTemplate && smallUserTemplate === originalSmallTemplate)) {
            setIsLoading(false);
            setTrigger(false);
            return;
        }


        try {
            const updateResponse = await fetch('/api/user_novel/settings-update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userNovel.user_id,
                    novelId: userNovel.novel_id,
                    nameAlternative: nameToSend,
                    imageUrlAlternative: imageUrlToSend,
                    normalTemplateId: normalUserTemplate,
                    smallTemplateId: smallUserTemplate
                }),
            });

            if (!updateResponse.ok) {
                throw new Error('Failed to update novel data');
            }

            setTrigger(false);
        } catch (error) {
            console.error("Error updating novel:", error.message);
            triggerShake();
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                location.reload();
            }, 0);
        }
    }

    async function handleRemove() {
        setIsLoading(true);

        try {
            const response = await fetch('/api/remove-novel', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userNovel.user_id,
                    novelId: userNovel.novel_id,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove novel');
            }

            setTrigger(false);
        } catch (error) {
            console.error("Error removing novel:", error.message);
        } finally {
            setIsLoading(false);
            setIsDialogOpen(false);
            await router.push('/');
            router.refresh();
        }
    }

    function triggerShake() {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    }

    return (trigger) ? (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 backdrop-blur-sm z-30 p-4">
            <div className={`relative w-full max-w-3xl bg-gradient-to-b from-main_background to-[#070707] border border-gray-700 rounded-2xl shadow-cardB max-h-[90vh] flex flex-col transition-all duration-300 ${shake ? 'animate-shake' : ''}`}>
                {/* Fixed Header */}
                <div className="p-4 sm:p-6 pb-3 sm:pb-4 flex-shrink-0">
                    <h2 className="text-xl sm:text-2xl font-semibold text-secondary text-center select-none">
                        Novel Settings
                    </h2>
                </div>

                {/* Scrollable Content Area */}
                <div className={`overflow-y-auto flex-1 min-h-0 px-4 sm:px-6 ${isLoading ? 'pointer-events-none opacity-60' : ''}`} aria-disabled={isLoading}>
                    {/* Name input */}
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-semibold mb-2 select-none" htmlFor="name">
                            Name
                        </label>
                        <div className="flex flex-row gap-2 sm:gap-3">
                            <input
                                className="w-full bg-navbar border border-gray-700 rounded-lg text-secondary py-2 px-3 focus:outline-none focus:border-secondary caret-primary placeholder-gray-500 disabled:opacity-60 text-sm sm:text-base"
                                id="name"
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                placeholder="Enter novel name"
                                disabled={isLoading}
                            />
                            <button
                                className="flex-shrink-0"
                                onClick={() => handleRestore("name")}
                                aria-label="Restore original name"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-counterclockwise sm:w-6 sm:h-6" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Image URL input */}
                    <div className="mb-4">
                        <label className="block select-none text-gray-300 text-sm font-semibold mb-2" htmlFor="image">
                            Image URL
                        </label>
                        <div className="flex flex-row gap-2 sm:gap-3">
                            <input
                                className="w-full bg-navbar border border-gray-700 rounded-lg text-secondary py-2 px-3 focus:outline-none focus:border-secondary caret-primary placeholder-gray-500 disabled:opacity-60 text-sm sm:text-base"
                                id="image"
                                type="text"
                                value={imageUrl}
                                onChange={handleImageChange}
                                placeholder="Enter image URL"
                                disabled={isLoading}
                            />
                            <button
                                className="flex-shrink-0"
                                onClick={() => handleRestore("image_url")}
                                aria-label="Restore original image URL"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-counterclockwise sm:w-6 sm:h-6" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Template Selects */}
                    <div className="mb-4 space-y-6 select-none">
                        <div>
                            <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="normalTemplate">
                                Normal Device Template
                            </label>
                            <div className="flex flex-row gap-2 sm:gap-3">
                                <select
                                    id="normalTemplate"
                                    className="w-full select-none bg-navbar border border-gray-700 rounded-lg text-secondary py-2 px-3 focus:outline-none focus:border-secondary disabled:opacity-60 text-sm sm:text-base"
                                    value={normalUserTemplate}
                                    onChange={handleNormalTemplateChange}
                                    disabled={isLoading}
                                >
                                    {adjustedTemplateList.map(template => (
                                        <option key={template.id} value={template.id}>
                                            {template.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    className="flex-shrink-0"
                                    onClick={() => handleRestore("normal-template")}
                                    aria-label="Restore normal template"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-counterclockwise sm:w-6 sm:h-6" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                        <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="smallTemplate">
                                Small Device Template
                            </label>
                            <div className="flex flex-row gap-2 sm:gap-3">
                                <select
                                    id="smallTemplate"
                                    className="w-full select-none bg-navbar border border-gray-700 rounded-lg text-secondary py-2 px-3 focus:outline-none focus:border-secondary disabled:opacity-60 text-sm sm:text-base"
                                    value={smallUserTemplate}
                                    onChange={handleSmallTemplateChange}
                                    disabled={isLoading}
                                >
                                    {adjustedTemplateList.map(template => (
                                        <option key={template.id} value={template.id}>
                                            {template.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    className="flex-shrink-0"
                                    onClick={() => handleRestore("small-template")}
                                    aria-label="Restore small template"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-counterclockwise sm:w-6 sm:h-6" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                        <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Preview */}
                        <div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                                <p className="text-xs text-gray-400 select-none">Template Preview:</p>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPreviewDevice('normal')}
                                        disabled={isLoading}
                                        className={`p-2 rounded-lg border transition-all ${
                                            previewDevice === 'normal'
                                                ? 'bg-primary border-primary text-secondary'
                                                : 'bg-navbar border-gray-700 text-gray-400 hover:text-secondary'
                                        } disabled:opacity-50`}
                                        aria-label="Preview normal device"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="max-sm:w-5 max-sm:h-5 w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewDevice('small')}
                                        disabled={isLoading}
                                        className={`p-2 rounded-lg border transition-all ${
                                            previewDevice === 'small'
                                                ? 'bg-primary border-primary text-secondary'
                                                : 'bg-navbar border-gray-700 text-gray-400 hover:text-secondary'
                                        } disabled:opacity-50`}
                                        aria-label="Preview small device"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="max-sm:w-5 max-sm:h-5 w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-3 sm:p-4 border border-gray-700 rounded-lg overflow-x-auto" style={{
                                backgroundColor: previewSettings.background.color,
                                backgroundImage: previewSettings.background.image !== 'none' ? `url(${previewSettings.background.image})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}>
                                <div>
                                    <h3 className={`text_outline ${previewSettings.title.outline}`} style={{
                                        '--shadow-color': previewSettings.title.outline_color,
                                        fontFamily: previewSettings.title.family === 'Inter' ? inter.style.fontFamily : previewSettings.title.family,
                                        fontSize: previewSettings.title.size,
                                        fontWeight: previewSettings.title.weight,
                                        color: previewSettings.chapter_title_color,
                                        borderBottom: `${previewSettings.text.separator_width} solid ${previewSettings.text.separator_color}`,
                                        lineHeight: previewSettings.title_spacing.line_height,
                                        wordSpacing: previewSettings.title_spacing.word_spacing,
                                        letterSpacing: previewSettings.title_spacing.letter_spacing
                                    }}>
                                        Chapter 42: The Adventure Begins
                                    </h3>
                                    <div className={`text_outline ${previewSettings.text.outline}`} style={{
                                        '--shadow-color': previewSettings.text.outline_color,
                                        fontFamily: previewSettings.text.family === 'Inter' ? inter.style.fontFamily : previewSettings.text.family,
                                        fontSize: previewSettings.text.size,
                                        fontWeight: previewSettings.text.weight,
                                        color: previewSettings.chapter_content_color,
                                    }}>
                                        <p style={{
                                            margin: `${previewSettings.text_spacing.block_spacing} 0`,
                                            lineHeight: previewSettings.text_spacing.line_height,
                                            wordSpacing: previewSettings.text_spacing.word_spacing,
                                            letterSpacing: previewSettings.text_spacing.letter_spacing
                                        }}>
                                            This is the first paragraph. Notice the spacing between lines, words, and letters.
                                        </p>
                                        <p style={{
                                            marginTop: previewSettings.text_spacing.block_spacing,
                                            lineHeight: previewSettings.text_spacing.line_height,
                                            wordSpacing: previewSettings.text_spacing.word_spacing,
                                            letterSpacing: previewSettings.text_spacing.letter_spacing
                                        }}>
                                            This is the second paragraph. The block spacing controls the gap between these paragraphs.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Download Controls button */}
                            <div className={"mt-4"}>
                                <div className="flex flex-row justify-between items-center mb-2">
                                    <label className="text-gray-300 text-sm font-semibold" htmlFor="smallTemplate">
                                        Toggle Download Controls
                                    </label>
                                    <button
                                        disabled={isLoading}
                                        className={`p-2 rounded-lg border transition-all ${
                                            downloadControls === true
                                                ? 'bg-primary border-primary text-secondary'
                                                : 'bg-navbar border-gray-700 text-gray-400 hover:text-secondary'
                                        } disabled:opacity-50`}
                                        onClick={handleDownloadButton}
                                        title="Download Controls"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fixed Footer - Action Buttons */}
                <div className="p-4 sm:p-6 pt-3 sm:pt-4 border-t border-gray-700/50 flex-shrink-0">
                    <div className="flex gap-2 sm:gap-3 justify-between">
                        <button
                            type="button"
                            onClick={() => setIsDialogOpen(true)}
                            disabled={isLoading}
                            className="flex justify-center items-center bg-red-700 hover:bg-red-800 border-red-800 text-white font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                            {isLoading ? (
                                <CircularProgress sx={{ color: "#FAFAFA" }} size={20} thickness={6}/>
                            ) : (
                                <span className={isLoading ? 'invisible flex items-center gap-2' : 'flex items-center gap-1.5 sm:gap-2'}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                                    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                </svg>
                                <span className="max-sm:hidden">Delete novel</span>
                            </span>
                            )}
                        </button>

                        <div className={"flex gap-2"}>
                            {/* Cancel Button */}
                            <button
                                onClick={handleClosing}
                                disabled={isLoading}
                                className="max-sm:flex-1 flex-none px-2 py-2 rounded-lg text-secondary disabled:opacity-60 flex items-center justify-center gap-1"
                            >
                                    <span className={"text-red-400"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </span>
                                <span className="text-sm">Cancel</span>
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="flex justify-center items-center bg-green-700 hover:bg-green-800 border-green-800 text-secondary font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                            >
                                {isLoading ? (
                                    <CircularProgress sx={{ color: "#FAFAFA" }} size={20} thickness={6}/>
                                ) : (
                                    <span className={isLoading ? 'invisible flex items-center gap-2' : 'flex items-center gap-1.5 sm:gap-2'}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                                    <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
                                </svg>
                                <span className="max-sm:hidden">Save settings</span>
                                <span className="sm:hidden">Save</span>
                            </span>
                                )}
                            </button>
                        </div>

                        <AlertDialog
                            isOpen={isDialogOpen}
                            title="Remove This Novel?"
                            message="This action cannot be undone."
                            confirmText="Remove"
                            cancelText="Cancel"
                            isLoading={isLoading}
                            onConfirm={handleRemove}
                            onCancel={() => setIsDialogOpen(false)}
                        />
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}


export default NovelSettingsPopup;