import React from "react";


function TextTab({ settings, setSettings, handleRestore, fontWeightOptions, outlineOptions, inter }){
    function updateText(key, value) {
        setSettings(prev => ({
            ...prev,
            text: { ...prev.text, [key]: value }
        }));
    }


    return (
        <>
            <h1 className={"text-center text-secondary thin_link_outline mb-3 sm:hidden"}>Text</h1>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-secondary mb-2 select-none">Font Family</label>
                    <div className="flex max-sm:flex-col flex-row gap-2">
                        {/* Input field for custom font */}
                        <input
                            type="text"
                            value={settings.text.family}
                            onChange={(e) => updateText('family', e.target.value)}
                            placeholder="e.g., Inter, Arial, Georgia"
                            className="flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                        />
                        <div className="flex gap-2">
                            {/* Dropdown for predefined font families */}
                            <select
                                value={['Inter', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New', 'Verdana', 'Trebuchet MS', 'Palatino', 'Garamond', 'Comic Sans MS', 'Impact', 'Lucida Console', 'Tahoma'].includes(settings.text.family) ? settings.text.family : 'custom'}
                                onChange={(e) => {
                                    if (e.target.value !== 'custom') {
                                        updateText('family', e.target.value);
                                    }
                                }}
                                className="flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="custom" disabled>Custom</option>
                                {['Inter', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New', 'Verdana', 'Trebuchet MS', 'Palatino', 'Garamond', 'Comic Sans MS', 'Impact', 'Lucida Console', 'Tahoma'].map((font) => (
                                    <option key={font} value={font}>{font}</option>
                                ))}
                            </select>
                            {/* Restore button */}
                            <button className="text-secondary p-2 hover:scale-100 border-2" onClick={() => handleRestore("text.family")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Enter <b><i>any</i></b> font name (e.g., Inter, Papyrus, Courier, Brush Script MT) or choose from the dropdown. *(Some fonts may be incompatible)</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-secondary mb-2 select-none">Font Size</label>
                        <div className="flex max-sm:flex-col flex-row gap-2">
                            <input
                                type="text"
                                value={settings.text.size}
                                onChange={(e) => updateText('size', e.target.value)}
                                placeholder="18px"
                                className="w-full sm:w-24 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                            />
                            <div className="flex gap-2 flex-1">
                                <input
                                    type="range"
                                    min="12"
                                    max="32"
                                    value={parseInt(settings.text.size) || 18}
                                    onChange={(e) => updateText('size', `${e.target.value}px`)}
                                    className="flex-1"
                                />
                                {/* Restore button */}
                                <button className="text-secondary p-2 hover:scale-100 border-2" onClick={() => handleRestore("text.size")}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                        <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Enter <b><i>any</i></b> font size or use the slider.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-secondary mb-2 select-none">Font Weight</label>
                        <div className="flex gap-2">
                            <select
                                value={settings.text.weight}
                                onChange={(e) => updateText('weight', e.target.value)}
                                className="flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                {fontWeightOptions.map(weight => (
                                    <option key={weight} value={weight}>{weight}</option>
                                ))}
                            </select>
                            {/* Restore button */}
                            <button className="text-secondary p-2 hover:scale-100 border-2" onClick={() => handleRestore("text.weight")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-secondary mb-2 select-none">Text Outline</label>
                        <div className="flex gap-2">
                            <select
                                value={settings.text.outline}
                                onChange={(e) => updateText('outline', e.target.value)}
                                className="flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                {outlineOptions.map(outline => (
                                    <option key={outline} value={outline}>{outline}</option>
                                ))}
                            </select>
                            {/* Restore button */}
                            <button className="text-secondary p-2 hover:scale-100 border-2" onClick={() => handleRestore("text.outline")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-secondary mb-2 select-none">Outline Color</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={settings.text.outline_color}
                                onChange={(e) => updateText('outline_color', e.target.value)}
                                className="w-12 h-10 rounded border border-gray-700 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={settings.text.outline_color}
                                onChange={(e) => updateText('outline_color', e.target.value)}
                                placeholder="#000000"
                                className="flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                            />
                            {/* Restore button */}
                            <button className="text-secondary p-2 hover:scale-100 border-2" onClick={() => handleRestore("text.outline_color")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-secondary mb-2 select-none">Separator Width</label>
                        <div className="flex max-sm:flex-col flex-row gap-2">
                            <input
                                type="text"
                                value={settings.text.separator_width}
                                onChange={(e) => updateText('separator_width', e.target.value)}
                                placeholder="18px"
                                className="w-full sm:w-24 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                            />
                            <div className="flex gap-2 flex-1">
                                <input
                                    type="range"
                                    min="1"
                                    max="12"
                                    value={parseInt(settings.text.separator_width) || 18}
                                    onChange={(e) => updateText('separator_width', `${e.target.value}px`)}
                                    className="flex-1"
                                />
                                {/* Restore button */}
                                <button className="text-secondary p-2 hover:scale-100 border-2" onClick={() => handleRestore("text.separator_width")}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                        <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Enter <b><i>any</i></b> font size or use the slider.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-secondary mb-2 select-none">Separator Color</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={settings.text.separator_color}
                                onChange={(e) => updateText('separator_color', e.target.value)}
                                className="w-12 h-10 rounded border border-gray-700 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={settings.text.separator_color}
                                onChange={(e) => updateText('separator_color', e.target.value)}
                                placeholder="#99a1af"
                                className="flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                            />
                            {/* Restore button */}
                            <button className="text-secondary p-2 hover:scale-100 border-2" onClick={() => handleRestore("text.separator_color")}>
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
                    <p className="text-xs text-gray-400 mb-2 select-none" style={{borderBottom: `${settings.text.separator_width} solid ${settings.text.separator_color}`}}>Preview:</p>
                    <p className={`text_outline ${settings.text.outline}`} style={{
                        '--shadow-color': settings.text.outline_color,
                        fontFamily: settings.text.family === 'Inter' ? inter.style.fontFamily : settings.text.family,
                        fontSize: settings.text.size,
                        fontWeight: settings.text.weight,
                        color: settings.chapter_content_color,
                    }}>
                        The quick brown fox jumps over the lazy dog. This is how your text will look with the selected font settings.
                    </p>
                </div>
            </div>
        </>
    )
}


export default TextTab;