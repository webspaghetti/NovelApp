import Image from "next/image";
import executeQuery from "@/app/database/db";
import Link from "next/link";
import DateFormatter from "@/app/components/functions/DateFormatter";

async function LoadNovels() {
    function isValidDate(dateString) {
        return !isNaN(Date.parse(dateString));
    }

    const novels = await executeQuery("select * from novel_table;");
    const users = await executeQuery("select * from user_progress where user_id = 1;");

    return (
        novels.map((novel) => {

            const userProgress = users.find(user => user.novel_id === novel.id);
            const currentChapter = userProgress && userProgress.current_chapter !== null ? userProgress.current_chapter : 0;

            return (
            <div key={novel.id} className={"card glassy-animation max-md:h-101 max-sm:h-75"}>
                <Link href={`/${novel.formatted_name}`}>
                    <Image src={novel.alternative_image_url ? novel.alternative_image_url : novel.image_url} alt={`${novel.name} thumbnail`} width={1000} height={1000} quality={100} className={"w-full h-100 md:h-96 max-sm:h-52 object-cover select-none img"} draggable="false"/>
                    <div className="m-4">
                        <div className={"text-secondary font-bold text-lg max-sm:text-base max-w-30 max-sm:max-w-52 truncate max-sm:hidden"}>{novel.name}</div>
                        <span className={"block text-gray-400 text-sm"}>Progress: {currentChapter} / {novel.chapter_count}</span>
                        <span className={"block text-gray-400 text-sm"}> Last updated: {isValidDate(novel.latest_update) ? (
                            <DateFormatter dateString={novel.latest_update} />
                        ) : (
                            novel.latest_update
                        )}
                        </span>
                    </div>
                    <div className={`badge ${novel.status} select-none max-sm:p-2`}>
                        <span className={'max-sm:hidden'}>{novel.status}</span>
                    </div>
                </Link>
            </div>

            );
        })
    );
}

export default LoadNovels;