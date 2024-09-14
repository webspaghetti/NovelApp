"use client"
import executeQuery from "@/app/database/db";
import LoadingPopup from "@/app/components/LoadingPopup";
import {useState} from "react";

function FetchNovels() {
    const [buttonPopup, setButtonPopup] = useState(false);

    function formatLastUpdate(lastUpdateText) {
        return lastUpdateText.replace(/Updated |\[|]/g, '').trim();
    }

    function extractChapterNumber(chapterText) {
        const match = chapterText.match(/\d+/);
        return match ? match[0] : '';
    }

    async function getNovel(f_name){
        try {
            // Problems with ("SELECT * FROM novel_table WHERE formatted_name = ?", [f_name])
            return await executeQuery(`SELECT * FROM novel_table WHERE formatted_name = '${f_name}'`);
        } catch (error) {
            console.error("Oops, an error occurred:", error);
            return null;
        }
    }

    async function RefetchNovels(formattedName){

        const response = await fetch(`https://freewebnovel.com/${formattedName}.html`);

        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        let novelStatus = doc.querySelector('.s1.s2, .s1.s3').textContent.trim();
        const lastUpdate = formatLastUpdate(doc.querySelector('.lastupdate').textContent);
        const chapterCountFetch = extractChapterNumber(doc.querySelector('.ul-list5 li').textContent);

        const chapterCount = parseInt(chapterCountFetch);

        function isMoreThanTwoMonthsOld(update) {
            if (update.includes('months ago')) {
                const monthsAgo = parseInt(update);
                return monthsAgo >= 3;
            } else if (update.includes('a year ago') || update.includes('years ago')) {
                // If the update mentions "year ago" or "years ago", it's definitely older than two months
                return true;
            } else if (Date.parse(update)) {
                // If the update is a valid date, it means the novel is not ongoing and likely on hiatus
                return true;
            }
            return false;
        }

        if(novelStatus === 'OnGoing' && isMoreThanTwoMonthsOld(lastUpdate)){
            novelStatus = 'Hiatus';
        }

        try {
            const novels = await getNovel(formattedName);
            const databaseNovel = novels[0]; // Access the first novel

            if (databaseNovel.chapter_count !== chapterCount ||
                    databaseNovel.status !== novelStatus ||
                    databaseNovel.latest_update !== lastUpdate
            ) {
                await executeQuery(`UPDATE novel_table SET chapter_count=${chapterCount}, status='${novelStatus}', latest_update='${lastUpdate}' WHERE formatted_name='${formattedName}';`);
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function GetAllNovels() {
        try {
            const formattedNames = await executeQuery("SELECT formatted_name FROM novel_table");

            // Loop through each formatted_name
            for (const formattedName of formattedNames) {
                await RefetchNovels(formattedName.formatted_name);  // Call a function to fetch and update each novel
            }
            location.reload();
        } catch (error) {
            console.error("Error fetching formatted_names:", error);
        }
    }

    function handleButtonClick(){
        setButtonPopup(true);
        GetAllNovels();
    }

    return (
        <>
            <button onClick={handleButtonClick} className={"ml-2 svg-animate-rotate"}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <p className={'max-sm:hidden'}>Refresh novels</p>
            </button>
            <LoadingPopup trigger={buttonPopup}/>
        </>
    );
}

export default FetchNovels;