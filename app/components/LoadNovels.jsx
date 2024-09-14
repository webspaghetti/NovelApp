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
            const progressPercentage = currentChapter / novel.chapter_count * 100;

            return (
            <div key={novel.id} className={"card glassy-animation max-md:h-101 max-sm:h-80 min-w-42"}>
                <Link href={`/${novel.formatted_name}`}>
                    <Image src={novel.alternative_image_url ? novel.alternative_image_url : novel.image_url} alt={`${novel.name} thumbnail`} width={1000} height={1000} quality={100} className={"w-full h-100 md:h-96 max-sm:h-52 object-cover select-none img"} draggable="false"/>
                    <div className="m-4 max-sm:mx-2">
                        <div className={"text-secondary font-bold text-lg max-sm:text-base max-w-30 max-sm:max-w-52 truncate max-sm:hidden"}>{novel.name}</div>
                        <span className={"block text-gray-400 text-sm"}>Progress: <span className={"text-green-600 font-bold"}>{currentChapter}</span> / {novel.chapter_count}</span>
                        <span className={"block text-gray-400 text-sm"}> Last updated: <br className={"sm:hidden"} /> <span className={"font-bold"}>{isValidDate(novel.latest_update) ? (
                            <DateFormatter dateString={novel.latest_update} />
                        ) : (
                            novel.latest_update
                        )}
                            </span>
                        </span>
                        <div className="w-full bg-gray-700 h-2 mt-2 rounded-xl">
                            <div className="bg-green-600 h-2 rounded-xl" style={{ width: `${progressPercentage > 0 ? Math.max(progressPercentage, 2) : 0}%` }}></div>
                        </div>
                    </div>
                    <div className={`badge ${novel.status} select-none max-sm:p-2 ml-2 mt-2`}>
                        <span className={'max-sm:hidden'}>{novel.status}</span>
                    </div>
                </Link>
            </div>

            );
        })
    );
}

export default LoadNovels;