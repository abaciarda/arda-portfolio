export default function ComparisonTable() {
  const rows = [
    { feature: "Konfigürasyon", v3: "tailwind.config.js", v4: "CSS @theme direktifi" },
    { feature: "Build aracı", v3: "PostCSS zorunlu", v4: "Vite plugin / CLI" },
    { feature: "İlk derleme", v3: "~1.5s", v4: "~35ms" },
    { feature: "Artımlı derleme", v3: "~150ms", v4: "~4ms" },
    { feature: "CSS değişkenleri", v3: "Manuel", v4: "Otomatik üretim" },
    { feature: "dark: variant", v3: "class / media", v4: "+ @custom-variant" },
  ];

  return (
    <div className="my-6 border border-foreground/10 rounded overflow-hidden">
      <div className="grid grid-cols-3 text-[10px] uppercase tracking-widest text-foreground/30 font-medium bg-foreground/5 border-b border-foreground/10">
        <div className="px-4 py-3">Özellik</div>
        <div className="px-4 py-3 border-l border-foreground/10">v3</div>
        <div className="px-4 py-3 border-l border-foreground/10 text-sky-400">v4 ✦</div>
      </div>
      {rows.map((row, i) => (
        <div key={i} className={`grid grid-cols-3 text-sm ${i !== rows.length - 1 ? "border-b border-foreground/10" : ""}`}>
          <div className="px-4 py-3 text-foreground/60 font-light">{row.feature}</div>
          <div className="px-4 py-3 text-foreground/40 font-light border-l border-foreground/10 font-mono text-xs">{row.v3}</div>
          <div className="px-4 py-3 text-sky-400/80 font-light border-l border-foreground/10 font-mono text-xs">{row.v4}</div>
        </div>
      ))}
    </div>
  );
}
