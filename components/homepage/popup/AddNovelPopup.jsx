import sourceConfig from "@/config/sourceConfig"
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
                throw new Error('Failed to fetch novel data\nCheck your link');

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
                    setErrorMessage('Novel is already present.');
                    triggerShake();
                    setIsLoading(false);
                    return;
                }

                if (!novelResponse.ok) {
                    throw new Error(novelData.message || 'Failed to create novel');
                }

                const { id: novelID } = await fetchNovelByFormattedName(formattedName);

                const userProgressResponse = await fetch('/api/user_progress', {
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
                triggerShake();
            }
        } else {
            setErrorMessage(`Please enter a valid link in the format: ${Object.values(sourceConfig).map(source => source.link_template)}`);
            triggerShake();
            setIsLoading(false);
        }
    }

    function triggerShake() {
        setShake(true);
        setTimeout(() => setShake(false), 500); // Remove shake after 500ms
    }


    return (props.trigger) ? (
        <div className="fixed top-0 left-0 w-full h-full flex bg-navbar bg-opacity-20 justify-center items-center z-10 backdrop-blur-sm" onClick={handleClosing}>
            <div className="relative p-8 w-full max-w-xl bg-navbar border-primary border-4 rounded-3xl">
                <form className={"bg-main_background p-4 rounded-lg shadow-md w-full"} onSubmit={handleSubmit} method={'post'}>
                    <div className="flex items-center border-b-2 border-primary py-2">
                        <input className="appearance-none bg-transparent border-none w-full text-secondary mr-3 px-2 leading-tight focus:outline-none select-none caret-primary"
                               type="text"
                               value={link}
                               onChange={handleChange}
                               placeholder="Link"
                               aria-label="Link" />

                        {!isLoading ? (
                            <button className={`flex-shrink-0 text-sm border-4 text-secondary py-3 px-3 rounded-lg mb-2 ${shake ? 'animate-shake' : ''}`} type="submit">
                                Submit
                            </button>
                        ) : (
                            <button disabled={true} className={"flex-shrink-0 text-sm border-4 text-secondary py-3 px-8 rounded-lg mb-2"}>
                                <CircularProgress sx={{color: "#FAFAFA"}} size={20} thickness={6}/>
                            </button>
                        )}

                    </div>
                    {errorMessage && (
                        <p className="text-red-500 text-center max-sm:text-sm whitespace-pre-wrap">
                            {errorMessage}
                        </p>
                    )}
                </form>
            </div>
        </div>
    ) : null;
}


export default AddNovelPopup;