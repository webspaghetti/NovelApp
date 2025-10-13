function NovelPageSkeleton() {
    return (
        <div className="flex max-sm:flex-col flex-row max-sm:items-start justify-center items-center max-sm:gap-3 gap-8 border-b-[3px] border-gray-700 pb-4">
            <div className="w-1/2 max-sm:w-full animate-pulse">
                <div className="bg-gray-700 rounded-lg m-auto max-sm:h-[447px] max-sm:w-[335px] max-md:h-[401px] max-md:w-[301px] h-[467px] w-[350px]" />
            </div>

            <div className="flex flex-col justify-center items-start md:w-1/3 max-sm:w-full gap-1 pt-0 max-sm:pt-1">
                <div className="flex flex-row items-center sm:gap-2 w-full max-sm:hidden">
                    <div className="h-[26px] w-[100px] bg-gray-700 rounded-full animate-pulse mb-4" />
                    <div className="h-6 w-6 bg-gray-700 rounded-full animate-pulse mb-4" />
                </div>

                <div className="h-8 max-sm:h-7 w-3/4 bg-gray-700 rounded-lg animate-pulse mb-2" />
                <div className="h-5 max-sm:h-5 max-sm:w-1/3 w-1/2 bg-gray-700 rounded-lg animate-pulse mb-2 gap-9" />
                <div className="h-4 max-sm:h-3 max-sm:w-2/4 w-2/3 bg-gray-700 rounded-lg animate-pulse" />

                <div className="h-12 max-sm:h-11 w-[195px] max-sm:w-[163px] bg-gray-700 rounded-lg animate-pulse my-2" />

                <div className="w-full bg-gray-700 h-2 mt-1 rounded-xl">
                    <div className="bg-gray-600 h-2 rounded-xl w-0" />
                </div>
            </div>
        </div>
    );
}

function ChapterButtonsSkeleton() {
    return (
        <div className="grid max-sm:grid-cols-3 grid-cols-5 gap-4 justify-center items-center mt-4 pb-4">
            {Array.from({ length: 30 }, (_, index) => (
                <div
                    key={index}
                    className="h-[52px] bg-gray-700 rounded-md animate-pulse"
                />
            ))}
        </div>
    );
}

function ChapterPageSkeleton() {
    return (
        <>
            {/* Back button skeleton */}
            <div className="flex justify-start mb-5">
                <div className="w-[72px] h-[60px] bg-gray-700 rounded-full animate-pulse" />
            </div>

            {/* Chapter title skeleton */}
            <div className="border-b-gray-400 border-b-2 text-center mb-6 pb-6">
                <div className="h-10 w-3/4 bg-gray-700 rounded-lg animate-pulse mx-auto" />
            </div>

            {/* Chapter content skeleton */}
            <div className="text-secondary max-sm:text-base text-lg pb-8 border-b-gray-400 border-b-2">
                <div className="space-y-6">
                    {Array.from({ length: 12 }, (_, index) => (
                        <div key={index} className="flex flex-col space-y-5">
                            <div className="h-6 bg-gray-700 rounded w-full animate-pulse" />
                            <div className="h-6 bg-gray-700 rounded w-[75%] animate-pulse" />
                            <div className="h-6 bg-gray-700 rounded w-[85%] animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation buttons skeleton */}
            <div className="flex justify-between py-4">
                <div className="w-[72px] h-[56px] bg-gray-700 rounded-full animate-pulse" />
                <div className="w-[72px] h-[56px] bg-gray-700 rounded-full animate-pulse" />
            </div>
        </>
    );
}


export { NovelPageSkeleton, ChapterButtonsSkeleton, ChapterPageSkeleton };