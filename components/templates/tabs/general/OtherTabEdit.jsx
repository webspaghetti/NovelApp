import React from "react";
import Image from "next/image";


function OtherTabEdit({ settings, setSettings, templateName, setTemplateName, originalTemplateName }){
    return (
        <>
            <h1 className={"text-center text-secondary thin_link_outline mb-3 sm:hidden"}>Other</h1>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-gray-700 rounded-lg bg-main_background">
                    <div className="flex-shrink-0">
                        <label className="block text-sm font-semibold text-secondary mb-1 select-none">Template Name</label>
                        <p className="text-xs text-gray-500">Select a new name for your template</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <input
                            type="text"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder="Template Name"
                            className="flex-1 sm:flex-initial sm:w-64 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                        />
                        {/* Restore button */}
                        <button
                            className="text-secondary p-2 hover:scale-100 border-2"
                            onClick={() => setTemplateName(originalTemplateName)}
                            aria-label="Restore original template name">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                            </svg>
                        </button>
                    </div>
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
                    <div className="border border-gray-700 rounded-lg overflow-auto" style={{
                        height: '300px',
                        backgroundColor: settings.background.color,
                        backgroundImage: settings.background.image !== 'none' ? `url(${settings.background.image})` : 'none',
                        backgroundSize: settings.background.size,
                        backgroundPosition: settings.background.position,
                        backgroundAttachment: settings.background.attachment,
                        backgroundRepeat: settings.background.repeat
                    }}>

                        <div
                            className="w-full select-none px-4 py-2"
                            style={{
                                backgroundColor: settings.menu.nav_color,
                                color: settings.menu.text_color
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={"/logo.png"}
                                        alt={"NovelApp logo"}
                                        width={24}
                                        height={24}
                                        quality={100}
                                    />
                                    <span
                                        className="text-sm link_outline"
                                        style={{
                                            color: settings.menu.text_color,
                                            '--outline-color': settings.menu.outline_color
                                        }}
                                    >NovelApp</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs navbar_outline_base max-sm:hidden" style={{
                                        color: settings.menu.text_color,
                                        '--outline-color': settings.menu.outline_color}}>
                                        Home
                                    </span>
                                    <span className="text-xs navbar_outline_base" style={{
                                        color: settings.menu.text_color,
                                        '--outline-color': settings.menu.outline_color
                                    }}
                                    >Sources
                                    </span>
                                    <span className="text-xs navbar_outline_base" style={{
                                        color: settings.menu.text_color,
                                        '--outline-color': settings.menu.outline_color
                                    }}
                                    >Templates
                                    </span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="size-6 sm:hover:ring-2 max-sm:ring-2 rounded-full transition-all"
                                        style={{
                                            '--tw-ring-color': settings.menu.outline_color,
                                        }}
                                    >
                                        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default OtherTabEdit;