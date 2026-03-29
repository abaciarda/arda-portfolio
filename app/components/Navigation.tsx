'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import navbarItems from "../data/navbar-items.json";

export default function Navigation() {
    const pathName = usePathname();

    const isActive = (href: string) => {
        if (pathName == href || pathName.startsWith(href + '/')) return true;
    }

    return (
        <nav className="flex items-center justify-around fixed left-1/2 -translate-x-1/2 top-4 z-50 max-w-84 w-full backdrop-blur-md bg-background/60 border border-white/10 rounded-3xl py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            {navbarItems.navbar_items.map((item, index) => (
                <Link href={item.href} className={isActive(item.href) ? "nav-item active" : "nav-item"} key={index}>
                    {item.label}
                </Link>
            ))}
        </nav>
    )
}