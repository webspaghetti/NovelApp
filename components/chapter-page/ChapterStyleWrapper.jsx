"use client";
import { useEffect, useState } from "react";


export default function ChapterStyleWrapper({ children, normalCustomizationTemplate, smallCustomizationTemplate }) {
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
        <div style={{
            backgroundColor: customizationTemplate.background.color,
            backgroundImage: customizationTemplate.background.image !== 'none' ? `url(${customizationTemplate.background.image})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            {children}
        </div>
    );
}