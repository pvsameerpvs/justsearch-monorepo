import type { LucideIcon } from "lucide-react";

interface DomainLinkProps {
  label: string;
  url: string;
  icon: LucideIcon;
}

export function DomainLink({ label, url, icon: Icon }: DomainLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </a>
  );
}
