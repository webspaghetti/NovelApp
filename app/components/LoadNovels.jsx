import Image from "next/image";
import executeQuery from "@/app/database/db";
import Link from "next/link";
import DateFormater from "@/app/components/DateFormater";

async function LoadNovels() {

    const novels = await executeQuery("select * from novel_table;");

    return (
        novels.map((novel) => (

            <div key={novel.id} className={"card"}>
                <Link href={`/${novel.formatted_name}`}>
                    <Image src={`/thumbnails/${novel.formatted_name}.jpg`} alt={"NovelApp logo"} width={1000} height={1000} quality={100} className={"w-full h-96 sm:h48 object-cover select-none"}/>
                    <div className="m-4">
                        <span className="text-secondary font-bold text-lg">{novel.name}</span>
                        <span className="block text-gray-400 text-sm">Chapters: {novel.chapter_count}</span>
                        <span className={"block text-gray-400 text-sm"}>Last updated: <DateFormatter dateString={novel.latest_update} /></span>
                    </div>
                    <div className={`badge ${novel.status} select-none`}>
                        <span>{novel.status}</span>
                    </div>
                </Link>
            </div>
        ))
    );
}

export default LoadNovels;