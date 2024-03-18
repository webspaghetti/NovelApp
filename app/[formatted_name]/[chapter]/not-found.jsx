"use client"
import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";

function NotFound() {
    const pathname = usePathname();
    const [location, setLocation] = useState('');

    useEffect(() => {
        // Extract the last section of the pathname
        const novelName = pathname.split('/')[1];

        // Check if the last section is a number (using isNaN)
        setLocation(novelName);
    }, [pathname]);

    const handleNavigation = () => {
        window.location.href = `/${location}`; // Navigate to homepage
    };

    return (
        <main className={"text-center"}>
            <h2 className={"text-5xl"}>Chapter Not Found</h2>
            <p className={'text-lg'}>We couldn&apos;t find the chapter you were looking for.</p>
            <div className={"flex justify-center my-5"}>
                <button onClick={handleNavigation}>Go back to the Gallery</button>
            </div>
        </main>
    );
}

export default NotFound;
