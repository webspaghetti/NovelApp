import React from "react";

function NovelProfileCard({ novelData, title, icon, subtitle, showCaseData }) {
    if (!novelData) {
        return (
            <div className="bg-gradient-to-b from-main_background to-[#070707] rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center gap-3 mb-4">
                    {icon}
                    <h3 className="text-lg font-semibold">{title}</h3>
                </div>
                <p className="text-gray-400">No novels to show</p>
            </div>
        );
    }

    const {novel, userNovel} = novelData;

    return (
        <div
            className="bg-gradient-to-b from-main_background to-[#070707] rounded-2xl overflow-hidden border border-gray-800 hover:border-primary/50 transition-all duration-300 group">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                    {icon}
                    <span className="text-sm text-gray-400 font-medium">{title} {showCaseData}</span>
                </div>

                <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {userNovel?.name_alternative ?? novel.name}
                </h3>

                {subtitle && (
                    <p className="text-sm text-gray-400 mb-4">{subtitle}</p>
                )}

                <div className="relative overflow-hidden">
                    <img
                        src={userNovel?.image_url_alternative ?? novel.image_url}
                        alt={novel.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 select-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
                    <div className={`badge ${novel.status} absolute max-sm:top-[6px] top-2 max-sm:right-[6px] right-2`}>
                            <span>
                                {novel.status === "Completed" && (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth={5} stroke="currentColor" className="max-sm:size-3 size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="m4.5 12.75 6 6 9-13.5"/>
                                        </svg>
                                    </>
                                )}
                                {novel.status === "OnGoing" && (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                             className="max-sm:size-4 size-5">
                                            <path fillRule="evenodd"
                                                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </>
                                )}
                                {novel.status === "Hiatus" && (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth={5} stroke="currentColor" className="max-sm:size-3 size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M15.75 5.25v13.5m-7.5-13.5v13.5"/>
                                        </svg>
                                    </>
                                )}
                            </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NovelProfileCard;