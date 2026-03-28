import Link from "next/link";

export default function Navigation() {
    return (
        <nav className="flex items-center justify-around fixed left-1/2 -translate-x-1/2 top-4 z-10 max-w-84 w-full backdrop-blur-md bg-background/60 border border-white/10 rounded-3xl py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            <Link href={'#'} className="nav-item">
                Anasayfa
            </Link>
            <Link href={'#'} className="nav-item">
                Projelerim
            </Link>
            <Link href={'#'} className="nav-item">
                Blog
            </Link>
            <Link href={'#'} className="nav-item">
                Hakkımda
            </Link>
        </nav>
    )
}