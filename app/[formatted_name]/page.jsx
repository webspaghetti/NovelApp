import executeQuery from "@/app/database/db";

export const dynamicParams = true;

export async function generateStaticParams(){
    const novels = await executeQuery("select * from novel_table;");

    return novels.map((novels) => ({
        f_name: novels.formatted_name
    }))
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

async function Page({params}) {
    const novels = await getNovel(params.formatted_name)
    const novel = novels[0]; // Access the first novel in the array

    return (
        <main className={'relative top-20'}>
            <h1>Welcome to ...</h1>
            <h3>{novel.name}</h3>
            <h3>{novel.chapter_count}</h3>
            <h3>{novel.id}</h3>
            <h3>{novel.status}</h3>
        </main>
    );
}

export default Page;