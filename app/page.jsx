import NovelList from "@/components/homepage/NovelList";
import AddNovelButton from "@/components/homepage/AddNovelButton";
import SyncNovelsButton from "@/components/homepage/SyncNovelsButton";


// Server-Side Render
async function fetchNovels() {
    const res = await fetch(`${process.env.PUBLIC_API_URL}/api/novels`, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error('Failed to fetch novels');
    }

    return res.json();
}

async function fetchUserNovel() {
    const res = await fetch(`${process.env.PUBLIC_API_URL}/api/novels`, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error('Failed to fetch user novel');
    }

    return res.json();
}

async function Home() {
    const novelList = await fetchNovels(); // Your existing novelList fetch
    const userNovel = await fetchUserNovel(); // Fetch user data on server

    const unObj = userNovel.reduce((acc, item) => {
        acc[item.novel_id] = item;
        return acc;
    }, {});

    return (
        <main>
            <div className={"flex justify-between w-full mb-5 relative top-[76px] max-sm:top-[70px]"}>
                <AddNovelButton />
                <SyncNovelsButton />
            </div>

            <div className="w-full h-[4px] bg-gradient-to-r from-primary via-secondary to-primary relative top-[76px] max-sm:top-[70px] mb-8 max-sm:mb-4 rounded-full" />

            <div className={'max-md:flex max-md:justify-center'}>
                <div className={"grid grid-cols-2 md:grid-cols-3 max-sm:gap-4 gap-5 md:gap-10 relative top-20 max-sm:pb-3 pb-9"}>
                    <NovelList novelList={novelList} initialUserNovel={unObj} />
                </div>
            </div>
        </main>
    );
}


export default Home;