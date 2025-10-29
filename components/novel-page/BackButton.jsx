'use client';

import { useRouter } from 'next/navigation';
import { useState } from "react";


function BackButton({ formattedName, source, customizationTemplate }) {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);

    function handleBack(e) {
        e.preventDefault();
        router.push(`/${formattedName}?${source}`);
        router.refresh();
    }


    return (
        <button onClick={handleBack}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={"mt-2 sm:hover:scale-[1.02]"}
                style={{
                    backgroundColor: isHovered
                        ? customizationTemplate.menu.navigation_buttons.background_color_hover
                        : customizationTemplate.menu.navigation_buttons.background_color,
                    border: `${customizationTemplate.menu.navigation_buttons.border_width} solid ${customizationTemplate.menu.navigation_buttons.border_color}`,
                    borderRadius: customizationTemplate.menu.navigation_buttons.border_radius,
                    margin: customizationTemplate.menu.navigation_buttons.margin,
                    padding: customizationTemplate.menu.navigation_buttons.padding
                }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={customizationTemplate.menu.navigation_buttons.icon_stroke_size} stroke={`${customizationTemplate.menu.navigation_buttons.icon_color}`} style={{
                width: customizationTemplate.menu.navigation_buttons.icon_size,
                height: customizationTemplate.menu.navigation_buttons.icon_size
            }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
        </button>
    );
}


export default BackButton;