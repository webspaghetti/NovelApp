import React, { useState } from "react";


function ColorsTab({ settings, setSettings, handleRestore }){
    const [colorPresetTarget, setColorPresetTarget] = useState('chapter_title_color');


    function updateColor(key, value) {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    }


    return (
        <>
            <h1 className={"text-center text-secondary thin_link_outline mb-3 sm:hidden"}>Colors</h1>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-secondary mb-2 select-none">Chapter Title Color</label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={settings.chapter_title_color}
                            onChange={(e) => updateColor('chapter_title_color', e.target.value)}
                            className="w-12 h-10 rounded border border-gray-700 cursor-pointer"
                        />
                        <input
                            type="text"
                            value={settings.chapter_title_color}
                            onChange={(e) => updateColor('chapter_title_color', e.target.value)}
                            placeholder="#5e42fc"
                            className="flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                        />
                        {/* Restore button */}
                        <button className="text-secondary p-2 hover:scale-100 border-2" onClick={() => handleRestore("chapter_title_color")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-secondary mb-2 select-none">Chapter Content Color</label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={settings.chapter_content_color}
                            onChange={(e) => updateColor('chapter_content_color', e.target.value)}
                            className="w-12 h-10 rounded border border-gray-700 cursor-pointer"
                        />
                        <input
                            type="text"
                            value={settings.chapter_content_color}
                            onChange={(e) => updateColor('chapter_content_color', e.target.value)}
                            placeholder="#FAFAFA"
                            className="flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                        />
                        {/* Restore button */}
                        <button className="text-secondary p-2 hover:scale-100 border-2" onClick={() => handleRestore("chapter_content_color")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Quick Color Presets */}
                <div>
                    <p className="text-sm font-semibold text-secondary mb-2 select-none">Quick Text Color Presets</p>

                    {/* Switcher for Title/Content */}
                    <div className="flex mb-3 gap-2">
                        <button
                            onClick={() => setColorPresetTarget('chapter_title_color')}
                            className={`max-sm:flex-1 justify-center flex-none px-4 py-2 text-sm rounded-lg hover:scale-100 transition-colors ${
                                colorPresetTarget === 'chapter_title_color'
                                    ? 'bg-primary text-white'
                                    : 'bg-main_background text-secondary border border-gray-700'
                            }`}
                        >
                            Title Color
                        </button>
                        <button
                            onClick={() => setColorPresetTarget('chapter_content_color')}
                            className={`max-sm:flex-1 justify-center flex-none px-4 py-2 text-sm rounded-lg hover:scale-100 transition-colors ${
                                colorPresetTarget === 'chapter_content_color'
                                    ? 'bg-primary text-white'
                                    : 'bg-main_background text-secondary border border-gray-700'
                            }`}
                        >
                            Content Color
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        {[
                            // Light text colors (for dark backgrounds)
                            { name: 'White', color: '#ffffff' },
                            { name: 'Soft White', color: '#fafafa' },
                            { name: 'Light Gray', color: '#e5e5e5' },
                            { name: 'Silver', color: '#c0c0c0' },

                            // Warm light tones
                            { name: 'Cream', color: '#f5f5dc' },
                            { name: 'Peach', color: '#ffdab9' },
                            { name: 'Gold', color: '#ffd700' },
                            { name: 'Coral', color: '#ff7f50' },

                            // Cool light tones
                            { name: 'Sky Blue', color: '#87ceeb' },
                            { name: 'Aqua', color: '#7fffd4' },
                            { name: 'Lavender', color: '#e6e6fa' },
                            { name: 'Pink', color: '#ffb6c1' },

                            // Vibrant colors
                            { name: 'Purple', color: '#9d7fe8' },
                            { name: 'Mint', color: '#98fb98' },
                            { name: 'Lime', color: '#bfff00' },
                            { name: 'Cyan', color: '#00ffff' },

                            // Dark text colors (for light backgrounds)
                            { name: 'Black', color: '#000000' },
                            { name: 'Charcoal', color: '#2b2b2b' },
                            { name: 'Dark Gray', color: '#4a4a4a' },
                            { name: 'Slate', color: '#708090' },
                        ].map(preset => (
                            <button
                                key={preset.name}
                                onClick={() => updateColor(colorPresetTarget, preset.color)}
                                className="relative px-3 py-2 max-sm:text-xs text-sm rounded-lg border border-gray-700 hover:scale-[1.02] hover:shadow-md transition-all duration-150 text-secondary thin_link_outline"
                                style={{ backgroundColor: preset.color }}
                            >
                                {preset.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Preview */}
                <div className="mt-6 p-4 border border-gray-700 rounded-lg" style={{ backgroundColor: settings.background.color }}>
                    <p className="text-xs text-gray-400 mb-3 select-none">Preview:</p>
                    <h3 className={`text_outline ${settings.title.outline} text-xl font-bold mb-3`} style={{
                        color: settings.chapter_title_color,
                        '--shadow-color': settings.title.outline_color,
                    }}>
                        Chapter 42: The Adventure Begins
                    </h3>
                    <p className={`text_outline ${settings.text.outline}`} style={{
                        color: settings.chapter_content_color,
                        '--shadow-color': settings.text.outline_color,
                    }}>
                        This is sample chapter content. You can see how the title and content colors will appear in your reading interface.
                    </p>
                </div>
            </div>
        </>
    )
}


export default ColorsTab;