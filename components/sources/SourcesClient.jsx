"use client"
import React, { useEffect, useMemo, useState } from "react";
import NavBar from "@/components/general/layout/NavBar";
import BodyStyler from "@/components/general/BodyStyler";
import sourceConfig from "@/config/sourceConfig";


function SourcesClient({ templateList, userObject }){
    const sources = Object.entries(sourceConfig).map(([key, config]) => ({
        id: key,
        name: key.split(/(?=[A-Z])/).map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        ...config
    }));

    const { normal_general_template_id: normalTemplateId, small_general_template_id: smallTemplateId } = userObject[0] || {};

    const normalTemplate = templateList.find(t => t.id === normalTemplateId);
    const smallTemplate = templateList.find(t => t.id === smallTemplateId);

    // Memoize the parsed templates
    const normalTemplateData = useMemo(() =>
            JSON.parse(normalTemplate.customization),
        [normalTemplate]
    );

    const smallTemplateData = useMemo(() =>
            JSON.parse(smallTemplate.customization),
        [smallTemplate]
    );

    const [isSmallScreen, setIsSmallScreen] = useState(false);

    const customizationTemplate = isSmallScreen ? smallTemplateData : normalTemplateData;

    // Screen size detection
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 640px)");
        setIsSmallScreen(mediaQuery.matches);

        function handleChange(e) {
            setIsSmallScreen(e.matches);
        }

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return (
        <>
            <BodyStyler customizationTemplate={customizationTemplate} />
            <NavBar customizationTemplate={customizationTemplate} />
            <div>
                {/* Header Section */}
                <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
                    {/* Sources Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                        {sources.map((source) => (
                            <a
                                key={source.id}
                                href={source.source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative bg-gradient-to-b from-main_background to-[#070707] rounded-2xl p-6 border border-gray-800 hover:border-primary/50 transition-all duration-300"
                            >
                                <div className="relative flex flex-col items-center text-center space-y-6">
                                    {/* Logo Container */}
                                    <div className="relative w-full h-32 flex items-center justify-center">
                                        <img
                                            src={source.logo_url}
                                            alt={`${source.name} logo`}
                                            className="relative max-h-24 max-w-full object-contain filter drop-shadow-2xl"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextElementSibling.style.display = 'flex';
                                            }}
                                        />
                                        {/* Fallback if logo fails to load */}
                                        <div className="hidden flex-col items-center justify-center">
                                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M12 7v14"/>
                                                    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white">{source.name}</h3>
                                        </div>
                                    </div>

                                    {/* Source Name */}
                                    <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
                                        {source.name}
                                    </h3>

                                    {/* Source URL */}
                                    <div className="flex items-center gap-2 text-gray-400 group-hover:text-purple-300 transition-colors duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                                        </svg>
                                        <span className="text-sm font-medium break-all">
                                                    {source.source.replace('https://', '')}
                                                </span>
                                    </div>

                                    {/* Visit button */}
                                    <div className="pt-4 flex items-center gap-2 text-purple-400 group-hover:gap-3 transition-all duration-300">
                                        <span className="text-sm font-semibold">Visit Website</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-300">
                                            <path d="M5 12h14"/>
                                            <path d="m12 5 7 7-7 7"/>
                                        </svg>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* Footer Info */}
                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-pink-500/10 border border-purple-500/20 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 16v-4"/>
                                <path d="M12 8h.01"/>
                            </svg>
                            <span className="text-gray-300 text-sm">
                                        Currently <strong className="text-purple-400">{sources.length}</strong> novel sources active
                                    </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


export default SourcesClient;