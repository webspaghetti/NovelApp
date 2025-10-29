"use client"
import Link from "next/link";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";


function ChapterNavigation({ prevChapter, nextChapter, currentChapter, chapterCount, formattedName, source, customizationTemplate }) {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingButton, setLoadingButton] = useState(null);
    const [isHoveredNext, setIsHoveredNext] = useState(false);
    const [isHoveredPrevious, setIsHoveredPrevious] = useState(false);


    return (
        <div className="flex justify-between py-4">
            {currentChapter > 1 && (
                <Link className={`disabled:${isLoading} ${isLoading ? 'opacity-60' : ''}`} href={`/${formattedName}/${prevChapter}?${source}`} onClick={() => {
                    setIsLoading(true)
                    setLoadingButton("Previous")
                }}>
                    <button aria-label={"Previous chapter"}
                            className={"sm:hover:scale-[1.02]"}
                            disabled={isLoading}
                            onMouseEnter={() => setIsHoveredPrevious(true)}
                            onMouseLeave={() => setIsHoveredPrevious(false)}
                            style={{
                        backgroundColor: isHoveredPrevious
                            ? customizationTemplate.menu.navigation_buttons.background_color_hover
                            : customizationTemplate.menu.navigation_buttons.background_color,
                        border: `${customizationTemplate.menu.navigation_buttons.border_width} solid ${customizationTemplate.menu.navigation_buttons.border_color}`,
                        borderRadius: customizationTemplate.menu.navigation_buttons.border_radius,
                        margin: customizationTemplate.menu.navigation_buttons.margin,
                        padding: customizationTemplate.menu.navigation_buttons.padding
                    }}>
                        {isLoading && loadingButton === "Previous" ? (
                            <CircularProgress sx={{color: customizationTemplate.menu.navigation_buttons.icon_color}} size={customizationTemplate.menu.navigation_buttons.icon_size} thickness={customizationTemplate.menu.navigation_buttons.progress_bar_thickness} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={customizationTemplate.menu.navigation_buttons.icon_stroke_size} stroke={`${customizationTemplate.menu.navigation_buttons.icon_color}`} style={{
                                width: customizationTemplate.menu.navigation_buttons.icon_size,
                                height: customizationTemplate.menu.navigation_buttons.icon_size
                            }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        )}
                    </button>
                </Link>
            )}

            {currentChapter === 1 && <div />}

            {currentChapter < chapterCount && (

                <Link className={`disabled:${isLoading} ${isLoading ? 'opacity-60' : ''}`} href={`/${formattedName}/${nextChapter}?${source}`} onClick={() => {
                    setIsLoading(true)
                    setLoadingButton("Next")
                }}>
                    <button aria-label={"Next chapter"}
                            className={"sm:hover:scale-[1.02]"}
                            disabled={isLoading}
                            onMouseEnter={() => setIsHoveredNext(true)}
                            onMouseLeave={() => setIsHoveredNext(false)}
                            style={{
                                backgroundColor: isHoveredNext
                                    ? customizationTemplate.menu.navigation_buttons.background_color_hover
                                    : customizationTemplate.menu.navigation_buttons.background_color,
                                border: `${customizationTemplate.menu.navigation_buttons.border_width} solid ${customizationTemplate.menu.navigation_buttons.border_color}`,
                                borderRadius: customizationTemplate.menu.navigation_buttons.border_radius,
                                margin: customizationTemplate.menu.navigation_buttons.margin,
                                padding: customizationTemplate.menu.navigation_buttons.padding
                            }}>
                        {isLoading && loadingButton === "Next" ? (
                            <CircularProgress sx={{color: customizationTemplate.menu.navigation_buttons.icon_color}} size={customizationTemplate.menu.navigation_buttons.icon_size} thickness={customizationTemplate.menu.navigation_buttons.progress_bar_thickness} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={customizationTemplate.menu.navigation_buttons.icon_stroke_size} stroke={`${customizationTemplate.menu.navigation_buttons.icon_color}`} style={{
                                width: customizationTemplate.menu.navigation_buttons.icon_size,
                                height: customizationTemplate.menu.navigation_buttons.icon_size
                            }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        )}
                    </button>
                </Link>
            )}
        </div>
    );
}


export default ChapterNavigation;