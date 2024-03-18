"use client"
import Link from "next/link";
import Image from "next/image";
import Logo from './logo.png';
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react';


function NavBar() {

    const [isSpecificPage, setIsSpecificPage] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Extract the last section of the pathname
        const lastSection = pathname.split('/').pop();

        // Check if the last section is a number (using isNaN)
        setIsSpecificPage(!isNaN(parseInt(lastSection)));
    }, [pathname]);

    const navbarStyles = isSpecificPage ? "relative" : "fixed top-0 z-10";

    return (
        <div className={"w-full bg-navbar select-none " + navbarStyles}>
            <nav className={"max-md:mx-5"}>
                <Link href={"/"}><div className={"flex items-center gap-5"}>
                    <Image src={Logo} alt={"NovelApp logo"} width={60} quality={100}/>
                <h1 className={"text-2xl link_outline text-secondary"}>NovelApp</h1>
                </div></Link>
                <div className={"flex items-center gap-16"}>
                <Link href={"/"}>Home</Link>
                <Link href={"/about"}>About</Link>
                </div>
            </nav>
        </div>
    );
}

export default NavBar;