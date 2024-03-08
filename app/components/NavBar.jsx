import Link from "next/link";
import Image from "next/image";
import Logo from './logo.png';

function NavBar() {
    return (
        <div className={"w-full bg-navbar"}>
            <nav>
                <Image src={Logo} alt={"NovelApp logo"} width={70} quality={100} placeholder={'blur'}/>
                <h1>NovelApp</h1>
                <Link href={"/"}>Homepage</Link>
                <Link href={"/about"}>About</Link>
            </nav>
        </div>
    );
}

export default NavBar;