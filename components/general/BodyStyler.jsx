"use client"
import { useEffect } from 'react';

export default function BodyStyler({ customizationTemplate }) {
    useEffect(() => {
        // Apply styles to body
        document.body.style.backgroundColor = customizationTemplate.background.color;
        document.body.style.backgroundImage = customizationTemplate.background.image !== 'none'
            ? `url(${customizationTemplate.background.image})`
            : 'none';
        document.body.style.backgroundSize = customizationTemplate.background.size;
        document.body.style.backgroundPosition = customizationTemplate.background.position;
        document.body.style.backgroundAttachment = customizationTemplate.background.attachment;
        document.body.style.backgroundRepeat = customizationTemplate.background.repeat;

        // Cleanup function to reset when component unmounts
        return () => {
            document.body.style.backgroundColor = '';
            document.body.style.backgroundImage = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundPosition = '';
            document.body.style.backgroundAttachment = '';
            document.body.style.backgroundRepeat = '';
        };
    }, [customizationTemplate]);

    return null; // This component doesn't render anything
}