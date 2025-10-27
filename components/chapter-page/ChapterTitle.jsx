"use client"
import { useEffect, useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

function ChapterTitle({ chapter, normalCustomizationTemplate, smallCustomizationTemplate }) {
    const [isSmallScreen, setIsSmallScreen] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia("(max-width: 640px)").matches;
        }
        return false; // Default value for SSR
    });
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 640px)");
        setIsSmallScreen(mediaQuery.matches);
    }, []);

    const customizationTemplate = isSmallScreen ? JSON.parse(smallCustomizationTemplate.customization) : JSON.parse(normalCustomizationTemplate.customization);


    return (
        <h1 className={`text-center pb-6 text_outline ${customizationTemplate.title.outline}`} style={{
            '--shadow-color': customizationTemplate.title.outline_color,
            fontFamily: customizationTemplate.title.family === 'Inter' ? inter.style.fontFamily : customizationTemplate.title.family,
            fontSize: customizationTemplate.title.size,
            fontWeight: customizationTemplate.title.weight,
            color: customizationTemplate.chapter_title_color,
            borderBottom: `${customizationTemplate.text.separator_width} solid ${customizationTemplate.text.separator_color}`,
            lineHeight: customizationTemplate.title_spacing.line_height,
            wordSpacing: customizationTemplate.title_spacing.word_spacing,
            letterSpacing: customizationTemplate.title_spacing.letter_spacing
        }}>
            {chapter.chapterTitle || "Failed to display"}
        </h1>
    )
}


export default ChapterTitle;