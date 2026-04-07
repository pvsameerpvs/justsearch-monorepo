import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  external?: boolean;
};

const variantClasses = {
  primary:
    'bg-[rgb(var(--brand))] text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl',
  secondary:
    'bg-[rgb(var(--surface))] text-[rgb(var(--ink))] border border-[rgb(var(--border))] hover:border-[rgb(var(--brand))] hover:text-[rgb(var(--brand))]',
  outline:
    'bg-transparent text-[rgb(var(--brand))] border border-[rgb(var(--brand))] hover:bg-[rgb(var(--brand-soft))]',
  ghost:
    'bg-transparent text-[rgb(var(--ink))] hover:bg-black/5',
} as const;

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
} as const;

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className,
  external,
}: ButtonLinkProps) {
  const shared = cn(
    'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand))] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if (external) {
    return (
      <a href={href} className={shared} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={shared}>
      {children}
    </Link>
  );
}
