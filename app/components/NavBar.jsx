import Link from "next/link";
import Image from "next/image";
import Logo from './logo.png';

function NavBar() {
    return (
        <div className={"w-full bg-navbar"}>
            <nav>
                <Link href={"/"}><div className={"flex items-center gap-7"}>
                    <Image src={Logo} alt={"NovelApp logo"} width={70} quality={100}/>
                <h1 className={"text-3xl h1_outline"}>NovelApp</h1>
                </div></Link>
                <div className={"flex items-center gap-24"}>
                <Link href={"/"}>Home</Link>
                <Link href={"/about"}>About</Link>
                </div>
            </nav>
        </div>
    );
}

export default NavBar;