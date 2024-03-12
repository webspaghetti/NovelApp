"use server"

import executeQuery from "@/app/database/db";

async function GetNovel(f_name) {
    try {
        // Problems with ("SELECT * FROM novel_table WHERE formatted_name = ?", [f_name])
        const novels = await executeQuery(`SELECT * FROM novel_table WHERE formatted_name = '${f_name}'`);
        return novels[0]; // Access the first novel in the array
    } catch (error) {
        console.error("Oops, an error occurred:", error);
        return null;
    }
}

export default GetNovel;