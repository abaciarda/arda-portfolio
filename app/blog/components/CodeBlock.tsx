export default function CodeBlock({ code, language = "css" }: { code: string; language?: string }) {
  return (
    <div className="relative my-4 rounded overflow-hidden border border-foreground/10">
      <div className="flex items-center justify-between px-4 py-2 bg-foreground/5 border-b border-foreground/10">
        <span className="text-[10px] uppercase tracking-widest text-foreground/30 font-mono">{language}</span>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/40"></div>
        </div>
      </div>
      <pre className="p-4 text-sm font-mono text-foreground/70 overflow-x-auto bg-black/30 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
