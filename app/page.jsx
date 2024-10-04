import LoadNovels from "@/app/components/LoadNovels";
import AddNovel from "@/app/components/AddNovel";
import FetchNovels from "@/app/components/FetchNovels";


// Server-Side Render
async function getNovels() {
    //const res = await fetch(`${process.env.PUBLIC_API_URL}/api/novels`, { cache: 'no-store' });
    const res = await fetch(`http://localhost:3000/api/novels`, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error('Failed to fetch novels');
    }
    return res.json();
}

export default async function Home() {
    const novels = await getNovels();

    return (
        <main>
            <div className={"flex justify-between w-full mb-5 relative top-20"}>
                <AddNovel />
                <FetchNovels />
            </div>

            <div className={'max-md:flex max-md:justify-center'}>
                <div className={"grid grid-cols-2 md:grid-cols-3 max-sm:gap-4 gap-5 md:gap-10 relative top-20 max-sm:pb-3 pb-9"}>
                    <LoadNovels novels={novels} />
                </div>
            </div>
        </main>
    );
}