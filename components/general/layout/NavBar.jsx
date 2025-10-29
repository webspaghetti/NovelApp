import Link from "next/link";
import Image from "next/image";


function NavBar({ customizationTemplate }) {
    const isChapterPage = Boolean(customizationTemplate);
    const navbarStyles = isChapterPage ? "relative" : "fixed top-0 z-10";

    if (customizationTemplate?.menu.navbar_hidden) {
        return null;
    }

    const navColor = customizationTemplate?.menu.nav_color ?? "#121314";
    const textColor = customizationTemplate?.menu.text_color ?? "#FAFAFA";
    const outlineColor = customizationTemplate?.menu.outline_color ?? "#5e42cf";


    return (
        <div
            className={"w-full select-none max-sm:px-2.5 " + navbarStyles}
            style={{
                backgroundColor: navColor,
                color: textColor
            }}
        >
            <nav style={{ backgroundColor: navColor }}>
                <Link href={"/"}>
                    <div className={"flex items-center gap-5"}>
                        <Image
                            src={"/logo.png"}
                            alt={"NovelApp logo"}
                            width={60}
                            height={60}
                            quality={100}
                        />
                        <h1
                            className={"max-sm:hidden text-2xl link_outline text-secondary"}
                            style={{
                                '--outline-color': outlineColor,
                                color: textColor
                            }}
                        >
                            NovelApp
                        </h1>
                    </div>
                </Link>
                <div className={"flex items-center max-sm:gap-6 max-md:gap-6 gap-14"}>
                    <Link href={"/"}>
                        <p
                            className="max-sm:hidden navbar_outline_base"
                            style={{'--outline-color': outlineColor}}
                        >
                            Home
                        </p>
                    </Link>
                    <Link href={"/about"}>
                        <p
                            className="navbar_outline_base"
                            style={{'--outline-color': outlineColor}}
                        >
                            About
                        </p>
                    </Link>
                    <Link href={"/templates"}>
                        <p
                            className="navbar_outline_base"
                            style={{'--outline-color': outlineColor}}
                        >
                            Templates
                        </p>
                    </Link>
                    <Link href={"/profile"} aria-label={"Profile"}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-9 sm:hover:ring-4 max-sm:ring-4 rounded-full transition-all"
                            style={{
                                '--tw-ring-color': outlineColor,
                            }}
                        >
                            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
            </nav>
        </div>
    );
}


export default NavBar;