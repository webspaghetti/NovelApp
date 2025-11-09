import React, { useState } from "react";
import Image from "next/image";
import CircularProgress from "@mui/material/CircularProgress";

function NavigationTab({ settings, setSettings, handleRestore, editMode }) {
    const [isHoveredPrevious, setIsHoveredPrevious] = useState(false);
    const [isHoveredBack, setIsHoveredBack] = useState(false);
    const [isHoveredNext, setIsHoveredNext] = useState(false);

    function updateMenu(key, value) {
        setSettings(prev => ({
            ...prev,
            menu: {...prev.menu, [key]: value}
        }));
    }

    function updateNavigationButtons(key, value) {
        setSettings(prev => ({
            ...prev,
            menu: {
                ...prev.menu,
                navigation_buttons: {
                    ...prev.menu.navigation_buttons,
                    [key]: value
                }
            }
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
                        {/* Navbar Hidden Toggle */}
                        <div className="flex items-center justify-between p-4 mt-8 border border-gray-700 rounded-lg">
                            <div>
                                <label className="block text-sm font-semibold text-secondary mb-1 select-none">
                                    Hide Navbar
                                </label>
                                <p className="text-xs text-gray-500">
                                    Hides the navigation bar while reading
                                </p>
                            </div>
                            <div className={"flex justify-center items-center gap-2"}>
                                <button
                                    onClick={() =>
                                        setSettings((prev) => ({
                                            ...prev,
                                            menu: {
                                                ...prev.menu,
                                                navbar_hidden: !prev.menu.navbar_hidden,
                                            },
                                        }))
                                    }
                                    className={`p-0 border-0 font-normal normal-case relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        settings.menu.navbar_hidden ? 'bg-primary' : 'bg-gray-700'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            settings.menu.navbar_hidden ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                                {editMode &&
                                    <button className="text-secondary p-2 hover:scale-100 border-2"
                                            onClick={() => handleRestore("menu.navigation_buttons.icon_stroke_size")}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                             className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                            <path fillRule="evenodd"
                                                  d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                            <path
                                                d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                        </svg>
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Enter any colors you want or <b><i>transparent</i></b> if you want it to be see-through</p>
                </div>


                {/* Navigation Buttons Section */}
                <div className="p-4 border border-gray-700 rounded-lg bg-main_background">
                    <h2 className="text-lg font-semibold text-secondary mb-4">Navigation Buttons</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Icon Size */}
                        <div>
                            <label className="block text-sm font-semibold text-secondary mb-2 select-none">Icon
                                Size</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={settings.menu.navigation_buttons.icon_size}
                                    onChange={(e) => updateNavigationButtons('icon_size', e.target.value)}
                                    placeholder="1.5rem"
                                    className="flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                                />
                                <button className="text-secondary p-2 hover:scale-100 border-2"
                                        onClick={() => handleRestore("menu.navigation_buttons.icon_size")}>
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

                        {/* Icon Color */}
                        <div>
                            <label className="block text-sm font-semibold text-secondary mb-2 select-none">Icon
                                Color</label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={settings.menu.navigation_buttons.icon_color}
                                    onChange={(e) => updateNavigationButtons('icon_color', e.target.value)}
                                    className="w-12 h-10 flex-shrink-0 rounded border border-gray-700 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={settings.menu.navigation_buttons.icon_color}
                                    onChange={(e) => updateNavigationButtons('icon_color', e.target.value)}
                                    placeholder="#fafafa"
                                    className="flex-1 min-w-0 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                                />
                                <button className="text-secondary p-2 hover:scale-100 border-2"
                                        onClick={() => handleRestore("menu.navigation_buttons.icon_color")}>
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

                        {/* Icon Stroke Size */}
                        <div>
                            <label className="block text-sm font-semibold text-secondary mb-2 select-none">Icon Stroke
                                Size</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={settings.menu.navigation_buttons.icon_stroke_size}
                                    onChange={(e) => updateNavigationButtons('icon_stroke_size', Number(e.target.value))}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    className="w-24 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                                />
                                <input
                                    type="range"
                                    min="1"
                                    max="8"
                                    value={settings.menu.navigation_buttons.icon_stroke_size}
                                    onChange={(e) => updateNavigationButtons('icon_stroke_size', Number(e.target.value))}
                                    className="flex-1"
                                />
                                <button className="text-secondary p-2 hover:scale-100 border-2"
                                        onClick={() => handleRestore("menu.navigation_buttons.icon_stroke_size")}>
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

                        {/* Progress Bar Thickness */}
                        <div>
                            <label className="block text-sm font-semibold text-secondary mb-2 select-none">Progress Bar
                                Thickness</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={settings.menu.navigation_buttons.progress_bar_thickness}
                                    onChange={(e) => updateNavigationButtons('progress_bar_thickness', Number(e.target.value))}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    className="w-24 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                                />
                                <input
                                    type="range"
                                    min="1"
                                    max="12"
                                    value={settings.menu.navigation_buttons.progress_bar_thickness}
                                    onChange={(e) => updateNavigationButtons('progress_bar_thickness', Number(e.target.value))}
                                    className="flex-1"
                                />
                                <button className="text-secondary p-2 hover:scale-100 border-2"
                                        onClick={() => handleRestore("menu.navigation_buttons.progress_bar_thickness")}>
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

                        {/* Background Color */}
                        <div>
                            <label className="block text-sm font-semibold text-secondary mb-2 select-none">Background
                                Color</label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={settings.menu.navigation_buttons.background_color}
                                    onChange={(e) => updateNavigationButtons('background_color', e.target.value)}
                                    className="w-12 h-10 flex-shrink-0 rounded border border-gray-700 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={settings.menu.navigation_buttons.background_color}
                                    onChange={(e) => updateNavigationButtons('background_color', e.target.value)}
                                    placeholder="#0c0c0c"
                                    className="flex-1 min-w-0 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                                />
                                <button className="text-secondary p-2 hover:scale-100 border-2"
                                        onClick={() => handleRestore("menu.navigation_buttons.background_color")}>
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

                        {/* Background Color Hover */}
                        <div>
                            <label className="block text-sm font-semibold text-secondary mb-2 select-none">Background
                                Color (Hover only for small devices)</label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={settings.menu.navigation_buttons.background_color_hover}
                                    onChange={(e) => updateNavigationButtons('background_color_hover', e.target.value)}
                                    className="w-12 h-10 flex-shrink-0 rounded border border-gray-700 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={settings.menu.navigation_buttons.background_color_hover}
                                    onChange={(e) => updateNavigationButtons('background_color_hover', e.target.value)}
                                    placeholder="#5e42cf"
                                    className="flex-1 min-w-0 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                                />
                                <button className="text-secondary p-2 hover:scale-100 border-2"
                                        onClick={() => handleRestore("menu.navigation_buttons.background_color_hover")}>
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

                        {/* Border Width */}
                        <div>
                            <label className="block text-sm font-semibold text-secondary mb-2 select-none">Border
                                Width</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={settings.menu.navigation_buttons.border_width}
                                    onChange={(e) => updateNavigationButtons('border_width', e.target.value)}
                                    placeholder="4px"
                                    className="flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                                />
                                <button className="text-secondary p-2 hover:scale-100 border-2"
                                        onClick={() => handleRestore("menu.navigation_buttons.border_width")}>
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

                        {/* Border Color */}
                        <div>
                            <label className="block text-sm font-semibold text-secondary mb-2 select-none">Border
                                Color</label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={settings.menu.navigation_buttons.border_color}
                                    onChange={(e) => updateNavigationButtons('border_color', e.target.value)}
                                    className="w-12 h-10 flex-shrink-0 rounded border border-gray-700 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={settings.menu.navigation_buttons.border_color}
                                    onChange={(e) => updateNavigationButtons('border_color', e.target.value)}
                                    placeholder="#5e42cf"
                                    className="flex-1 min-w-0 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                                />
                                <button className="text-secondary p-2 hover:scale-100 border-2"
                                        onClick={() => handleRestore("menu.navigation_buttons.border_color")}>
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

                        {/* Border Radius */}
                        <div>
                            <label className="block text-sm font-semibold text-secondary mb-2 select-none">Border
                                Radius</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={settings.menu.navigation_buttons.border_radius}
                                    onChange={(e) => updateNavigationButtons('border_radius', e.target.value)}
                                    placeholder="99px"
                                    className="flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                                />
                                <button className="text-secondary p-2 hover:scale-100 border-2"
                                        onClick={() => handleRestore("menu.navigation_buttons.border_radius")}>
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

                        {/* Padding */}
                        <div>
                            <label
                                className="block text-sm font-semibold text-secondary mb-2 select-none">Padding</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={settings.menu.navigation_buttons.padding}
                                    onChange={(e) => updateNavigationButtons('padding', e.target.value)}
                                    placeholder="12px"
                                    className="flex-1 px-3 py-2 bg-main_background border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
                                />
                                <button className="text-secondary p-2 hover:scale-100 border-2"
                                        onClick={() => handleRestore("menu.navigation_buttons.padding")}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                         className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                        <path fillRule="evenodd"
                                              d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                        <path
                                            d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                    </svg>
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">e.g., &quot;10px&quot;, &quot;5px 10px&quot;, &quot;5px 10px 15px 20px&quot;, &quot;1rem 2rem&quot;</p>
                        </div>
                    </div>
                </div>

                {/* Preview Section */}

                {/* Navigation Buttons Preview */}
                <div className="mt-6 p-4 border border-gray-700 rounded-lg bg-main_background">
                    <p className="text-xs text-gray-400 mb-2 select-none">Preview:</p>

                    <div className="space-y-4">
                        {!settings.menu.navbar_hidden && (
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
                        )}
                        {/* Back Button */}
                        <div>
                            <p className="text-xs text-gray-500 mb-2 select-none">Back Button:</p>
                            <button
                                onMouseEnter={() => setIsHoveredBack(true)}
                                onMouseLeave={() => setIsHoveredBack(false)}
                                className="transition-all"
                                style={{
                                    backgroundColor: isHoveredBack
                                        ? settings.menu.navigation_buttons.background_color_hover
                                        : settings.menu.navigation_buttons.background_color,
                                    border: `${settings.menu.navigation_buttons.border_width} solid ${settings.menu.navigation_buttons.border_color}`,
                                    borderRadius: settings.menu.navigation_buttons.border_radius,
                                    padding: settings.menu.navigation_buttons.padding
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={settings.menu.navigation_buttons.icon_stroke_size}
                                    stroke={settings.menu.navigation_buttons.icon_color}
                                    style={{
                                        width: settings.menu.navigation_buttons.icon_size,
                                        height: settings.menu.navigation_buttons.icon_size
                                    }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
                                </svg>
                            </button>
                        </div>

                        {/* Chapter Navigation */}
                        <div>
                            <p className="text-xs text-gray-500 mb-2 select-none">Chapter Navigation:</p>
                            <div className="flex justify-between items-center">
                                {/* Previous Button */}
                                <button
                                    onMouseEnter={() => setIsHoveredPrevious(true)}
                                    onMouseLeave={() => setIsHoveredPrevious(false)}
                                    className="transition-all"
                                    style={{
                                        backgroundColor: isHoveredPrevious
                                            ? settings.menu.navigation_buttons.background_color_hover
                                            : settings.menu.navigation_buttons.background_color,
                                        border: `${settings.menu.navigation_buttons.border_width} solid ${settings.menu.navigation_buttons.border_color}`,
                                        borderRadius: settings.menu.navigation_buttons.border_radius,
                                        padding: settings.menu.navigation_buttons.padding
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={settings.menu.navigation_buttons.icon_stroke_size}
                                        stroke={settings.menu.navigation_buttons.icon_color}
                                        style={{
                                            width: settings.menu.navigation_buttons.icon_size,
                                            height: settings.menu.navigation_buttons.icon_size
                                        }}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M15.75 19.5 8.25 12l7.5-7.5"/>
                                    </svg>
                                </button>

                                {/* Next Button with Loading State */}
                                <button
                                    onMouseEnter={() => setIsHoveredNext(true)}
                                    onMouseLeave={() => setIsHoveredNext(false)}
                                    className="transition-all disabled:opacity-60"
                                    disabled={true}
                                    style={{
                                        backgroundColor: isHoveredNext
                                            ? settings.menu.navigation_buttons.background_color_hover
                                            : settings.menu.navigation_buttons.background_color,
                                        border: `${settings.menu.navigation_buttons.border_width} solid ${settings.menu.navigation_buttons.border_color}`,
                                        borderRadius: settings.menu.navigation_buttons.border_radius,
                                        padding: settings.menu.navigation_buttons.padding
                                    }}
                                >
                                    <CircularProgress
                                        sx={{color: settings.menu.navigation_buttons.icon_color}}
                                        size={settings.menu.navigation_buttons.icon_size}
                                        thickness={settings.menu.navigation_buttons.progress_bar_thickness}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NavigationTab;