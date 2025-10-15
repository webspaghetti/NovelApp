"use client"
import { usePathname } from 'next/navigation';
import NavBar from './NavBar';

export default function NavBarWrapper() {
    const pathname = usePathname();

    return <NavBar pathname={pathname} />;
}