import HomeClient from "@/components/homepage/HomeClient";

// Server-Side Render
async function fetchNovels() {
    const res = await fetch(`${process.env.PUBLIC_API_URL}/api/novels`, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error('Failed to fetch novels');
    }

    return res.json();
}

async function fetchUserNovel() {
    const res = await fetch(`${process.env.PUBLIC_API_URL}/api/user_novel?userId=1`, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error('Failed to fetch user novel');
    }

    return res.json();
}

async function Home() {
    const novelList = await fetchNovels();
    const userNovel = await fetchUserNovel();

    return <HomeClient novelList={novelList} userNovel={userNovel} />;
}

export default Home;