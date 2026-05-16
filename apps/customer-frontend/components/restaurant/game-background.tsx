export function GameBackground() {
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(255,255,255,0.32),transparent_42%),radial-gradient(circle_at_90%_20%,rgba(255,255,255,0.2),transparent_44%),radial-gradient(circle_at_50%_84%,rgba(4,65,78,0.22),transparent_55%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-28 h-56 w-56 rounded-full bg-white/14 blur-2xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 bottom-24 h-60 w-60 rounded-full bg-[#0e6f83]/26 blur-3xl" />
    </>
  );
}
