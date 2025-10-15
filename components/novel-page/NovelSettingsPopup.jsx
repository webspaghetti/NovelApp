import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import AlertDialog from "@/components/general/AlertDialog";


function NovelSettingsPopup({ trigger, setTrigger, novel }) {
    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const originalName = novel?.name;
    const originalUrl = novel.image_url_alternative ?? novel.image_url;
    const originalUrl = novel?.image_url;

    useEffect(() => {
        if (!novel) return;

        if (userNovel.name_alternative){
            setName(userNovel.name_alternative);
        } else setName(originalName)

        if (userNovel.image_url_alternative) {
            setImageUrl(userNovel.image_url_alternative);
        } else setImageUrl(originalUrl);

    }, [novel]);

    const [isLoading, setIsLoading] = useState(false);
    const [shake, setShake] = useState(false);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    function handleClosing(event) {
        if (event.target.classList.contains('backdrop-blur-sm') && !isLoading) {
            setName(userNovel.name_alternative ?? originalName);
            setImageUrl(userNovel.image_url_alternative ?? originalUrl);
            setIsDialogOpen(false);
            setTrigger(false);
        }
    }

    function handleNameChange(event) {
        setName(event.target.value);
    }

    function handleImageChange(event) {
        setImageUrl(event.target.value);
    }

    async function handleRestore(field){
        switch (field){
            case "name":
                setName(originalName);
                break;
            case "image_url":
                setImageUrl(originalUrl)
                break
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);

        let nameChange;
        let imageUrlChange;

        if (userNovel.name_alternative){
            nameChange = (userNovel.name_alternative !== name);
        } else nameChange = (originalName !== name);

        if (userNovel.image_url_alternative){
            imageUrlChange = (userNovel.image_url_alternative !== imageUrl);
        } else imageUrlChange = (originalUrl !== imageUrl);

        if (!nameChange && !imageUrlChange){
            setIsLoading(false)
            setTrigger(false);
            return
        }


        try {
            const updateResponse = await fetch('/api/user_novel/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userNovel.user_id,
                    novelId: userNovel.novel_id,
                    nameAlternative: name,
                    imageUrlAlternative: imageUrl
                }),
            });

            if (!updateResponse.ok) {
                throw new Error('Failed to fetch novel data');
            }

            setTrigger(false);
        } catch (error) {
            console.error("Error updating novel:", error.message);
            triggerShake();
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                location.reload();
            }, 0);
        }
    }

    async function handleRemove() {
        setIsLoading(true);
        try {
            console.log("Removing novel...");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setTrigger(false);
        } catch (error) {
            console.error("Error:", error.message);
        } finally {
            setIsLoading(false);
            setIsDialogOpen(false);
        }
    }

    function triggerShake() {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    }

    return (trigger) ? (
        <div
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 backdrop-blur-sm z-30"
            onClick={handleClosing}
        >
            <div className="relative w-[90%] max-w-lg bg-main_background border border-gray-700 rounded-2xl shadow-cardB p-6">
                <div className={`transition-all duration-300 ${shake ? 'animate-shake' : ''}`}>
                    <h2 className="text-2xl font-semibold text-secondary text-center mb-6">
                        Novel Settings
                    </h2>

                    {/* Name input */}
                    <div className="mb-4">
                        <label
                            className="block text-gray-300 text-sm font-semibold mb-2"
                            htmlFor="name"
                        >
                            Name
                        </label>
                        <div className={"flex flex-row gap-3"}>
                            <input
                                className="w-full bg-navbar border border-gray-700 rounded-lg text-secondary py-2 px-3 focus:outline-none focus:border-secondary caret-primary placeholder-gray-500 disabled:opacity-60"
                                id="name"
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                placeholder="Enter novel name"
                                disabled={isLoading}
                            />
                            <button className="text-secondary p-1 z-10" onClick={() => handleRestore("name")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Image URL input */}
                    <div className="mb-6">
                        <label
                            className="block text-gray-300 text-sm font-semibold mb-2"
                            htmlFor="image"
                        >
                            Image URL
                        </label>
                        <div className={"flex flex-row gap-3"}>
                            <input
                                className="w-full bg-navbar border border-gray-700 rounded-lg text-secondary py-2 px-3 focus:outline-none focus:border-secondary caret-primary placeholder-gray-500 disabled:opacity-60"
                                id="image"
                                type="text"
                                value={imageUrl}
                                onChange={handleImageChange}
                                placeholder="Enter image URL"
                                disabled={isLoading}
                            />
                            <button className="text-secondary p-1 z-10" onClick={() => handleRestore("image_url")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                                    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 justify-between">
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="flex justify-center items-center bg-primary hover:bg-opacity-80 text-secondary font-semibold py-2.5 px-4 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <CircularProgress sx={{ color: "#FAFAFA" }} size={20} thickness={6}/>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsDialogOpen(true)}
                            disabled={isLoading}
                            className="flex justify-center items-center bg-red-700 hover:bg-red-800 border-red-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <CircularProgress sx={{ color: "#FAFAFA" }} size={20} thickness={6}/>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>

                        <AlertDialog
                            isOpen={isDialogOpen}
                            title="Remove this novel?"
                            message="This action cannot be undone."
                            confirmText="Remove"
                            cancelText="Cancel"
                            isLoading={isLoading}
                            onConfirm={handleRemove}
                            onCancel={() => setIsDialogOpen(false)}
                        />
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}


export default NovelSettingsPopup;