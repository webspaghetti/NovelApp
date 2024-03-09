import executeQuery from "@/app/database/db";
import Image from "next/image";
import DateFormatter from "@/app/components/DateFormatter";

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
        <main className="relative top-20 flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="w-full md:w-1/3">
                <Image src={`/thumbnails/${novel.formatted_name}.jpg`} alt={`${novel.name} thumbnail`} width={350} height={350} quality={100} className="select-none rounded-lg shadow-lg" />
            </div>
            <div className="flex flex-col justify-center items-start md:w-1/3">
                <div className={`badge ${novel.status} select-none relative top-20 mb-4`}>
                    <span>{novel.status}</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">{novel.name}</h1>
                <p className="text-lg mb-2">Chapters: {novel.chapter_count}</p>
                <p className="text-lg mb-4">Last updated: <DateFormatter dateString={novel.latest_update} /></p>
                <button className="bg-primary text-secondary py-2 px-6 rounded-lg shadow-md hover:bg-primary-dark transition-colors duration-300">Start reading</button>
            </div>
        </main>

    );
}

export default Page;