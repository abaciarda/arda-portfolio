export default function InfoBox({ type, title, children }: { type: "tip" | "warning" | "info"; title: string; children: React.ReactNode }) {
  const styles = {
    tip: "border-green-500/20 bg-green-500/5",
    warning: "border-orange-500/20 bg-orange-500/5",
    info: "border-blue-500/20 bg-blue-500/5",
  };
  const icons = { tip: "✦", warning: "⚠", info: "ℹ" };
  const textColors = { tip: "text-green-400", warning: "text-orange-400", info: "text-blue-400" };

  return (
    <div className={`my-6 p-4 rounded border ${styles[type]} flex gap-3`}>
      <span className={`${textColors[type]} text-sm mt-0.5 shrink-0`}>{icons[type]}</span>
      <div>
        <p className={`text-sm font-medium ${textColors[type]} mb-1`}>{title}</p>
        <div className="text-sm text-foreground/50 font-light leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
