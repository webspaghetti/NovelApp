import Image from "next/image";
import executeQuery from "@/app/database/db";
import Link from "next/link";
import DateFormatter from "@/app/components/functions/DateFormatter";

async function LoadNovels() {
    function isValidDate(dateString) {
        return !isNaN(Date.parse(dateString));
    }

    const novels = await executeQuery("select * from novel_table;");

    return (
        novels.map((novel) => (

            <div key={novel.id} className={"card glassy-animation max-md:h-101"}>
                <Link href={`/${novel.formatted_name}`}>
                    <Image src={novel.alternative_image_url ? novel.alternative_image_url : novel.image_url} alt={`${novel.name} thumbnail`} width={1000} height={1000} quality={100} className={"w-full h-100 md:h-96 object-cover select-none img"} draggable="false"/>
                    <div className="m-4">
                        <div className={"text-secondary font-bold text-lg max-w-30 truncate"}>{novel.name}</div>
                        <span className={"block text-gray-400 text-sm"}>Chapters: {novel.chapter_count}</span>
                        <span className={"block text-gray-400 text-sm"}> Last updated: {isValidDate(novel.latest_update) ? (
                            <DateFormatter dateString={novel.latest_update} />
                        ) : (
                            novel.latest_update
                        )}
                        </span>
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