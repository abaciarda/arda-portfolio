export default function PageHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <header className="min-h-120 py-24 relative flex items-center justify-center">
      <div className="main-splash absolute inset-0 bg-position-[center_-116px] bg-no-repeat brightness-[0.93] -hue-rotate-[-160rad] invert saturate-[0.15]" />
      <div className="absolute inset-0 size-full dot-splash" />
      <div className="container w-full mx-auto px-4 relative z-10">
        {children}
      </div>
    </header>
  );
}
