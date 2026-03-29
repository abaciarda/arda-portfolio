import Image from "next/image";
import { GoCommit } from "react-icons/go";
import { SiGithub } from "react-icons/si";
import projectItems from "../data/project-items.json";
import Link from "next/link";
import { FaCss3, FaGithub, FaInstagram, FaJs, FaLinkedin, FaNodeJs, FaPhp, FaReact } from "react-icons/fa";
import { SiGit, SiLaravel, SiMongodb, SiMysql, SiNextdotjs, SiTailwindcss, SiTypescript } from "react-icons/si";

export default function ProjectsPage() {
    return (
        <div className="flex flex-col">
            <header className="h-120 relative flex items-center justify-center">
                <div className="main-splash absolute inset-0 bg-position-[center_-116px] bg-no-repeat dark:brightness-[0.93] dark:-hue-rotate-[-160rad] dark:invert dark:saturate-[0.15]"></div>
                <div className="absolute inset-0 size-full dot-splash"></div>
                <div className="container w-full mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-5">
                    <div className="min-w-38 min-h-38 flex items-center justify-center rounded-full relative top-2 bg-center! bg-cover!" style={{ background: "url(/assets/images/avatar.jpeg)" }} />

                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-semibold">
                            Hakkımda
                        </h1>

                        <h3 className="text-lg text-foreground/50 font-extralight max-w-150 leading-relaxed">
                            Modern web teknolojileri kullanarak ölçeklenebilir frontend arayüzler ve backend servisler geliştiren bir Jr. Full-Stack Developer’ım.</h3>
                        <div className="social-links flex items-center gap-3 relative top-4">
                            <Link href="https://github.com/abaciarda" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-1.5 bg-black/20 rounded transition-all duration-300 shadow-[0_2px_0_0_rgba(0,0,0,0.35)] hover:shadow-[0_3px_0_0_rgba(0,0,0,0.5)] hover:bg-black/30 active:translate-y-px">
                                <FaGithub />
                                <span className="text-sm text-white/80 hover:text-white">Github</span>
                            </Link>
                            <Link href="https://www.linkedin.com/in/arda-abacı-631302320/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-1.5 bg-[#0A66C2]/10 rounded transition-all duration-300 shadow-[0_2px_0_0_rgba(10,102,194,0.25)] hover:shadow-[0_3px_0_0_rgba(10,102,194,0.45)] hover:bg-[#0A66C2]/20 active:translate-y-px group">
                                <FaLinkedin className="text-[#0A66C2]" />
                                <span className="text-sm text-white/80 group-hover:text-white">LinkedIn</span>
                            </Link>
                            <Link href="https://www.instagram.com/ardaabacii_/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-1.5 bg-[#E1306C]/10 rounded transition-all duration-300 shadow-[0_2px_0_0_rgba(225,48,108,0.25)] hover:shadow-[0_3px_0_0_rgba(225,48,108,0.45)] hover:bg-[#E1306C]/20 active:translate-y-px group">
                                <FaInstagram className="text-[#E1306C]" />
                                <span className="text-sm text-white/80 group-hover:text-white">Instagram</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <section className="container mx-auto pt-12 pb-12 px-4 flex flex-col gap-10">
                <div className="grid md:grid-cols-2 gap-10 lg:gap-20">
                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-semibold">Hakkımda</h2>
                            <p className="text-foreground/60 leading-relaxed">
                                Merhaba, ben Arda Abacı. 19 yaşındayım ve Jr. Full-Stack Developer olarak web geliştirme alanında çalışıyorum.
                                Yazılıma olan ilgim küçük yaşlarda, oynadığım oyunlardaki sistemlerin nasıl çalıştığını merak etmemle başladı ve zamanla üretme isteğine dönüştü.
                            </p>

                            <p className="text-foreground/60 leading-relaxed">
                                Ortaokul döneminde WordPress ve hosting tabanlı basit web siteleri kurarak web dünyasına ilk adımlarımı attım.
                                Bu süreç bana web’in sadece tüketilen değil, aynı zamanda üretilebilen bir alan olduğunu gösterdi ve yazılım serüvenimin başlangıcını oluşturdu...
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-semibold">Eğitim</h2>
                            <p className="text-foreground/60 leading-relaxed">
                                Şu anda İstanbul Arel Üniversitesi Bilgisayar Mühendisliği (Türkçe) 2. sınıf öğrencisiyim.
                                Algoritma, veri yapıları ve yazılım mühendisliği temelleri üzerine çalışıyor, öğrendiklerimi pratik projelerle pekiştiriyorum.
                            </p>
                            <p className="text-foreground/60 leading-relaxed">
                                Lise eğitimimi Nezihe Hasan Kılıç Anadolu Lisesi’nde tamamladım ve yazılımla ilk ciddi tanışmam bu dönemde başladı.
                            </p>
                        </div>

                    </div>

                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-semibold">Odak Alanlarım</h2>

                            <div className="flex flex-col gap-3 text-foreground/60 leading-relaxed">
                                <p>
                                    Frontend tarafında React ve Next.js ile modern, performanslı ve kullanıcı odaklı arayüzler geliştiriyorum.
                                    Component tabanlı mimari, yeniden kullanılabilir yapı ve UI performansı üzerine odaklanıyorum.
                                </p>
                                <p>
                                    Backend tarafında Node.js ile REST API geliştirme, veri modelleme ve sistem tasarımı üzerine çalışıyorum.
                                    Daha önce PHP ve Laravel ile MVC mimarisi, routing ve authentication gibi backend yapılarını deneyimledim.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-semibold">Tech Stack</h2>
                            <div className="flex flex-wrap gap-2">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200 cursor-default">
                                    <FaJs className="text-yellow-400 text-sm" />
                                    <span className="text-sm">JavaScript</span>
                                </div>

                                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200 cursor-default">
                                    <SiTypescript className="text-[#3178c6] text-sm" />
                                    <span className="text-sm">TypeScript</span>
                                </div>

                                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200 cursor-default">
                                    <FaReact className="text-cyan-400 text-sm" />
                                    <span className="text-sm">React</span>
                                </div>

                                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200 cursor-default">
                                    <SiNextdotjs className="text-white text-sm" />
                                    <span className="text-sm">Next.js</span>
                                </div>

                                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200 cursor-default">
                                    <SiTailwindcss className="text-sky-400 text-sm" />
                                    <span className="text-sm">Tailwind</span>
                                </div>

                                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200 cursor-default">
                                    <FaCss3 className="text-blue-400 text-sm" />
                                    <span className="text-sm">CSS</span>
                                </div>

                                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200 cursor-default">
                                    <FaNodeJs className="text-green-500 text-sm" />
                                    <span className="text-sm">Node.js</span>
                                </div>

                                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200 cursor-default">
                                    <FaPhp className="text-indigo-400 text-sm" />
                                    <span className="text-sm">PHP</span>
                                </div>

                                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200 cursor-default">
                                    <SiLaravel className="text-red-500 text-sm" />
                                    <span className="text-sm">Laravel</span>
                                </div>

                                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200 cursor-default">
                                    <SiMongodb className="text-green-400 text-sm" />
                                    <span className="text-sm">MongoDB</span>
                                </div>

                                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200 cursor-default">
                                    <SiMysql className="text-blue-400 text-sm" />
                                    <span className="text-sm">MySQL</span>
                                </div>

                                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200 cursor-default">
                                    <SiGit className="text-orange-400 text-sm" />
                                    <span className="text-sm">Git</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}