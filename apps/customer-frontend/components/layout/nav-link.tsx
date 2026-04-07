'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

type NavLinkProps = {
  href: string;
  children: string;
};

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const active = href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        'rounded-full px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-[rgb(var(--brand-soft))] text-[rgb(var(--brand))]'
          : 'text-slate-600 hover:bg-black/5 hover:text-slate-900'
      )}
    >
      {children}
    </Link>
  );
}

