interface SidebarTooltipProps {
  children: React.ReactNode;
  label: string;
}

export function SidebarTooltip({ children, label }: SidebarTooltipProps) {
  return (
    <div className="group relative flex items-center justify-center">
      {children}
      <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50 shadow-lg">
        {label}
      </span>
    </div>
  );
}
