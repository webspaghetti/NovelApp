import Image from "next/image";
import executeQuery from "@/app/database/db";

export default async function Home() {

    const novels = await executeQuery("select * from novel_table;");

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

  return (
    <main>

        <div className={"flex justify-center lg:justify-start w-full mb-5"}> {/*Add novel button*/}
            <button>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add novel
            </button>
        </div>

        <div className={"grid grid-cols-3 gap-10"}> {/*Cards layout*/}

            {novels.map((novel) => (
                <div key={novel.id} className={"card"}>
                    <Image src={`/thumbnails/${novel.formatted_name}.jpg`} alt={"NovelApp logo"} width={1000} height={1000} quality={100} className={"w-full h-96 sm:h48 object-cover"}/>
                    <div className="m-4">
                        <span className="text-secondary font-bold text-lg">{novel.name}</span>
                        <span className="block text-gray-400 text-sm">Chapters: {novel.chapter_count}</span>
                        <span className={"block text-gray-400 text-sm"}>Last updated: {formatDate(novel.latest_update)}</span>
                    </div>
                    <div className={`badge ${novel.status}`}>
                        <span>{novel.status}</span>
                    </div>
                </div>
            ))}

        </div>

    </main>
  );
}
