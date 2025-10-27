import React from "react";


function TitleTab({ settings, setSettings, handleRestore, fontWeightOptions, outlineOptions, inter }){
    function updateTitle(key, value) {
        setSettings(prev => ({
            ...prev,
            title: { ...prev.title, [key]: value }
        }));
    }


    return (
        <>
            <h1 className={"text-center text-secondary thin_link_outline mb-3 sm:hidden"}>Title</h1>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-secondary mb-2 select-none">Font Family</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        {/* Input field for custom font */}
                        <input
                            type="text"
                            value={settings.title.family}
                            onChange={(e) => updateTitle('family', e.target.value)}
                            placeholder="e.g., Inter, Arial, Georgia"
                            className="flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                        />
                        <div className="flex gap-2">
                            {/* Dropdown for predefined font families */}
                            <select
                                value={['Inter', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New', 'Verdana', 'Trebuchet MS', 'Palatino', 'Garamond', 'Comic Sans MS', 'Impact', 'Lucida Console', 'Tahoma'].includes(settings.title.family) ? settings.title.family : 'custom'}
                                onChange={(e) => {
                                    if (e.target.value !== 'custom') {
                                        updateTitle('family', e.target.value);
                                    }
                                }}
                                className="flex-1 sm:w-32 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="custom" disabled>Custom</option>
                                {['Inter', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New', 'Verdana', 'Trebuchet MS', 'Palatino', 'Garamond', 'Comic Sans MS', 'Impact', 'Lucida Console', 'Tahoma'].map((font) => (
                                    <option key={font} value={font}>{font}</option>
                                ))}
                            </select>
                            {/* Restore button */}
                            <button className="text-secondary p-2 hover:scale-100 border-2" onClick={() => handleRestore("title.family")}>
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
                        <label className="block text-sm font-semibold text-secondary mb-2 select-none">Font Size</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                value={settings.title.size}
                                onChange={(e) => updateTitle('size', e.target.value)}
                                placeholder="30px"
                                className="w-full sm:w-24 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                            />
                            <div className="flex gap-2 flex-1">
                                <input
                                    type="range"
                                    min="20"
                                    max="50"
                                    value={parseInt(settings.title.size) || 30}
                                    onChange={(e) => updateTitle('size', `${e.target.value}px`)}
                                    className="flex-1"
                                />
                                {/* Restore button */}
                                <button className="text-secondary p-2 hover:scale-100 border-2" onClick={() => handleRestore("title.size")}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                        <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-secondary mb-2 select-none">Font Weight</label>
                        <div className="flex gap-2">
                            <select
                                value={settings.title.weight}
                                onChange={(e) => updateTitle('weight', e.target.value)}
                                className="flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                {fontWeightOptions.map(weight => (
                                    <option key={weight} value={weight}>{weight}</option>
                                ))}
                            </select>
                            {/* Restore button */}
                            <button className="text-secondary p-2 hover:scale-100 border-2" onClick={() => handleRestore("title.weight")}>
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
                        <label className="block text-sm font-semibold text-secondary mb-2 select-none">Title Outline</label>
                        <div className="flex gap-2">
                            <select
                                value={settings.title.outline}
                                onChange={(e) => updateTitle('outline', e.target.value)}
                                className="flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                {outlineOptions.map(outline => (
                                    <option key={outline} value={outline}>{outline}</option>
                                ))}
                            </select>
                            {/* Restore button */}
                            <button className="text-secondary p-2 hover:scale-100 border-2" onClick={() => handleRestore("title.outline")}>
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
                                value={settings.title.outline_color}
                                onChange={(e) => updateTitle('outline_color', e.target.value)}
                                className="w-12 h-10 rounded border border-gray-700 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={settings.title.outline_color}
                                onChange={(e) => updateTitle('outline_color', e.target.value)}
                                placeholder="#000000"
                                className="flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                            />
                            {/* Restore button */}
                            <button className="text-secondary p-2 hover:scale-100 border-2" onClick={() => handleRestore("title.outline_color")}>
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
                    <p className="text-xs text-gray-400 mb-2 select-none">Preview:</p>
                    <h3 className={`text_outline ${settings.title.outline}`} style={{
                        '--shadow-color': settings.title.outline_color,
                        fontFamily: settings.title.family === 'Inter' ? inter.style.fontFamily : settings.title.family,
                        fontSize: settings.title.size,
                        fontWeight: settings.title.weight,
                        color: settings.chapter_title_color,
                    }}>
                        Chapter 42: The Adventure Begins
                    </h3>
                </div>
            </div>
        </>
    )
}

export default TitleTab;