import { useState } from "react";
import executeQuery from "@/app/database/db";
import CircularProgress from "@mui/material/CircularProgress";

function PopupForm(props) {
    const [link, setLink] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    function handleClosing(event) {
        if (event.target.classList.contains('backdrop-blur-sm') && !isLoading) {
            props.setTrigger(false);
        }
    }

    function handleChange(event) {
        setLink(event.target.value);
        // Clear previous error message when input changes
        setErrorMessage('');
    }

    function formatLastUpdate(lastUpdateText) {
        return lastUpdateText.replace(/Updated |\[|]/g, '').trim();
    }

    function extractChapterNumber(chapterText) {
        const match = chapterText.match(/\d+/);
        return match ? match[0] : '';
    }
    async function getNovelID(formattedName){
        const novels = await executeQuery(`select id from novel_table where formatted_name = '${formattedName}';`);
        return novels[0].id;
    }

    async function handleSubmit(event) {
        setIsLoading(true)
        event.preventDefault();
        const regex = /^https:\/\/freewebnovel\.com\/[a-z]+(?:-[a-z]+)*\.html$/;

            if (regex.test(link)) {
                const response = await fetch(link, { next: { revalidate: 1 } });
                const html = await response.text();

                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const novelTitle = doc.querySelector('.tit').textContent.trim();
                const novelStatus = doc.querySelector('.s1.s2, .s1.s3').textContent.trim();
                const lastUpdate = formatLastUpdate(doc.querySelector('.lastupdate').textContent);
                const chapterCount = extractChapterNumber(doc.querySelector('.ul-list5 li').textContent);
                const formattedName = link.match(/https:\/\/freewebnovel\.com\/([^\/]+)\.html/)[1];
                const imageUrl = doc.querySelector('.pic img').getAttribute('src'); //TBI

                try {
                    const novelQuery = await executeQuery(`INSERT INTO novel_table (name, formatted_name, chapter_count, status, latest_update, image_url) VALUES ("${novelTitle}", '${formattedName}', ${chapterCount}, '${novelStatus}', '${lastUpdate}', '${imageUrl}')`);

                    // Only proceed if the first query succeeded
                    const errorMessage = novelQuery.message;

                    if (!errorMessage.startsWith('Duplicate')) { // Check if there's no error
                        const novelID = await getNovelID(formattedName);
                        await executeQuery(`INSERT INTO user_progress (user_id, novel_id, read_chapters) VALUES (1, ${novelID}, '[]')`).then(() => {
                            location.reload();
                        });
                    } else {
                        setErrorMessage('Novel is already present.');
                        setIsLoading(false)
                    }
                } catch (error) {
                    console.error("Error executing query:", error);
                    setIsLoading(false)
                }
            } else {
                setErrorMessage('Please enter a valid link in the format: https://freewebnovel.com/novel-name.html');
                setIsLoading(false)
            }
    }

    return (props.trigger) ? (
        <div className="fixed top-0 left-0 w-full h-full flex bg-navbar bg-opacity-20 justify-center items-center z-10 backdrop-blur-sm" onClick={handleClosing}>
            <div className="relative p-8 w-full max-w-xl bg-navbar border-primary border-4 rounded-3xl">
                <form className={"bg-main_background p-4 rounded-lg shadow-md w-full"} onSubmit={handleSubmit} method={'post'}>
                    <div className="flex items-center border-b-2 border-primary py-2">
                        <input className="appearance-none bg-transparent border-none w-full text-secondary mr-3 px-2 leading-tight focus:outline-none select-none"
                               type="text"
                               value={link}
                               onChange={handleChange}
                               placeholder="Link"
                               aria-label="Link" />

                        {!isLoading ?(
                            <button className="flex-shrink-0 text-sm border-4 text-secondary py-3 px-3 rounded-lg mb-2" type="submit">
                                Submit
                            </button>
                        ) : (
                            <button disabled={true} className={"flex-shrink-0 text-sm border-4 text-secondary py-3 px-8 rounded-lg mb-2"}>
                                <CircularProgress sx={{color: "#FAFAFA"}} size={20}/>
                            </button>
                        )}

                    </div>
                    {errorMessage && <p className="text-red-500 text-center max-sm:text-sm">{errorMessage}</p>}
                </form>
            </div>
        </div>
    ) : null;
}

export default PopupForm;
