import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";

interface BlogCardProps {
  title: string;
  image: string;
  excerpt: string;
  date: string;
  slug: string;
  category?: string;
}

export default function BlogCard({ title, image, excerpt, date, slug, category }: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="group flex flex-col gap-4 p-5 transition-all duration-200 hover:bg-foreground/2 border-r border-b border-white/10">
      <div className="flex items-center justify-between gap-4">
        <span className="text-[10px] font-medium uppercase tracking-wider text-foreground/40 group-hover:text-foreground/60 transition-colors">
          {category}
        </span>
        <div className="text-[10px] text-foreground/30 group-hover:text-foreground/50 transition-colors">
          {date}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-base font-medium text-foreground group-hover:text-white transition-colors">
          {title}
        </h3>
        <div className="w-full max-h-[200px] min-h-[180px] rounded bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
        <p className="text-sm text-foreground/50 font-light leading-relaxed line-clamp-2">
          {excerpt}
        </p>
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-[11px] font-light text-foreground/30 group-hover:text-foreground/80 transition-colors">
        <span>Yazıyı oku</span>
        <FaChevronRight className="text-[8px] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
      </div>
    </Link>
  );
}
