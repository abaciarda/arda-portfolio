import BlogCard from "../components/BlogCard";

const SAMPLE_POSTS = [
  {
    title: "Next.js 15 ile Gelen Yenilikler",
    image: "/assets/images/blog/nextjs-article.webp",
    excerpt: "Yeni sürümle birlikte gelen App Router iyileştirmeleri, kısmi ön işleme ve React 19 desteği üzerine bir inceleme.",
    date: "29 Mart 2026",
    slug: "nextjs-15-yenilikler",
    category: "Geliştirme"
  },
  {
    title: "Tailwind CSS v4: Baştan Sona Değişim",
    image: "/assets/images/blog/tailwind-article.webp",
    excerpt: "PostCSS ve config dosyalarına veda ettiğimiz, performansın zirve yaptığı yeni Tailwind sürümü hakkında her şey.",
    date: "28 Mart 2026",
    slug: "tailwind-css-v4-inceleme",
    category: "Tasarım"
  },
  {
    title: "Full-Stack Geliştirici Yol Haritası",
    image: "/assets/images/blog/fullstack-article.png",
    excerpt: "2026 yılında bir full-stack geliştirici hangi teknolojilere odaklanmalı? Modern web ekosistemine dair ipuçları.",
    date: "25 Mart 2026",
    slug: "full-stack-yol-haritasi",
    category: "Kariyer"
  }
];

export default function BlogPage() {
  return (
    <div className="flex flex-col">
      <header className="h-120 relative flex items-center justify-center">
        <div className="main-splash absolute inset-0 bg-position-[center_-116px] bg-no-repeat dark:brightness-[0.93] dark:-hue-rotate-[-160rad] dark:invert dark:saturate-[0.15]"></div>
        <div className="absolute inset-0 size-full dot-splash"></div>
        <div className="container w-full mx-auto px-4 relative z-10 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Son Blog Yazılarım
          </h1>
          <h3 className="text-lg text-foreground/50 font-extralight max-w-150 leading-relaxed">
            Deneyimlerimi, teknik notlarımı ve web geliştirme dünyasından paylaştığım yazıları burada bulabilirsiniz.
          </h3>
        </div>
      </header>

      <section className="container mx-auto pt-12 pb-12 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 border border-foreground/10 border-t border-b-0 border-r-0">
          {SAMPLE_POSTS.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>
      </section>
    </div>
  );
}
