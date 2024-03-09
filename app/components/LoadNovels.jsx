import Image from "next/image";
import executeQuery from "@/app/database/db";

async function LoadNovels() {

    const novels = await executeQuery("select * from novel_table;");

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    return (
        novels.map((novel) => (
            <div key={novel.id} className={"card"}>
                <Image src={`/thumbnails/${novel.formatted_name}.jpg`} alt={"NovelApp logo"} width={1000} height={1000} quality={100} className={"w-full h-96 sm:h48 object-cover select-none"}/>
                <div className="m-4">
                    <span className="text-secondary font-bold text-lg">{novel.name}</span>
                    <span className="block text-gray-400 text-sm">Chapters: {novel.chapter_count}</span>
                    <span className={"block text-gray-400 text-sm"}>Last updated: {formatDate(novel.latest_update)}</span>
                </div>
                <div className={`badge ${novel.status} select-none`}>
                    <span>{novel.status}</span>
                </div>
            </div>
        ))
    );
}

export default LoadNovels;