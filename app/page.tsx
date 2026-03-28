import Link from "next/link";
import { FaCss3, FaGithub, FaJava, FaJs, FaLinkedin, FaNodeJs, FaPhp, FaReact } from "react-icons/fa";
import { SiGit, SiLaravel, SiMongodb, SiMysql, SiNextdotjs, SiPhp, SiTailwindcss, SiTypescript } from "react-icons/si";

export default function Home() {
  return (
    <div className="flex flex-col">
      <header className="h-120 relative flex items-center justify-center">
        <div className="main-splash absolute inset-0 bg-position-[center_-116px] bg-no-repeat dark:brightness-[0.93] dark:-hue-rotate-[-160rad] dark:invert dark:saturate-[0.15]"></div>
        <div className="absolute inset-0 size-full dot-splash"></div>
        <div className="relative z-10 flex flex-col items-center justify-center gap-1">
          <div className="w-32 h-32 flex items-center justify-center rounded-full mb-2 bg-center! bg-cover!" style={{ background: "url(/assets/images/avatar.jpeg)"}} />
          <h1 className="text-3xl font-semibold">Merhaba, Ben Arda 👋</h1>
          <h3 className="text-lg text-foreground/50 font-extralight">Jr. Full-Stack Web Developer</h3>

          <div className="social-links flex items-center gap-3 relative top-4">
            <Link href="#" className="flex items-center gap-2 px-4 py-1.5 bg-black/20 rounded transition-all duration-300 shadow-[0_2px_0_0_rgba(0,0,0,0.35)] hover:shadow-[0_3px_0_0_rgba(0,0,0,0.5)] hover:bg-black/30 active:translate-y-px">
              <FaGithub />
              <span className="text-sm text-white/80 hover:text-white">Github</span>
            </Link>
            <Link href="#" className="flex items-center gap-2 px-4 py-1.5 bg-[#0A66C2]/10 rounded transition-all duration-300 shadow-[0_2px_0_0_rgba(10,102,194,0.25)] hover:shadow-[0_3px_0_0_rgba(10,102,194,0.45)] hover:bg-[#0A66C2]/20 active:translate-y-px group">
              <FaLinkedin className="text-[#0A66C2]" />
              <span className="text-sm text-white/80 group-hover:text-white">LinkedIn</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="container mx-auto grid lg:grid-cols-2 gap-10 pt-12 px-4">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <p className="text-2xl font-semibold">Hakkımda</p>
            <p className="text-foreground/50 font-light">
              Merhaba, ben Arda Abacı. 19 yaşındayım ve Junior Full-Stack Developer olarak web geliştirme alanında çalışıyorum.
              Frontend tarafında HTML, CSS, TailwindCSS ve React/Next.js ile modern,
              responsive ve kullanıcı odaklı arayüzler geliştiriyorum.
              Backend tarafında Node.js ile temel API geliştirme ve veritabanı
              entegrasyonu üzerine çalışıyor, full-stack mimarileri anlamaya ve
              uygulamaya odaklanıyorum.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-2xl font-semibold">Tech-Stack</p>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200">
                <FaJs className="text-yellow-400 text-sm" />
                <span className="text-sm">JavaScript</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200">
                <SiTypescript className="text-[#3178c6] text-sm" />
                <span className="text-sm">TypeScript</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200">
                <FaReact className="text-cyan-400 text-sm" />
                <span className="text-sm">React</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200">
                <SiNextdotjs className="text-white text-sm" />
                <span className="text-sm">Next.js</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200">
                <SiTailwindcss className="text-sky-400 text-sm" />
                <span className="text-sm">Tailwind</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200">
                <FaCss3 className="text-blue-400 text-sm" />
                <span className="text-sm">CSS</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200">
                <FaNodeJs className="text-green-500 text-sm" />
                <span className="text-sm">Node.js</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200">
                <FaPhp className="text-indigo-400 text-sm" />
                <span className="text-sm">PHP</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200">
                <SiLaravel className="text-red-500 text-sm" />
                <span className="text-sm">Laravel</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200">
                <SiMongodb className="text-green-400 text-sm" />
                <span className="text-sm">MongoDB</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200">
                <SiMysql className="text-blue-400 text-sm" />
                <span className="text-sm">MySQL</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200">
                <SiGit className="text-orange-400 text-sm" />
                <span className="text-sm">Git</span>
              </div>
            </div>
          </div>

        </div>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <p className="text-2xl font-semibold">Projelerim</p>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <SiNextdotjs className="text-white text-2xl" />
                <span className="font-medium">Atlasia Blog – Web App (Personal Project)</span>
              </div>

              <div className="flex-1 border-t border-foreground/[0.06] border-dashed"></div>

              <div className="text-foreground/60 whitespace-nowrap hidden md:block">
                2025 - Günümüz
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <SiNextdotjs className="text-white text-2xl" />
                <span className="font-medium">Fon Radar – Web App (Personal Project)</span>
              </div>

              <div className="flex-1 border-t border-foreground/[0.06] border-dashed"></div>

              <div className="text-foreground/60 whitespace-nowrap hidden md:block">
                2025 - Günümüz
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <SiNextdotjs className="text-white text-2xl" />
                <span className="font-medium">Freelance Web Developer – VerseCMS</span>
              </div>
              <div className="flex-1 border-t border-foreground/[0.06] border-dashed"></div>
              <div className="text-foreground/60 hidden md:block">2025 - Günümüz</div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FaJava className="text-orange-500 text-2xl" />
                <span className="font-medium">Banking System – Java OOP Simulation</span>
              </div>

              <div className="flex-1 border-t border-foreground/[0.06] border-dashed"></div>

              <div className="text-foreground/60 whitespace-nowrap hidden md:block">
                2025 - 2026
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <SiLaravel className="text-red-500 text-2xl" />
                <span className="font-medium">Freelance Web Developer – Ayşenur Uzun</span>
              </div>
              <div className="flex-1 border-t border-foreground/[0.06] border-dashed"></div>
              <div className="text-foreground/60 hidden md:block">2025 - Günümüz</div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <SiLaravel className="text-red-500 text-2xl" />
                <span className="font-medium">Freelance Web Developer – Modamix Armatür</span>
              </div>
              <div className="flex-1 border-t border-foreground/[0.06] border-dashed"></div>
              <div className="text-foreground/60 hidden md:block">2024 - Günümüz</div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-2xl font-semibold">Son Etkinliklerim</p>

            <div className="flex items-center gap-1 font-light text-foreground/50">
              <p>28 Mar -</p>
              <p>✨ Auth has been implemented</p>
              <Link href={'#'} className="hover:text-white transition-colors">
                abaciarda/nextjs-blog-project
              </Link>
            </div>
            <div className="flex items-center gap-1 font-light text-foreground/50">
              <p>28 Mar -</p>
              <p>✨ Auth has been implemented</p>
              <Link href={'#'} className="hover:text-white transition-colors">
                abaciarda/nextjs-blog-project
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
