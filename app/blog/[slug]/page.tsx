import Link from "next/link";
import { FaChevronLeft, FaChevronRight, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { SiTailwindcss } from "react-icons/si";
import TableOfContents from "../components/TableOfContents";
import CodeBlock from "../components/CodeBlock";
import Badge from "../components/Badge";
import InfoBox from "../components/InfoBox";
import ComparisonTable from "../components/ComparisonTable";
import { Metadata } from "next";

interface BlogSection {
    id: string;
    title: string;
    content: string;
    code?: string;
    codeLanguage?: string;
}


const POST = {
    title: "Tailwind CSS v4: PostCSS'e Veda, Hıza Merhaba",
    subtitle:
        "Konfigürasyon dosyasından CSS-first yaklaşımına, Oxide engine'den yeni @theme direktifine kadar v4'ün her köşesini inceledim. Gerçekten bu kadar hızlı mı?",
    date: "28 Mart 2026",
    readTime: "8 dk okuma",
    category: "Tasarım",
    author: "Arda Abacı",
    tags: ["tailwindcss", "css", "frontend", "performans"],
};

const SECTIONS = [
    { id: "giris", title: "Neden v4?" },
    { id: "oxide-engine", title: "Oxide Engine" },
    { id: "css-first", title: "CSS-First Yaklaşım" },
    { id: "theme-direktifi", title: "@theme Direktifi" },
    { id: "yeni-ozellikler", title: "Yeni Özellikler" },
    { id: "migration", title: "Geçiş Süreci" },
    { id: "sonuc", title: "Sonuç" },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: POST.title,
        description: POST.subtitle,
        openGraph: {
            title: POST.title,
            description: POST.subtitle,
            type: "article",
            publishedTime: new Date().toISOString(),
            authors: [POST.author],
            url: `https://ardaabaci.com/blog/${slug}`,
            images: [
                {
                    url: "/assets/images/blog/tailwind-article.webp",
                    width: 1200,
                    height: 630,
                    alt: POST.title,
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            title: POST.title,
            description: POST.subtitle,
            images: ["/assets/images/blog/tailwind-article.webp"],
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }>; }) {
    const { slug } = await params;

    return (
        <div className="flex flex-col">
            <header className="h-120 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 size-full dot-splash z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-sky-950/60 via-black to-cyan-950/40"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-400/8 rounded-full blur-3xl pointer-events-none"></div>

                <Link
                    href="/blog"
                    className="absolute top-24 left-4 md:left-8 z-20 hidden md:flex items-center gap-1.5 text-xs text-foreground/40 hover:text-foreground/80 transition-colors"
                >
                    <FaChevronLeft className="text-[10px]" />
                    Blog'a dön
                </Link>

                <div className="container w-full mx-auto px-4 relative z-20 flex flex-col gap-3 max-w-3xl">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge color="blue">Tasarım</Badge>
                        <span className="text-[10px] text-foreground/30">•</span>
                        <span className="text-[10px] text-foreground/40 font-light">{POST.date}</span>
                        <span className="text-[10px] text-foreground/30">•</span>
                        <span className="text-[10px] text-foreground/40 font-light">{POST.readTime}</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight">
                        {POST.title}
                    </h1>

                    <p className="text-base text-foreground/50 font-extralight leading-relaxed max-w-2xl">
                        {POST.subtitle}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                        <div
                            className="w-7 h-7 rounded-full bg-cover bg-center border border-white/10"
                            style={{ backgroundImage: "url(/assets/images/avatar.jpeg)" }}
                        />
                        <span className="text-sm text-foreground/60 font-light">{POST.author}</span>
                    </div>

                    <div className="social-links flex items-center gap-2 relative mt-2">
                        <Link href="https://github.com/abaciarda" target="_blank" rel="noopener noreferrer" className="p-1.5 text-foreground/40 hover:text-white transition-colors">
                            <FaGithub className="text-sm" />
                        </Link>
                        <Link href="https://www.linkedin.com/in/arda-abacı-631302320/" target="_blank" rel="noopener noreferrer" className="p-1.5 text-foreground/40 hover:text-[#0A66C2] transition-colors">
                            <FaLinkedin className="text-sm" />
                        </Link>
                        <Link href="https://www.instagram.com/ardaabacii_/" target="_blank" rel="noopener noreferrer" className="p-1.5 text-foreground/40 hover:text-[#E1306C] transition-colors">
                            <FaInstagram className="text-sm" />
                        </Link>
                    </div>
                </div>
            </header>

            <section className="container mx-auto pt-12 pb-20 px-4">
                <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">

                    <aside className="hidden lg:block w-56 flex-shrink-0">
                        <TableOfContents sections={SECTIONS} />
                    </aside>

                    <article className="flex-1 min-w-0 max-w-2xl">

                        <div className="flex items-center gap-3 mb-8 p-4 border border-foreground/10 rounded bg-foreground/2">
                            <SiTailwindcss className="text-sky-400 text-3xl flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-foreground/80">Tailwind CSS v4.0</p>
                                <p className="text-xs text-foreground/40 font-light">14 Ocak 2025'te genel erişime açıldı</p>
                            </div>
                            <div className="ml-auto flex gap-2">
                                <Badge color="green">Stable</Badge>
                            </div>
                        </div>

                        <section id="giris" className="mb-10">
                            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <span className="text-foreground/20 font-mono text-sm">01</span>
                                Neden v4?
                            </h2>
                            <p className="text-foreground/60 font-light leading-relaxed mb-4">
                                Tailwind CSS, 2019'dan bu yana utility-first CSS'in en popüler temsilcisi oldu. Ama v3 ile birlikte gelen
                                JIT motoru, <code className="text-sky-400/80 bg-sky-500/10 px-1 rounded text-sm font-mono">tailwind.config.js</code>
                                {" "}dosyasının giderek karmaşıklaşması ve PostCSS bağımlılığı — tüm bunlar, ekibin sıfırdan bir şeyler
                                inşa etmesi için yeterli nedendi.
                            </p>
                            <p className="text-foreground/60 font-light leading-relaxed">
                                v4'ün temel hedefi şu: <em className="text-foreground/80 not-italic font-normal">daha hızlı, daha az konfigürasyon, daha çok CSS standartları</em>.
                                Ve spoiler — büyük ölçüde başarıyorlar.
                            </p>
                        </section>

                        <section id="oxide-engine" className="mb-10">
                            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <span className="text-foreground/20 font-mono text-sm">02</span>
                                Oxide Engine
                            </h2>
                            <p className="text-foreground/60 font-light leading-relaxed mb-4">
                                v4'ün kalbinde <strong className="text-foreground/80 font-medium">Oxide</strong> adı verilen, Rust ile yazılmış yeni bir build engine var.
                                Bu geçiş, derleme sürelerinde dramatik bir iyileşme sağlıyor:
                            </p>

                            <div className="grid grid-cols-2 gap-3 my-6">
                                {[
                                    { label: "İlk Derleme", v3: "~1.500ms", v4: "~35ms", improvement: "43×" },
                                    { label: "Artımlı", v3: "~150ms", v4: "~4ms", improvement: "37×" },
                                ].map((m) => (
                                    <div key={m.label} className="border border-foreground/10 p-4 rounded flex flex-col gap-2">
                                        <p className="text-[10px] uppercase tracking-widest text-foreground/30">{m.label}</p>
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-xs text-foreground/30 font-mono line-through">{m.v3}</p>
                                                <p className="text-lg font-semibold text-sky-400 font-mono">{m.v4}</p>
                                            </div>
                                            <Badge color="green">{m.improvement} daha hızlı</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <InfoBox type="info" title="Nasıl ölçüldü?">
                                Bu rakamlar Tailwind'in kendi benchmark testlerinden alınmıştır. Gerçek proje boyutuna göre
                                oranlar değişebilir, ancak genel eğilim tutarlıdır.
                            </InfoBox>
                        </section>

                        <section id="css-first" className="mb-10">
                            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <span className="text-foreground/20 font-mono text-sm">03</span>
                                CSS-First Yaklaşım
                            </h2>
                            <p className="text-foreground/60 font-light leading-relaxed mb-4">
                                v3'te tüm konfigürasyon JavaScript'te yapılırdı. v4 bu düzeni tersine çeviriyor: artık
                                konfigürasyon doğrudan CSS dosyasında, <code className="text-sky-400/80 bg-sky-500/10 px-1 rounded text-sm font-mono">@import "tailwindcss"</code> ile başlıyor.
                            </p>

                            <CodeBlock
                                language="css — v3 (eski)"
                                code={`/* postcss.config.js */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

/* tailwind.config.js */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: { brand: '#0ea5e9' }
    }
  }
}`}
                            />

                            <CodeBlock
                                language="css — v4 (yeni)"
                                code={`/* globals.css — tek dosya, hepsi burada */
@import "tailwindcss";

@theme {
  --color-brand: #0ea5e9;
  --font-display: 'Geist', sans-serif;
  --radius-card: 0.75rem;
}`}
                            />

                            <p className="text-foreground/60 font-light leading-relaxed">
                                PostCSS konfigürasyonu artık gerekli değil. Vite kullanıyorsanız{" "}
                                <code className="text-sky-400/80 bg-sky-500/10 px-1 rounded text-sm font-mono">@tailwindcss/vite</code> plugin'i yeterli.
                            </p>
                        </section>

                        <section id="theme-direktifi" className="mb-10">
                            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <span className="text-foreground/20 font-mono text-sm">04</span>
                                @theme Direktifi
                            </h2>
                            <p className="text-foreground/60 font-light leading-relaxed mb-4">
                                <code className="text-sky-400/80 bg-sky-500/10 px-1 rounded text-sm font-mono">@theme</code> bloğunda
                                tanımladığınız her değişken, otomatik olarak hem CSS custom property hem de Tailwind utility class olarak kullanılabilir hale geliyor.
                            </p>

                            <CodeBlock
                                language="css"
                                code={`@theme {
  /* Bu tanım şunları üretir:
     - CSS var: --color-electric
     - Utility: bg-electric, text-electric, border-electric
  */
  --color-electric: oklch(65% 0.25 250);

  /* Spacing */
  --spacing-18: 4.5rem; /* → p-18, m-18, gap-18 */

  /* Animasyonlar */
  --animate-slide-in: slide-in 0.3s ease-out;
}`}
                            />

                            <InfoBox type="tip" title="OKLCH renk uzayı">
                                v4, renk tanımlarında OKLCH kullanımını teşvik ediyor. P3 geniş renk gamutunu destekleyen
                                modern tarayıcılarda çok daha canlı renkler elde ediyorsunuz.
                            </InfoBox>
                        </section>

                        <section id="yeni-ozellikler" className="mb-10">
                            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <span className="text-foreground/20 font-mono text-sm">05</span>
                                Yeni Özellikler
                            </h2>
                            <p className="text-foreground/60 font-light leading-relaxed mb-6">
                                v4 salt bir refactor değil — yeni utility'ler ve variant'larla geliyor:
                            </p>

                            <div className="flex flex-col gap-3">
                                {[
                                    {
                                        title: "field-sizing-content",
                                        desc: "Textarea'ların içeriğe göre otomatik büyümesi artık tek class ile mümkün.",
                                        badge: "Yeni utility" as const,
                                        color: "green" as const,
                                    },
                                    {
                                        title: "@starting-style desteği",
                                        desc: "display: none'dan animate etmek artık pure CSS ile mümkün. JS opacity trick'lerine elveda.",
                                        badge: "Yeni variant" as const,
                                        color: "blue" as const,
                                    },
                                    {
                                        title: "not-* variant",
                                        desc: "not-hover:opacity-50 gibi negasyon variant'ları artık built-in olarak geliyor.",
                                        badge: "Yeni variant" as const,
                                        color: "blue" as const,
                                    },
                                    {
                                        title: "inert variant",
                                        desc: "inert attribute'una sahip elementler için özel stil tanımlayabilirsiniz.",
                                        badge: "Yeni variant" as const,
                                        color: "orange" as const,
                                    },
                                ].map((f) => (
                                    <div
                                        key={f.title}
                                        className="flex gap-3 p-4 border border-foreground/10 rounded hover:bg-foreground/2 transition-colors group"
                                    >
                                        <div className="flex flex-col gap-1 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <code className="text-sky-400/80 bg-sky-500/10 px-1.5 py-0.5 rounded text-xs font-mono">
                                                    {f.title}
                                                </code>
                                                <Badge color={f.color}>{f.badge}</Badge>
                                            </div>
                                            <p className="text-sm text-foreground/50 font-light">{f.desc}</p>
                                        </div>
                                        <FaChevronRight className="text-[10px] text-foreground/20 group-hover:text-foreground/50 transition-colors mt-1 flex-shrink-0" />
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section id="migration" className="mb-10">
                            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <span className="text-foreground/20 font-mono text-sm">06</span>
                                Geçiş Süreci
                            </h2>
                            <p className="text-foreground/60 font-light leading-relaxed mb-4">
                                v3'ten v4'e geçiş için resmi migration tool mevcut. Çoğu breaking change otomatik çözülüyor:
                            </p>

                            <CodeBlock
                                language="bash"
                                code={`# Otomatik migration
npx @tailwindcss/upgrade@next

# Manuel kurulum (yeni proje)
npm install tailwindcss@next @tailwindcss/vite`}
                            />

                            <p className="text-foreground/60 font-light leading-relaxed mb-4">
                                v3 ile v4 arasındaki temel farkların özeti:
                            </p>

                            <ComparisonTable />

                            <InfoBox type="warning" title="Breaking changes var">
                                <code className="text-orange-400/80 font-mono text-xs">bg-opacity-*</code>,{" "}
                                <code className="text-orange-400/80 font-mono text-xs">text-opacity-*</code> gibi utility'ler kaldırıldı.
                                Bunların yerine artık <code className="text-orange-400/80 font-mono text-xs">bg-black/50</code> sözdizimi kullanılıyor.
                                Migration tool büyük çoğunluğunu otomatik dönüştürüyor.
                            </InfoBox>
                        </section>

                        <section id="sonuc" className="mb-10">
                            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <span className="text-foreground/20 font-mono text-sm">07</span>
                                Sonuç
                            </h2>
                            <p className="text-foreground/60 font-light leading-relaxed mb-4">
                                Tailwind CSS v4, hem bir teknik yeniden yazım hem de felsefi bir kırılma noktası.
                                CSS-first yaklaşım, modern web standartlarına (cascade layers, custom properties, OKLCH) daha sıkı
                                yaslanmak anlamına geliyor — bu iyi bir şey.
                            </p>
                            <p className="text-foreground/60 font-light leading-relaxed mb-4">
                                Build hızı farkı günlük geliştirme deneyiminde gözle görülür biçimde hissediliyor.
                                Özellikle büyük projelerde hot-reload gecikmelerinin neredeyse sıfırlanması, akışı dramatik ölçüde iyileştiriyor.
                            </p>
                            <p className="text-foreground/60 font-light leading-relaxed">
                                Yeni bir projeye başlıyorsanız: doğrudan v4 kullanın. Mevcut bir projeniz varsa: migration tool'u deneyin,
                                büyük ihtimalle sorunsuz geçeceksiniz.
                            </p>
                        </section>

                        <div className="flex flex-wrap gap-2 pt-6 border-t border-foreground/10">
                            {POST.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-[10px] uppercase tracking-widest text-foreground/30 bg-foreground/5 border border-foreground/10 px-2.5 py-1 rounded hover:text-foreground/60 hover:border-foreground/20 transition-colors cursor-default"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        <div className="mt-8 p-5 border border-foreground/10 rounded flex items-start gap-4">
                            <div
                                className="w-12 h-12 rounded-full bg-cover bg-center border border-white/10 flex-shrink-0"
                                style={{ backgroundImage: "url(/assets/images/avatar.jpeg)" }}
                            />
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium">{POST.author}</p>
                                <p className="text-xs text-foreground/40 font-light leading-relaxed">
                                    Jr. Full-Stack Developer. Next.js, TypeScript ve modern CSS'e meraklı. Öğrendiklerimi burada yazıyorum.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center justify-between gap-4 border-t border-foreground/10 pt-6">
                            <Link
                                href="/blog"
                                className="flex items-center gap-1.5 text-xs text-foreground/40 hover:text-foreground/80 transition-colors"
                            >
                                <FaChevronLeft className="text-[10px]" />
                                Tüm yazılar
                            </Link>
                            <span className="text-foreground/20 text-xs">•</span>
                            <Link
                                href="/blog/nextjs-15-yenilikler"
                                className="flex items-center gap-1.5 text-xs text-foreground/40 hover:text-foreground/80 transition-colors"
                            >
                                Sonraki yazı
                                <FaChevronRight className="text-[10px]" />
                            </Link>
                        </div>

                    </article>
                </div>
            </section>
        </div>
    );
}