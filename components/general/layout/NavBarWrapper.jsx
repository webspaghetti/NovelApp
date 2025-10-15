"use client"
import { usePathname } from 'next/navigation';
import NavBar from './NavBar';


function NavBarWrapper() {
    const pathname = usePathname();

    return <NavBar pathname={pathname} />;
}


export default NavBarWrapper;