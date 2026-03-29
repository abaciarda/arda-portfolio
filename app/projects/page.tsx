import Image from "next/image";
import { GoCommit } from "react-icons/go";
import { SiGithub } from "react-icons/si";
import projectItems from "../data/project-items.json";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projeler",
  description: "Geliştirdiğim açık kaynak ve kişisel web projeleri, full-stack uygulamalar ve freelance işlerim.",
  openGraph: {
    title: "Arda Abacı | Projeler",
    description: "Geliştirdiğim açık kaynak ve kişisel web projeleri, full-stack uygulamalar.",
    url: "https://ardaabaci.com/projects",
    images: [{ url: "/assets/images/avatar.jpeg" }],
  },
};

export default function ProjectsPage() {
    return (
        <div className="flex flex-col">
            <header className="h-120 relative flex items-center justify-center">
                <div className="main-splash absolute inset-0 bg-position-[center_-116px] bg-no-repeat dark:brightness-[0.93] dark:-hue-rotate-[-160rad] dark:invert dark:saturate-[0.15]"></div>
                <div className="absolute inset-0 size-full dot-splash"></div>
                <div className="container w-full mx-auto px-4 relative z-10 flex flex-col gap-1">
                    <h1 className="text-3xl font-semibold">
                        Katkıda Bulunduğum Projeler
                    </h1>

                    <h3 className="text-lg text-foreground/50 font-extralight max-w-150">
                        Açık kaynak projelerde ve bireysel çalışmalarda full-stack geliştirme, backend API tasarımı, frontend arayüz geliştirme ve component mimarisi üzerine yaptığım katkıları içerir.
                    </h3>
                    <div className="social-links flex items-center gap-3 relative top-4">
                        <Link href="https://github.com/abaciarda" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-1.5 bg-black/20 rounded transition-all duration-300 shadow-[0_2px_0_0_rgba(0,0,0,0.35)] hover:shadow-[0_3px_0_0_rgba(0,0,0,0.5)] hover:bg-black/30 active:translate-y-px">
                            <FaGithub />
                            <span className="text-sm text-white/80 hover:text-white">Github</span>
                        </Link>
                        <Link href="https://www.linkedin.com/in/arda-abacı-631302320/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-1.5 bg-[#0A66C2]/10 rounded transition-all duration-300 shadow-[0_2px_0_0_rgba(10,102,194,0.25)] hover:shadow-[0_3px_0_0_rgba(10,102,194,0.45)] hover:bg-[#0A66C2]/20 active:translate-y-px group">
                            <FaLinkedin className="text-[#0A66C2]" />
                            <span className="text-sm text-white/80 group-hover:text-white">LinkedIn</span>
                        </Link>
                    </div>
                </div>
            </header>

            <section className="container mx-auto pt-12 pb-12 px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 border border-foreground/10 border-t border-b-0 border-r-0">
                    {projectItems.projects.map((item, index) => (
                        <Link href={item.href} className="project-card" key={index} target="_blank" rel="noopener noreferrer">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {item.href !== '#' && item.href.startsWith('https://github.com') && (
                                        <SiGithub />
                                    )}
                                    <span className="text-sm relative top-[0.45px]">{item.title}</span>
                                </div>
                                <p className="text-xs text-foreground/70 font-extralight">{item.date}</p>
                            </div>
                            <Image className="rounded max-h-[230px]" src={item.image} width={500} height={200} alt="Github Repository Image" />
                            <p className="text-sm text-foreground/70 font-light">{item.description}</p>
                            <div className="flex items-center gap-4">
                                {item.commits > 0 &&
                                    <div className="flex items-center gap-1">
                                        <GoCommit className="text-sm" />
                                        <span className="text-xs text-foreground/70 font-light">{item.commits}</span>
                                    </div>
                                }
                                <div className="flex items-center gap-1">
                                    <div className={`size-3 ${item.language.color} rounded-full`}></div>
                                    <span className="text-xs text-foreground/70 font-light">{item.language.name}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </section>
        </div>
    )
}