import React from "react";


function OtherTab({ settings, setSettings, inter }){
    return (
        <>
            <h1 className={"text-center text-secondary thin_link_outline mb-3 sm:hidden"}>Other</h1>
            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-main_background">
                    <div>
                        <label className="block text-sm font-semibold text-secondary mb-1 select-none">Infinite Scrolling</label>
                        <p className="text-xs text-gray-500">Automatically load next chapter when reaching the bottom</p>
                    </div>
                    <button
                        onClick={() =>
                            setSettings((prev) => ({
                                ...prev,
                                infinite_scrolling: !prev.infinite_scrolling,
                            }))
                        }
                        className={`p-0 border-0 font-normal normal-case relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.infinite_scrolling ? 'bg-primary' : 'bg-gray-700'
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.infinite_scrolling ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-main_background">
                    <div>
                        <label className="block text-sm font-semibold text-secondary mb-1 select-none">Horizontal reading</label>
                        <p className="text-xs text-gray-500">Mode that changes the reading direction to be horizontal</p>
                    </div>
                    <button
                        onClick={() =>
                            setSettings((prev) => ({
                                ...prev,
                                horizontal_reading: !prev.horizontal_reading,
                            }))
                        }
                        className={`p-0 border-0 font-normal normal-case relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.horizontal_reading ? 'bg-primary' : 'bg-gray-700'
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.horizontal_reading ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>

                {/* Export/Import Settings */}
                <div className="p-4 border border-gray-700 rounded-lg bg-main_background">
                    <label className="block text-sm font-semibold text-secondary mb-2 select-none">Export/Import Settings</label>

                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => {
                                const dataStr = JSON.stringify(settings, null, 2);
                                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                                const url = URL.createObjectURL(dataBlob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = 'custom-reader-settings.json';
                                link.click();
                                URL.revokeObjectURL(url);
                            }}
                            className="flex-1 px-4 justify-center py-4 bg-primary text-secondary rounded-lg hover:bg-[#3D2798] transition-colors hover:scale-100 border-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                            </svg>
                            <span className={"max-sm:hidden"}>
                                Export Settings
                            </span>
                        </button>

                        <label className="flex-1">
                            <input
                                type="file"
                                accept=".json"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            try {
                                                const imported = JSON.parse(event.target.result);
                                                setSettings(imported);
                                            } catch (err) {
                                                alert('Invalid JSON file');
                                            }
                                        };
                                        reader.readAsText(file);
                                    }
                                    e.target.value = '';
                                }}
                                className="hidden"
                            />
                            <div className="w-full font-bold h-full flex justify-center gap-2 px-4 py-4 bg-navbar border border-gray-700 rounded-lg text-secondary hover:bg-[#2A2B2B] transition-colors cursor-pointer text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                <span className={"max-sm:hidden"}>
                                    Import Settings
                                </span>
                            </div>
                        </label>
                    </div>

                    <p className="text-xs text-gray-500">Export your settings to a JSON file or import from a previously saved file</p>

                    <div className="p-4 border border-gray-700 rounded-lg bg-main_background">
                        <label className="block text-sm font-semibold text-secondary mb-2 select-none">Settings JSON</label>
                        <textarea
                            value={JSON.stringify(settings, null, 2)}
                            onChange={(e) => {
                                try {
                                    setSettings(JSON.parse(e.target.value));
                                } catch (err) {
                                    // Invalid JSON, ignore
                                }
                            }}
                            className="w-full h-64 px-3 py-2 bg-navbar border border-gray-700 rounded-lg text-secondary font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary caret-primary resize-none"
                        />
                    </div>
                </div>

                {/* Preview */}
                <div>
                    <p className="text-xs text-gray-400 mb-1 select-none">Final Preview:</p>
                    <div className="p-4 border border-gray-700 rounded-lg overflow-auto" style={{
                        height: '300px',
                        backgroundColor: settings.background.color,
                        backgroundImage: settings.background.image !== 'none' ? `url(${settings.background.image})` : 'none',
                        backgroundSize: settings.background.size,
                        backgroundPosition: settings.background.position,
                        backgroundAttachment: settings.background.attachment,
                        backgroundRepeat: settings.background.repeat
                    }}>
                        <div className="max-sm:p-4 p-8" style={{ minHeight: '500px' }}>
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
                            <div className={`text_outline ${settings.text.outline}`} style={{
                                '--shadow-color': settings.text.outline_color,
                                fontFamily: settings.text.family === 'Inter' ? inter.style.fontFamily : settings.text.family,
                                fontSize: settings.text.size,
                                fontWeight: settings.text.weight,
                                color: settings.chapter_content_color,
                            }}>
                                <p style={{
                                    margin: `${settings.text_spacing.block_spacing} 0`,
                                    lineHeight: settings.text_spacing.line_height,
                                    wordSpacing: settings.text_spacing.word_spacing,
                                    letterSpacing: settings.text_spacing.letter_spacing
                                }}>
                                    This is the first paragraph. Notice the spacing between lines, words, and letters.
                                </p>
                                <p style={{
                                    margin: `${settings.text_spacing.block_spacing} 0`,
                                    lineHeight: settings.text_spacing.line_height,
                                    wordSpacing: settings.text_spacing.word_spacing,
                                    letterSpacing: settings.text_spacing.letter_spacing
                                }}>
                                    This is the second paragraph. The block spacing controls the gap between these paragraphs.
                                </p>
                                <p style={{
                                    margin: `${settings.text_spacing.block_spacing} 0`,
                                    lineHeight: settings.text_spacing.line_height,
                                    wordSpacing: settings.text_spacing.word_spacing,
                                    letterSpacing: settings.text_spacing.letter_spacing
                                }}>
                                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nullam lectus justo, vulputate eget mollis sed, tempor sed magna. Praesent vitae arcu tempor neque lacinia pretium.
                                </p>
                                <p style={{
                                    margin: `${settings.text_spacing.block_spacing} 0`,
                                    lineHeight: settings.text_spacing.line_height,
                                    wordSpacing: settings.text_spacing.word_spacing,
                                    letterSpacing: settings.text_spacing.letter_spacing
                                }}>
                                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nullam lectus justo, vulputate eget mollis sed, tempor sed magna. Praesent vitae arcu tempor neque lacinia pretium.
                                </p>
                                <p style={{
                                    margin: `${settings.text_spacing.block_spacing} 0`,
                                    lineHeight: settings.text_spacing.line_height,
                                    wordSpacing: settings.text_spacing.word_spacing,
                                    letterSpacing: settings.text_spacing.letter_spacing
                                }}>
                                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nullam lectus justo, vulputate eget mollis sed, tempor sed magna. Praesent vitae arcu tempor neque lacinia pretium.
                                </p>
                                <p style={{
                                    margin: `${settings.text_spacing.block_spacing} 0`,
                                    lineHeight: settings.text_spacing.line_height,
                                    wordSpacing: settings.text_spacing.word_spacing,
                                    letterSpacing: settings.text_spacing.letter_spacing
                                }}>
                                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nullam lectus justo, vulputate eget mollis sed, tempor sed magna. Praesent vitae arcu tempor neque lacinia pretium.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default OtherTab;