import React from "react";


function TitleSpacingTab({ settings, setSettings, handleRestore, spacingPresets, inter }){
    function updateTitleSpacing(key, value) {
        setSettings(prev => ({
            ...prev,
            title_spacing: { ...prev.title_spacing, [key]: value }
        }));
    }


    return (
        <>
            <h1 className={"text-center text-secondary thin_link_outline mb-3 sm:hidden"}>Title Spacing</h1>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-secondary mb-2 select-none">Line Height</label>
                    <div className="flex max-sm:flex-col flex-row gap-2">
                        <input
                            type="text"
                            value={settings.title_spacing.line_height}
                            onChange={(e) => updateTitleSpacing('line_height', e.target.value)}
                            placeholder="36px"
                            className="max-sm:w-full flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                        />
                        <div className="flex gap-2 flex-1">
                            <input
                                type="range"
                                min="24"
                                max="64"
                                value={parseInt(settings.title_spacing.line_height) || 36}
                                onChange={(e) => updateTitleSpacing('line_height', `${e.target.value}px`)}
                                className="flex-1"
                            />
                            {/* Restore button */}
                            <button className="text-secondary p-2 hover:scale-100 border-2" onClick={() => handleRestore("title_spacing.line_height")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-secondary mb-2 select-none">Word Spacing</label>
                    <div className="flex max-sm:flex-col flex-row gap-2">
                        <input
                            type="text"
                            value={settings.title_spacing.word_spacing}
                            onChange={(e) => updateTitleSpacing('word_spacing', e.target.value)}
                            placeholder="normal"
                            className="flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                        />
                        <div className="flex gap-2">
                            <select
                                value={spacingPresets.word_spacing.includes(settings.title_spacing.word_spacing) ? settings.title_spacing.word_spacing : 'custom'}
                                onChange={(e) => {
                                    if (e.target.value !== 'custom') {
                                        updateTitleSpacing('word_spacing', e.target.value);
                                    }
                                }}
                                className="flex-1 sm:w-32 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="custom" disabled>Custom</option>
                                {spacingPresets.word_spacing.map(spacing => (
                                    <option key={spacing} value={spacing}>{spacing}</option>
                                ))}
                            </select>
                            {/* Restore button */}
                            <button className="text-secondary p-2 hover:scale-100 border-2" onClick={() => handleRestore("title_spacing.word_spacing")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-secondary mb-2 select-none">Letter Spacing</label>
                    <div className="flex max-sm:flex-col flex-row gap-2">
                        <input
                            type="text"
                            value={settings.title_spacing.letter_spacing}
                            onChange={(e) => updateTitleSpacing('letter_spacing', e.target.value)}
                            placeholder="normal"
                            className="flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                        />
                        <div className="flex gap-2">
                            <select
                                value={spacingPresets.letter_spacing.includes(settings.title_spacing.letter_spacing) ? settings.title_spacing.letter_spacing : 'custom'}
                                onChange={(e) => {
                                    if (e.target.value !== 'custom') {
                                        updateTitleSpacing('letter_spacing', e.target.value);
                                    }
                                }}
                                className="flex-1 sm:w-32 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="custom" disabled>Custom</option>
                                {spacingPresets.letter_spacing.map(spacing => (
                                    <option key={spacing} value={spacing}>{spacing}</option>
                                ))}
                            </select>
                            {/* Restore button */}
                            <button className="text-secondary p-2 hover:scale-100 border-2" onClick={() => handleRestore("title_spacing.letter_spacing")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="mt-6 p-4 border border-gray-700 rounded-lg bg-main_background">
                    <p className="text-xs text-gray-400 mb-3 select-none">Preview:</p>
                    <div style={{
                        fontFamily: settings.text.family === 'Inter' ? inter.style.fontFamily : settings.text.family,
                        fontSize: settings.text.size,
                        color: settings.chapter_content_color
                    }}>
                        <h3 className={`text_outline ${settings.title.outline}`} style={{
                            '--shadow-color': settings.title.outline_color,
                            fontFamily: settings.title.family === 'Inter' ? inter.style.fontFamily : settings.title.family,
                            fontSize: settings.title.size,
                            fontWeight: settings.title.weight,
                            color: settings.chapter_title_color,
                            borderBottom: `${settings.text.separator_width} solid ${settings.text.separator_color}`,
                            lineHeight: settings.title_spacing.line_height,
                            wordSpacing: settings.title_spacing.word_spacing,
                            letterSpacing: settings.title_spacing.letter_spacing
                        }}>
                            Chapter 42: The Adventure Begins
                        </h3>
                    </div>
                </div>
            </div>
        </>
    )
}


export default TitleSpacingTab;