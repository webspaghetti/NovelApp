import React from "react";
import Image from "next/image";

function NavigationTab({ settings, setSettings, handleRestore }) {
    function updateMenu(key, value) {
        setSettings(prev => ({
            ...prev,
            menu: {...prev.menu, [key]: value}
        }));
    }

    return (
        <>
            <h1 className={"text-center text-secondary thin_link_outline mb-3 sm:hidden"}>Navigation</h1>
            <div className="space-y-6">
                {/* Navbar Section */}
                <div>
                    <div className="p-4 border border-gray-700 rounded-lg bg-main_background">
                        <h2 className="text-lg font-semibold text-secondary mb-4">Navbar Settings</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                            {/* Nav Background Color */}
                            <div>
                                <label className="block text-sm font-semibold text-secondary mb-2 select-none">Background Color</label>
                                <div className="flex gap-2 w-full">
                                    <input
                                        type="color"
                                        value={settings.menu.nav_color}
                                        onChange={(e) => updateMenu('nav_color', e.target.value)}
                                        className="w-12 h-10 flex-shrink-0 rounded border border-gray-700 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={settings.menu.nav_color}
                                        onChange={(e) => updateMenu('nav_color', e.target.value)}
                                        placeholder="#121212"
                                        className="flex-1 min-w-0 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                                    />
                                    <button className="text-secondary p-2 hover:scale-100 border-2"
                                            onClick={() => handleRestore("menu.nav_color")}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                             className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                            <path fillRule="evenodd"
                                                  d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                            <path
                                                d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Text Color */}
                            <div>
                                <label className="block text-sm font-semibold text-secondary mb-2 select-none">Text
                                    Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={settings.menu.text_color}
                                        onChange={(e) => updateMenu('text_color', e.target.value)}
                                        className="w-12 h-10 flex-shrink-0 rounded border border-gray-700 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={settings.menu.text_color}
                                        onChange={(e) => updateMenu('text_color', e.target.value)}
                                        placeholder="#fafafa"
                                        className="flex-1 min-w-0 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                                    />
                                    <button className="text-secondary p-2 hover:scale-100 border-2"
                                            onClick={() => handleRestore("menu.text_color")}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                             className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                            <path fillRule="evenodd"
                                                  d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                            <path
                                                d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Outline Color */}
                            <div>
                                <label className="block text-sm font-semibold text-secondary mb-2 select-none">Outline
                                    Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={settings.menu.outline_color}
                                        onChange={(e) => updateMenu('outline_color', e.target.value)}
                                        className="w-12 h-10 flex-shrink-0 rounded border border-gray-700 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={settings.menu.outline_color}
                                        onChange={(e) => updateMenu('outline_color', e.target.value)}
                                        placeholder="#5e42cf"
                                        className="flex-1 min-w-0 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                                    />
                                    <button className="text-secondary p-2 hover:scale-100 border-2"
                                            onClick={() => handleRestore("menu.outline_color")}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                             className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                            <path fillRule="evenodd"
                                                  d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                            <path
                                                d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Enter any colors you want or <b><i>transparent</i></b> if you want it to be see-through</p>
                </div>
                {/* Preview Section */}

                <div className="mt-6 p-4 border border-gray-700 rounded-lg bg-main_background">
                    <p className="text-xs text-gray-400 mb-2 select-none">Preview:</p>

                    <div className="space-y-4">

                        <div
                            className="w-full select-none px-4 py-2 rounded-lg"
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
                                    >About
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
    );
}

export default NavigationTab;