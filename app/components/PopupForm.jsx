import { useState } from "react";
import executeQuery from "@/app/database/db";

function PopupForm(props) {
    const [link, setLink] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    function handleClosing(event) {
        if (event.target.classList.contains('backdrop-blur-sm')) {
            props.setTrigger(false);
        }
    }

    function handleChange(event) {
        setLink(event.target.value);
        // Clear previous error message when input changes
        setErrorMessage('');
    }

    function formatLastUpdate(lastUpdateText) {
        return lastUpdateText.replace(/Updated |\[|\]/g, '').trim();
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
        event.preventDefault();
        const regex = /^https:\/\/freewebnovel\.com\/[a-z]+(?:-[a-z]+)*\.html$/;

        if (regex.test(link)) {
            try {
                const response = await fetch(link);
                const html = await response.text();

                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const novelTitle = doc.querySelector('.tit').textContent.trim();
                const novelStatus = doc.querySelector('.s1.s2, .s1.s3').textContent.trim();
                const lastUpdate = formatLastUpdate(doc.querySelector('.lastupdate').textContent);
                const chapterCount = extractChapterNumber(doc.querySelector('.ul-list5 li').textContent);
                const formattedName = link.match(/https:\/\/freewebnovel\.com\/([^\/]+)\.html/)[1];
                const imageUrl = doc.querySelector('.pic img').getAttribute('src'); //TBI

                await executeQuery(`INSERT INTO novel_table (name, formatted_name, chapter_count, status, latest_update, image_url) VALUES ("${novelTitle}", '${formattedName}', ${chapterCount}, '${novelStatus}', '${lastUpdate}', '${imageUrl}')`).then(async () => {
                    await executeQuery(`INSERT INTO user_progress (user_id, novel_id, read_chapters) VALUES (1, ${await getNovelID(formattedName)}, '[]')`).then(() => { //Just me :)
                        location.reload();
                    }).catch(error => {
                        console.error("Error executing query:", error);
                    });
                }).catch(error => {
                    console.error("Error executing query:", error);
                });

            } catch (error) {
                console.error('Error fetching data:', error);
            }

        } else {
            setErrorMessage('Please enter a valid link in the format: https://freewebnovel.com/novel-name.html');
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
                        <button className="flex-shrink-0 text-sm border-4 text-secondary py-3 px-3 rounded-lg mb-2" type="submit">
                            Submit
                        </button>
                    </div>
                    {/* Display error message */}
                    {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
                </form>
            </div>
        </div>
    ) : null;
}

export default PopupForm;
