export default function Badge({ children, color = "default" }: { children: React.ReactNode; color?: "blue" | "green" | "orange" | "default" }) {
  const colors = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    default: "bg-foreground/5 text-foreground/50 border-foreground/10",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border uppercase tracking-wider ${colors[color]}`}>
      {children}
    </span>
  );
}
