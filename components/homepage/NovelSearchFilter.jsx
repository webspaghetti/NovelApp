"use client"
import React, { useState } from "react";


function NovelSearchFilter({onSearchChange, onStatusFilter, onSortChange, onTemplateChange, currentStatus, currentSort, userTemplateList, smallTemplateId, normalTemplateId}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const [smallGeneralTemplate, setSmallGeneralTemplate] = useState(smallTemplateId)
    const [normalGeneralTemplate, setNormalGeneralTemplate] = useState(normalTemplateId)


    const adjustedTemplateList = userTemplateList.map(template => {
        let newName = template.name;

        // Replace specific name
        if (newName === 'default-general') {
            newName = 'Default General';
        }

        return { ...template, name: newName };
    });


    function handleSearchChange(e) {
        const value = e.target.value;
        setSearchTerm(value);
        onSearchChange(value);
    }

    function clearSearch() {
        setSearchTerm("");
        onSearchChange("");
    }

    function handleNormalTemplateChange(e) {
        const templateId = Number(e.target.value);
        const newTemplate = adjustedTemplateList.find(t => t.id === templateId);

        if (newTemplate?.customization) {
            setNormalGeneralTemplate(templateId);
            onTemplateChange('normal', templateId);
        }
    }

    function handleSmallTemplateChange(e) {
        const templateId = Number(e.target.value);
        const newTemplate = adjustedTemplateList.find(t => t.id === templateId);

        if (newTemplate?.customization) {
            setSmallGeneralTemplate(templateId);
            onTemplateChange('small', templateId);
        }
    }


    return (
        <div className="w-full space-y-4 relative top-[76px] max-sm:top-[70px] mb-4 px-2 sm:px-0">
            <div className={"flex justify-between max-sm:gap-10 max-md:gap-20 max-lg:gap-36 gap-52"}>
                <div className={"flex gap-1 items-center w-full"}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9 max-sm:size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                    </svg>
                    <select
                        id="normalTemplate"
                        className="w-full flex-1 select-none bg-navbar border border-gray-700 rounded-lg text-secondary py-2 px-3 focus:outline-none focus:border-secondary disabled:opacity-60 text-sm sm:text-base"
                        value={normalGeneralTemplate}
                        onChange={handleNormalTemplateChange}
                    >
                        {adjustedTemplateList.map(template => (
                            <option key={template.id} value={template.id}>
                                {template.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={"flex gap-1 items-center w-full"}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9 max-sm:size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                    <select
                        id="smallTemplate"
                        className="w-full flex-1 select-none bg-navbar border border-gray-700 rounded-lg text-secondary py-2 px-3 focus:outline-none focus:border-secondary disabled:opacity-60 text-sm sm:text-base"
                        value={smallGeneralTemplate}
                        onChange={handleSmallTemplateChange}
                    >
                        {adjustedTemplateList.map(template => (
                            <option key={template.id} value={template.id}>
                                {template.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {/* Search + Filter Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 border border-gray-600 bg-navbar rounded-lg px-2 py-2 focus-within:border-primary transition-all">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-5 sm:size-6"
                      >
                        <path
                            fillRule="evenodd"
                            d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                            clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Search novels by name"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="select-none w-full bg-transparent border-none text-secondary pl-10 pr-10 py-2 leading-tight focus:outline-none caret-primary placeholder-gray-500"
                    />
                    {searchTerm && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 sm:hover:scale-105 transition-transform">
                            <button
                                onClick={clearSearch}
                                className="p-1 rounded-lg bg-red-600 sm:hover:bg-red-700 border border-red-600"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="size-4 sm:size-5"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                {/* Filter Toggle Button */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-primary sm:hover:bg-opacity-80 text-secondary font-semibold rounded-lg shadow-sm transition-all text-base normal-case"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="size-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                        />
                    </svg>
                    Filters
                    <span className="text-xs text-secondary">
                        {showFilters ? "▲" : "▼"}
                    </span>
                </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
                <div
                    className={`grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-4 bg-main_background border border-gray-700 rounded-2xl transition-all overflow-hidden ${
                        showFilters ? "max-h-[1000px]" : "max-h-0"
                    }`}
                >                    {/* Status Filter */}
                    <div className={'relative'}>
                        <label className="block text-sm font-semibold text-secondary mb-2">
                            Status
                        </label>
                        <select
                            value={currentStatus}
                            onChange={(e) => onStatusFilter(e.target.value)}
                            className="appearance-none w-full px-3 py-2 bg-navbar border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        >
                            <option value="all">All Status</option>
                            <option value="Completed">Completed</option>
                            <option value="OnGoing">On Going</option>
                            <option value="Hiatus">Hiatus</option>
                        </select>

                        {/* Dropdown Arrow */}
                        <div className="pointer-events-none absolute top-1/2 inset-y-0 right-3 flex items-center">
                            <svg
                                className="h-6 w-6 text-secondary"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 12a1 1 0 01-.7-.3l-4-4a1 1 0 111.4-1.4L10 9.6l3.3-3.3a1 1 0 011.4 1.4l-4 4a1 1 0 01-.7.3z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div className={"relative"}>
                        <label className="block text-sm font-semibold text-secondary mb-2">
                            Sort By
                        </label>
                        <select
                            value={currentSort}
                            onChange={(e) => onSortChange(e.target.value)}
                            className="appearance-none w-full px-3 py-2 bg-navbar border border-gray-700 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        >
                            <option value="added-asc">Latest Added</option>
                            <option value="added-desc">Oldest Added</option>
                            <option value="last-read">Last Read</option>
                            <option value="oldest-read">Oldest Read</option>
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value="progress-asc">Progress (Low to High)</option>
                            <option value="progress-desc">Progress (High to Low)</option>
                            <option value="update-newest">Latest Update (Newest)</option>
                            <option value="update-oldest">Latest Update (Oldest)</option>
                            <option value="chapters-asc">Chapter Count (Low to High)</option>
                            <option value="chapters-desc">Chapter Count (High to Low)</option>
                        </select>

                        {/* Dropdown Arrow */}
                        <div className="pointer-events-none absolute top-1/2 inset-y-0 right-3 flex items-center">
                            <svg
                                className="h-6 w-6 text-secondary"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 12a1 1 0 01-.7-.3l-4-4a1 1 0 111.4-1.4L10 9.6l3.3-3.3a1 1 0 011.4 1.4l-4 4a1 1 0 01-.7.3z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


export default NovelSearchFilter;