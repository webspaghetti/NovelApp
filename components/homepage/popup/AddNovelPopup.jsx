import sourceConfig from "@/config/sourceConfig";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchNovelByFormattedName } from "@/app/helper-functions/fetchNovelByFormattedName";
import { isMoreThanTwoMonthsOld } from "@/app/helper-functions/isMoreThanTwoMonthsOld";
import formatLastUpdate from "@/app/helper-functions/formatLastUpdate";


function AddNovelPopup(props) {
    const [link, setLink] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [shake, setShake] = useState(false);


    function handleClosing(event) {
        if (event.target.classList.contains('backdrop-blur-sm') && !isLoading) {
            setLink('');
            setErrorMessage('');
            props.setTrigger(false);
        }
    }

    function handleChange(event) {
        setLink(event.target.value);
        setErrorMessage('');
    }

    async function handleSubmit(event) {
        setIsLoading(true);
        event.preventDefault();

        const linkRegexArray = Object.values(sourceConfig).map(source => source.link_regex);

        if (linkRegexArray.some(regex => regex.test(link))) {
            try {
                const response = await fetch('/api/scrape', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url: link }),
                });

                if (!response.ok) {
                    triggerShake();
                    setIsLoading(false);
                    throw new Error('Failed to fetch novel data\nCheck your link');
                }

                const data = await response.json();
                const { novelTitle, novelStatus, lastUpdate, chapterCount, imageUrl, formattedName } = data.content;
                const novelSource = data.source;

                let updatedStatus = novelStatus;
                let formattedLastUpdate = formatLastUpdate(lastUpdate);

                if (updatedStatus === 'OnGoing' && isMoreThanTwoMonthsOld(formattedLastUpdate)) {
                    updatedStatus = 'Hiatus';
                }

                const novelResponse = await fetch('/api/novels', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: novelTitle,
                        formattedName: formattedName,
                        chapterCount: chapterCount,
                        status: updatedStatus,
                        latestUpdate: formattedLastUpdate,
                        imageUrl: imageUrl,
                        source: novelSource
                    }),
                });

                const novelData = await novelResponse.json();

                if (novelData.isDuplicate) {
                    setErrorMessage('Novel with this source is already present.');
                    triggerShake();
                    setIsLoading(false);
                    return;
                }

                if (!novelResponse.ok) {
                    throw new Error(novelData.message || 'Failed to create novel');
                }

                const { id: novelID } = await fetchNovelByFormattedName(formattedName);

                const userProgressResponse = await fetch('/api/user_novel', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: 1,
                        novelId: novelID,
                    }),
                });

                if (!userProgressResponse.ok) {
                    throw new Error('Failed to create user progress');
                }

                setTimeout(() => {
                    location.reload();
                }, 0);
            } catch (error) {
                console.error("Error:", error.message);
                setErrorMessage(error.message);
                setIsLoading(false);
                triggerShake();
            }
        } else {
            setErrorMessage(`Please enter link in a valid format.`);
            triggerShake();
            setIsLoading(false);
        }
    }

    function triggerShake() {
        setShake(true);
        setTimeout(() => setShake(false), 500); // Remove shake after 500ms
    }


    return (props.trigger) ? (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-30"
            onClick={handleClosing}
        >
            <div className="relative w-[90%] max-w-lg bg-main_background border border-gray-700 rounded-2xl shadow-cardB p-6">
                <form
                    className={`w-full transition-all duration-300 ${shake ? 'animate-shake' : ''}`}
                    onSubmit={handleSubmit}
                    method="post"
                >
                    <h2 className="text-2xl font-semibold text-secondary text-center mb-6">
                        Add New Novel
                    </h2>

                    <div className="flex items-center border border-gray-700 bg-navbar rounded-lg px-2 py-2 focus-within:border-primary transition-all max-sm:flex-col max-sm:items-stretch gap-2">
                        <input
                            className="flex-1 bg-transparent border-none text-secondary px-2 py-1 leading-tight focus:outline-none caret-primary placeholder-gray-500 disabled:opacity-60"
                            type="text"
                            value={link}
                            onChange={handleChange}
                            placeholder="Enter novel link"
                            aria-label="Link"
                            disabled={isLoading}
                        />

                        {!isLoading ? (
                            <button
                                type="submit"
                                className="flex justify-center items-center bg-primary hover:bg-opacity-80 text-secondary font-semibold rounded-lg shadow-sm transition-all px-3 py-2 sm:px-4 sm:py-2 max-sm:w-full"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        ) : (
                            <button
                                disabled
                                className="flex justify-center items-center bg-primary text-secondary font-semibold rounded-lg shadow-sm opacity-60 cursor-not-allowed px-3 py-2 sm:px-4 sm:py-2 max-sm:w-full"
                            >
                                <CircularProgress sx={{ color: '#FAFAFA' }} size={24} thickness={6} />
                            </button>
                        )}
                    </div>


                    {errorMessage && (
                        <p className="text-red-500 text-center mt-4 whitespace-pre-wrap">
                            {errorMessage}
                        </p>
                    )}
                </form>
            </div>
        </div>
    ) : null;
}


export default AddNovelPopup;