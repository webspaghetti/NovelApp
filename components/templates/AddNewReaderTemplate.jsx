"use client"
import React, { useEffect, useState } from 'react';
import { Inter } from "next/font/google";
import CircularProgress from "@mui/material/CircularProgress";
import AlertDialog from "@/components/general/AlertDialog";
import TextTab from "@/components/templates/tabs/reader/TextTab";
import TitleTab from "@/components/templates/tabs/reader/TitleTab";
import BackgroundTab from "@/components/templates/tabs/reader/BackgroundTab";
import ColorsTab from "@/components/templates/tabs/reader/ColorsTab";
import TextSpacingTab from "@/components/templates/tabs/reader/TextSpacingTab";
import OtherTab from "@/components/templates/tabs/reader/OtherTab";
import TitleSpacingTab from "@/components/templates/tabs/reader/TitleSpacingTab";
import InputDialog from "@/components/general/InputDialog";
import TabsReaderButtons from "@/components/templates/general/TabsReaderButtons";
import NavigationTab from "@/components/templates/tabs/reader/NavigationTab";


const inter = Inter({ subsets: ["latin"] });


function AddNewReaderTemplate({ userId, userTemplateList }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('text');

    const [templateName, setTemplateName] = useState("")
    const [dialogErrorMessage, setDialogErrorMessage] = useState("")

    const [isResetAlertOpen, setIsResetAlertOpen] = useState(false);
    const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);
    const [isInputDialogOpen, setIsInputDialogOpen] = useState(false)

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


    const smallDefaultObject = userTemplateList.find(t => t.name === 'small-default-reader');
    const normalDefaultObject = userTemplateList.find(t => t.name === 'normal-default-reader');

    const defaultSettings = isSmallScreen ? JSON.parse(smallDefaultObject.customization) : JSON.parse(normalDefaultObject.customization);

    const [settings, setSettings] = useState(defaultSettings);
    const [selectedPreset, setSelectedPreset] = useState(defaultSettings)


    const adjustedTemplateList = userTemplateList.map(template => {
        let newName = template.name;

        // Replace specific names
        if (newName === 'normal-default-reader') {
            newName = 'Normal Default Reader';
        } else if (newName === 'small-default-reader') {
            newName = 'Small Default Reader';
        }

        return { ...template, name: newName };
    });


    function handleClose(){
        setIsCancelAlertOpen(false)
        setIsDialogOpen(false);
        setSettings(defaultSettings);
        setSelectedPreset(defaultSettings)
        setActiveTab('text')
    }

    async function handleSave() {
        setIsLoading(true);

        function deepMergeWithDefaults(defaults, user) {
            const result = { ...defaults };
            for (const key in defaults) {
                const userValue = user?.[key];
                if (typeof defaults[key] === "object" && !Array.isArray(defaults[key])) {
                    // Recursively merge nested objects
                    result[key] = deepMergeWithDefaults(defaults[key], userValue || {});
                } else {
                    // Replace empty strings or undefined/null with defaults
                    result[key] =
                        userValue === "" || userValue === undefined || userValue === null
                            ? defaults[key]
                            : userValue;
                }
            }
            return result;
        }

        const mergedSettings = deepMergeWithDefaults(defaultSettings, settings);

        let templates;

        try {
            const response = await fetch(`/api/templates?userId=${encodeURIComponent(userId)}`);

            if (!response.ok) {
                throw new Error('Failed to fetch customization templates');
            }

            templates = await response.json();

        }  catch (error) {
            console.error("Error:", error.message);
            setDialogErrorMessage("Error getting customization templates names")
        }

        const duplicate = templates.find(t => t.name === templateName);

        if (duplicate) {
            setDialogErrorMessage(`Template with the name "${templateName}" already exists`)
            setIsLoading(false)
            return;
        }


        try {
            const response = await fetch('/api/templates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    templateName: templateName,
                    readerCustomization: mergedSettings,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create customization template');
            }

            setTimeout(() => {
                location.reload();
            }, 0);
        }  catch (error) {
            console.error("Error:", error.message);
            setDialogErrorMessage("Error creating customization template")
        }
    }


    async function handleRestore(fieldPath) {
        setSettings(prevSettings => {
            const newSettings = { ...prevSettings };
            const keys = fieldPath.split('.');

            if (keys.length === 1) {
                // Top-level field
                newSettings[keys[0]] = selectedPreset[keys[0]];
            } else {
                // Nested field
                let current = newSettings;
                for (let i = 0; i < keys.length - 1; i++) {
                    current = current[keys[i]];
                }
                const lastKey = keys[keys.length - 1];

                // Get the default value from the same path
                let defaultValue = selectedPreset;
                for (const key of keys) {
                    defaultValue = defaultValue[key];
                }

                current[lastKey] = defaultValue;
            }

            return newSettings;
        });
    }

    function handleReset() {
        setIsResetAlertOpen(false)
        setSettings(selectedPreset);
    }


    const outlineOptions = ['none', 'thin', 'thick'];
    const fontWeightOptions = ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
    const spacingPresets = {
        word_spacing: ['normal', '0.05em', '0.1em', '0.15em', '0.2em'],
        letter_spacing: ['normal', '0.025em', '0.05em', '0.075em', '0.1em', '0.15em']
    };


    return (
        <>
            <button
                aria-label="Add Reader Customization Template"
                className="group relative max-sm:px-4 max-sm:py-6 px-6 py-8 text-sm text-gray-400 flex flex-col items-center justify-center bg-main_background border-2 border-dashed border-gray-700 rounded-xl sm:hover:border-green-500/50 sm:hover:bg-gray-800/50 transition-all duration-300"
                onClick={() => setIsDialogOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="max-sm:size-12 size-16 max-sm:mb-2 mb-3 sm:group-hover:scale-105 sm:group-hover:text-green-500 transition-all duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span className="text-xs font-medium sm:group-hover:text-green-500 transition-colors">
                    Create Template
                </span>
            </button>

            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
                    <div className="bg-gradient-to-b from-main_background to-[#070707] border border-gray-700 sm:rounded-2xl max-sm:px-3 p-6 shadow-2xl max-sm:min-w-[100vw] sm:w-full max-w-7xl animate-fadeIn max-sm:max-h-[100vh] max-h-[90vh] flex flex-col">
                        <div className={"flex gap-2 text-secondary items-center max-sm:justify-center"}>
                            <h2 className="text-2xl font-bold mb-2 text-secondary select-none">Create Reader Template</h2>
                            {isSmallScreen ?
                                (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                                    </svg>
                                )
                            }
                        </div>


                        <p className="text-gray-400 text-sm mb-6 select-none max-sm:text-center">Personalize your reading experience</p>


                        {/* Tabs */}
                        <TabsReaderButtons activeTab={activeTab} setActiveTab={setActiveTab} isLoading={isLoading} />


                        {/* Content Area */}
                        <div className={`overflow-y-auto flex-1 p-0.5 mb-4 ${isLoading ? 'pointer-events-none opacity-60' : ''}`} aria-disabled={isLoading}>
                            {/* Text Tab */}
                            {activeTab === 'text' && (
                                <TextTab settings={settings} setSettings={setSettings} handleRestore={handleRestore} fontWeightOptions={fontWeightOptions} outlineOptions={outlineOptions} inter={inter} />
                            )}

                            {/* Title Tab */}
                            {activeTab === 'title' && (
                                <TitleTab settings={settings} setSettings={setSettings} handleRestore={handleRestore} fontWeightOptions={fontWeightOptions} outlineOptions={outlineOptions} inter={inter} />
                            )}

                            {/* Colors Tab */}
                            {activeTab === 'colors' && (
                                <ColorsTab settings={settings} setSettings={setSettings} handleRestore={handleRestore} />
                            )}

                            {/* Text Spacing Tab */}
                            {activeTab === 'text-spacing' && (
                                <TextSpacingTab settings={settings} setSettings={setSettings} handleRestore={handleRestore} spacingPresets={spacingPresets} inter={inter} />
                            )}

                            {/* Title Spacing Tab */}
                            {activeTab === 'title-spacing' && (
                                <TitleSpacingTab settings={settings} setSettings={setSettings} handleRestore={handleRestore} spacingPresets={spacingPresets} inter={inter} />
                            )}

                            {/* Background Tab */}
                            {activeTab === 'background' && (
                                <BackgroundTab settings={settings} setSettings={setSettings} handleRestore={handleRestore} />
                            )}

                            {/* Navigation Tab */}
                            {activeTab === 'navigation' && (
                                <NavigationTab settings={settings} setSettings={setSettings} handleRestore={handleRestore} editMode={false} />
                            )}

                            {/* Other Tab */}
                            {activeTab === 'other' && (
                                <OtherTab settings={settings} setSettings={setSettings} inter={inter} />
                            )}
                        </div>


                        <div className={"flex justify-between max-sm:hidden"}>
                            <p className="text-xs text-gray-500 text-left mb-3">* Choose a starting preset from your existing templates</p>
                            <p className="text-xs text-gray-500 text-right mb-3">* Empty values will be replaced by their default counterparts</p>
                        </div>


                        {/* Action Buttons */}
                        <div className="flex max-sm:flex-col flex-row gap-3 max-sm:pt-0 pt-4 max-sm:border-none border-t border-gray-700/50">
                            {/* Top row on mobile: Select */}
                            <div className="max-sm:w-full w-auto">
                                <select
                                    onChange={(e) => {
                                        const templateId = Number(e.target.value);
                                        const newTemplate = adjustedTemplateList.find(t => t.id === templateId);

                                        if (newTemplate?.customization) {
                                            setSelectedPreset(JSON.parse(newTemplate.customization))
                                            setSettings(JSON.parse(newTemplate.customization));
                                        }
                                    }}
                                    className="w-full flex-none px-3 py-2 bg-navbar border border-gray-700 rounded-lg text-secondary focus:outline-none focus:border-primary transition-colors"
                                >
                                    <option value="" disabled={true}>Select a template</option>
                                    {adjustedTemplateList.map((template) => (
                                        <option key={template.id} value={template.id}>
                                            {template.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Spacer */}
                            <div className="max-sm:hidden block sm:flex-1" />


                            <div className="flex gap-2 max-sm:w-full w-auto">
                                {/* Reset Button */}
                                <button
                                    onClick={() => setIsResetAlertOpen(true)}
                                    disabled={isLoading}
                                    className="px-3 py-2 text-sm text-gray-400 hover:text-secondary bg-main_background border border-gray-700 rounded-lg hover:bg-gray-800 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                        <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                    </svg>
                                    <span className="max-lg:hidden">Reset to Defaults</span>
                                </button>

                                {/* Cancel Button */}
                                <button
                                    onClick={JSON.stringify(settings) === JSON.stringify(selectedPreset) ? handleClose : () => setIsCancelAlertOpen(true)}
                                    disabled={isLoading}
                                    className="max-sm:flex-1 flex-none px-2 py-2 rounded-lg text-secondary disabled:opacity-60 flex items-center justify-center gap-1"
                                >
                                    <span className={"text-red-400"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </span>
                                    <span className="text-sm">Cancel</span>
                                    {JSON.stringify(settings) !== JSON.stringify(selectedPreset) && (
                                        <span className="text-red-400 text-xs">*</span>
                                    )}
                                </button>

                                {/* Create Button */}
                                <button
                                    onClick={() => setIsInputDialogOpen(true)}
                                    disabled={isLoading}
                                    className="max-sm:flex-1 flex-none relative px-3 py-2 rounded-lg bg-green-700 hover:bg-green-800 border-green-800 text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    <span className={isLoading ? 'invisible flex items-center gap-2' : 'flex items-center gap-2'}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                                        </svg>
                                        Create <span className="max-md:hidden">Template</span>
                                    </span>
                                    {isLoading &&
                                        <span className="absolute inset-0 flex items-center justify-center">
                                            <CircularProgress sx={{color: "#FAFAFA"}} size={20} thickness={8} />
                                        </span>
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            <AlertDialog
                isOpen={isCancelAlertOpen}
                title="Leave without saving?"
                message="Are you sure? All changes will be lost."
                confirmText="Leave"
                cancelText="Cancel"
                isLoading={isLoading}
                onConfirm={handleClose}
                onCancel={() => setIsCancelAlertOpen(false)}
            />

            <AlertDialog
                isOpen={isResetAlertOpen}
                title="Reset customization options?"
                message="Are you sure you want to reset all customizations to default?"
                confirmText="Reset"
                cancelText="Cancel"
                isLoading={isLoading}
                onConfirm={handleReset}
                onCancel={() => setIsResetAlertOpen(false)}
            />

            <InputDialog
                isOpen={isInputDialogOpen}
                title="Template Name"
                message="Enter a name for this template"
                placeholder="Template name"
                confirmText="Create"
                onConfirm={handleSave}
                templateName={templateName}
                setTemplateName={setTemplateName}
                onCancel={() => setIsInputDialogOpen(false)}
                error={dialogErrorMessage}
                isLoading={isLoading}
            />
        </>
    );
}


export default AddNewReaderTemplate;