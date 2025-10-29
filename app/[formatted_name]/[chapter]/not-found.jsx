"use client"
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NavBar from "@/components/general/layout/NavBar";


function NotFound() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [location, setLocation] = useState('');
    const [source, setSource] = useState('')

    useEffect(() => {
        // Extract the last section of the pathname
        const novelName = pathname.split('/')[1];

        // Get the first query parameter key
        const sourceName = Array.from(searchParams.keys())[0] || '';

        setLocation(novelName);
        setSource(sourceName);
    }, [pathname, searchParams]);

    function handleNavigation() {
        window.location.href = `/${location}?${source}`;
    }


    return (
        <>
            <NavBar />
            <main className={"text-center relative top-20"}>
                <h2 className={"text-5xl"}>Chapter Not Found</h2>
                <p className={'text-lg'}>We couldn&apos;t find the chapter you were looking for.</p>
                <div className={"flex justify-center my-5"}>
                    <button onClick={handleNavigation}>Go back to the Gallery</button>
                </div>
            </main>
        </>
    );
}


export default NotFound;