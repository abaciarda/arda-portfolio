interface TableOfContentsProps {
  sections: { id: string; title: string }[];
}

export default function TableOfContents({ sections }: TableOfContentsProps) {
  return (
    <nav className="sticky top-24 flex flex-col gap-1 border border-foreground/10 p-4 rounded">
      <p className="text-xs uppercase tracking-widest text-foreground/30 font-medium mb-2">İçindekiler</p>
      {sections.map((s, i) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="flex items-center gap-2 text-sm text-foreground/40 hover:text-foreground/90 transition-colors py-0.5 group"
        >
          <span className="text-[10px] text-foreground/20 group-hover:text-foreground/40 font-mono w-4">{String(i + 1).padStart(2, '0')}</span>
          {s.title}
        </a>
      ))}
    </nav>
  );
}
