interface SidebarTooltipProps {
  children: React.ReactNode;
  label: string;
}

export function SidebarTooltip({ children, label }: SidebarTooltipProps) {
  return (
    <div className="group relative flex items-center justify-center">
      {children}
      <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-xl shadow-slate-900/15 transition-opacity duration-200 after:absolute after:-left-1 after:top-1/2 after:h-2 after:w-2 after:-translate-y-1/2 after:rotate-45 after:bg-slate-950 group-hover:opacity-100">
        {label}
      </span>
    </div>
  );
}
