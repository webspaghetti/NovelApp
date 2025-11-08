import React from "react";


function BackgroundTab({ settings, setSettings, handleRestore }){
    function updateBackground(key, value) {
        setSettings(prev => ({
            ...prev,
            background: { ...prev.background, [key]: value }
        }));
    }


    const sizePresets = ['cover', 'contain', 'auto'];
    const attachmentOptions = ['fixed', 'scroll', 'local'];
    const positionPresets = ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'];
    const repeatOptions = ['no-repeat', 'repeat', 'repeat-x', 'repeat-y', 'space', 'round'];


    return (
        <>
            <h1 className={"text-center text-secondary thin_link_outline mb-3 sm:hidden"}>Background</h1>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-secondary mb-2 select-none">Background Color</label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={settings.background.color}
                            onChange={(e) => updateBackground('color', e.target.value)}
                            className="w-12 h-10 flex-shrink-0 rounded border border-gray-700 cursor-pointer"
                        />
                        <input
                            type="text"
                            value={settings.background.color}
                            onChange={(e) => updateBackground('color', e.target.value)}
                            placeholder="#171717"
                            className="flex-1 min-w-0 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                        />
                        {/* Restore button */}
                        <button className="text-secondary p-2 hover:scale-100 border-2" onClick={() => handleRestore("background.color")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-secondary mb-2 select-none">Background Image URL</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={settings.background.image}
                            onChange={(e) => updateBackground('image', e.target.value)}
                            placeholder="none or https://example.com/image.jpg"
                            className="flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                        />
                        {/* Restore button */}
                        <button className="text-secondary p-2 hover:scale-100 border-2" onClick={() => handleRestore("background.image")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                            </svg>
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Enter &quot;none&quot; for no image, or a URL to an image</p>
                </div>

                {/* Background Size */}
                <div>
                    <label className="block text-sm font-semibold text-secondary mb-2 select-none">Background Size</label>
                    <div className="flex max-sm:flex-col flex-row gap-2">
                        <input
                            type="text"
                            value={settings.background.size}
                            onChange={(e) => updateBackground('size', e.target.value)}
                            placeholder="cover"
                            className="flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                        />
                        <div className="flex gap-2">
                            <select
                                value={sizePresets.includes(settings.background.size) ? settings.background.size : 'custom'}
                                onChange={(e) => {
                                    if (e.target.value !== 'custom') {
                                        updateBackground('size', e.target.value);
                                    }
                                }}
                                className="flex-1 sm:w-32 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="custom" disabled>Custom</option>
                                {sizePresets.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                            {/* Restore button */}
                            <button className="text-secondary p-2 hover:scale-100 border-2" onClick={() => handleRestore("background.size")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">e.g., &quot;cover&quot;, &quot;contain&quot;, &quot;100px 200px&quot;, &quot;50% auto&quot;</p>
                </div>

                {/* Background Position */}
                <div>
                    <label className="block text-sm font-semibold text-secondary mb-2 select-none">Background Position</label>
                    <div className="flex max-sm:flex-col flex-row gap-2">
                        <input
                            type="text"
                            value={settings.background.position}
                            onChange={(e) => updateBackground('position', e.target.value)}
                            placeholder="center"
                            className="flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                        />
                        <div className="flex gap-2">
                            <select
                                value={positionPresets.includes(settings.background.position) ? settings.background.position : 'custom'}
                                onChange={(e) => {
                                    if (e.target.value !== 'custom') {
                                        updateBackground('position', e.target.value);
                                    }
                                }}
                                className="flex-1 sm:w-32 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="custom" disabled>Custom</option>
                                {positionPresets.map(pos => (
                                    <option key={pos} value={pos}>{pos}</option>
                                ))}
                            </select>
                            {/* Restore button */}
                            <button className="text-secondary p-2 hover:scale-100 border-2" onClick={() => handleRestore("background.position")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">e.g., &quot;center&quot;, &quot;top left&quot;, &quot;50% 50%&quot;</p>
                </div>

                {/* Background Attachment */}
                <div>
                    <label className="block text-sm font-semibold text-secondary mb-2 select-none">Background Attachment</label>
                    <div className="flex gap-2">
                        <select
                            value={settings.background.attachment}
                            onChange={(e) => updateBackground('attachment', e.target.value)}
                            className="flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            {attachmentOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        {/* Restore button */}
                        <button className="text-secondary p-2 hover:scale-100 border-2" onClick={() => handleRestore("background.attachment")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                            </svg>
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">fixed: stays in place, scroll: moves with content, local: scrolls with element</p>
                </div>

                {/* Background Repeat */}
                <div>
                    <label className="block text-sm font-semibold text-secondary mb-2 select-none">Background Repeat</label>
                    <div className="flex gap-2">
                        <select
                            value={settings.background.repeat}
                            onChange={(e) => updateBackground('repeat', e.target.value)}
                            className="flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            {repeatOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        {/* Restore button */}
                        <button className="text-secondary p-2 hover:scale-100 border-2" onClick={() => handleRestore("background.repeat")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                            </svg>
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">no-repeat: once, repeat: tile, repeat-x/y: horizontal/vertical, space: with gaps, round: stretched</p>
                </div>

                {/* Quick color presets */}
                <div>
                    <p className="text-sm font-semibold text-secondary mb-2 select-none">Quick Color Presets</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        {[
                            // Neutral & grayscale
                            { name: 'Dark', color: '#1e1e1e' },
                            { name: 'Charcoal', color: '#2b2b2b' },
                            { name: 'Slate', color: '#3b3b3b' },

                            // Warm tones
                            { name: 'Sepia', color: '#cda882' },
                            { name: 'Paper', color: '#ecddbe' },
                            { name: 'Cream', color: '#fdfbd4' },
                            { name: 'Rosewood', color: '#4b2426' },
                            { name: 'Valentine Red', color: '#e55451' },

                            // Cool tones
                            { name: 'Midnight Blue', color: '#1a2238' },
                            { name: 'Deep Sea', color: '#0f2a3f' },
                            { name: 'Sky Blue', color: '#6fd0ef' },
                            { name: 'Frost', color: '#c3deea' },

                            // Greenish / natural tones
                            { name: 'Forest', color: '#1f3325' },
                            { name: 'Moss', color: '#2e3d33' },
                            { name: 'Sage', color: '#9daf89' },

                            // Purplish tones
                            { name: 'Amethyst', color: '#2c1a47' },
                            { name: 'Lavender', color: '#Bfacfe' },
                        ].map(preset => (
                            <button
                                key={preset.name}
                                onClick={() => updateBackground('color', preset.color)}
                                className="relative px-3 py-2 max-sm:text-xs text-sm rounded-lg border border-gray-700 hover:scale-[1.02] hover:shadow-md transition-all duration-150 text-secondary thin_link_outline"
                                style={{ backgroundColor: preset.color }}
                            >
                                {preset.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Preview */}
                <div>
                    <p className="text-sm font-semibold text-secondary mb-2 select-none">Preview</p>
                    <div
                        className="border border-gray-700 rounded-lg overflow-auto"
                        style={{
                            height: '300px',
                            backgroundColor: settings.background.color,
                            backgroundImage: settings.background.image !== 'none' ? `url(${settings.background.image})` : 'none',
                            backgroundSize: settings.background.size,
                            backgroundPosition: settings.background.position,
                            backgroundAttachment: settings.background.attachment,
                            backgroundRepeat: settings.background.repeat
                        }}>
                    </div>
                </div>
            </div>
        </>
    )
}


export default BackgroundTab;