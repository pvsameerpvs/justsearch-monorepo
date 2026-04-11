import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { Surface } from '@/components/shared/surface';
import { cn } from '@/lib/cn';

type ProfileMenuItemProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  description: string;
  trailing?: string;
  className?: string;
};

export function ProfileMenuItem({
  href,
  icon: Icon,
  label,
  description,
  trailing,
  className,
}: ProfileMenuItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand))] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        className,
      )}
      aria-label={label}
    >
      <Surface className="flex items-center justify-between gap-4 rounded-[22px] border-[rgb(var(--border)/0.9)] bg-white/90 px-5 py-4 shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_14px_46px_rgba(15,23,42,0.10)]">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgb(var(--brand-soft)/0.55)] text-[rgb(var(--brand))]">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[rgb(var(--ink))]">
              {label}
            </p>
            <p className="truncate text-xs font-medium text-[rgb(var(--muted))]">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {trailing ? (
            <span className="rounded-full bg-[rgb(var(--brand-soft)/0.45)] px-3 py-1 text-xs font-semibold text-[rgb(var(--brand))]">
              {trailing}
            </span>
          ) : null}
          <ChevronRight className="h-5 w-5 text-slate-300 transition-colors group-hover:text-slate-400" />
        </div>
      </Surface>
    </Link>
  );
}
