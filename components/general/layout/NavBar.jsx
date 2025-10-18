import Link from "next/link";
import Image from "next/image";


function NavBar({ pathname }) {
    // Extract the last section of the pathname
    const lastSection = pathname?.split('/').pop() || '';

    // Check if the last section is a number
    const isSpecificPage = !isNaN(parseInt(lastSection)) && lastSection !== '';

    const navbarStyles = isSpecificPage ? "relative max-sm:hidden" : "fixed top-0 z-10";


    return (
        <div className={"w-full bg-navbar select-none max-sm:px-2.5 " + navbarStyles}>
            <nav>
                <Link href={"/"}><div className={"flex items-center gap-5"}>
                    <Image src={"/logo.png"} alt={"NovelApp logo"} width={60} height={60} quality={100}/>
                    <h1 className={"max-sm:hidden text-2xl link_outline text-secondary"}>NovelApp</h1>
                </div></Link>
                <div className={"flex items-center max-sm:gap-6 gap-14"}>
                    <Link href={"/"}><p className={'max-sm:hidden'}>Home</p></Link>
                    <Link href={"/about"}><p className={'max-sm:text-base'}>About</p></Link>
                    <Link href={"/profile"} aria-label={"Profile"}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-9 hover:ring-4 hover:ring-primary rounded-full transition-all">
                            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
            </nav>
        </div>
    );
}


export default NavBar;