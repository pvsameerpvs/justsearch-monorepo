import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Surface } from '@/components/shared/surface';
import { cn } from '@/lib/cn';

type RestaurantFeatureCardProps = {
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
};

export function RestaurantFeatureCard({
  title,
  eyebrow,
  description,
  href,
  icon: Icon,
  className,
  iconClassName,
}: RestaurantFeatureCardProps) {
  return (
    <Surface
      className={cn(
        'group h-full rounded-[28px] border-[rgba(var(--card-border),0.9)] bg-[rgba(var(--card-surface),0.88)] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)] sm:p-6 lg:p-4 xl:p-5',
        className
      )}
    >
      <Link href={href} className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand))] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent">
        <div className="flex items-start justify-between gap-4">
          <div
            className={cn(
              'inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(var(--card-border),0.85)] bg-[rgba(var(--card-surface-muted),0.95)] shadow-sm',
              iconClassName
            )}
          >
            <Icon className="h-5 w-5 text-[rgb(var(--brand))]" />
          </div>
          <span className="rounded-full border border-[rgba(var(--border),0.7)] bg-[rgba(var(--card-surface),0.82)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
            {eyebrow}
          </span>
        </div>

        <div className="mt-6">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.06em] text-[rgb(var(--ink))] sm:text-3xl lg:text-2xl xl:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))] lg:mt-2 lg:leading-5">
            {description}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-6 text-sm font-semibold text-[rgb(var(--brand))] lg:pt-4">
          <span>Open page</span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </Link>
    </Surface>
  );
}
