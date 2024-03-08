import Link from "next/link";

function NavBar() {
    return (
        <nav>
            <h1>NovelApp</h1>
            <Link href={"/"}>Homepage</Link>
            <Link href={"/about"}>About</Link>
        </nav>
    );
}

export default NavBar;