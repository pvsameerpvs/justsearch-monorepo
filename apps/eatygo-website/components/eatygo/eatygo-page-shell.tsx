import type { ReactNode } from 'react';
import type { NavLink } from '@/lib/types/eatygo.types';
import { EatygoFooter } from './eatygo-footer';
import { EatygoHeader } from './eatygo-header';

interface EatygoPageShellProps {
  children: ReactNode;
  links: NavLink[];
}

export function EatygoPageShell({ children, links }: EatygoPageShellProps) {
  return (
    <div className="min-h-screen bg-[#fbfaf7] text-ink">
      <EatygoHeader links={links} />
      <main>{children}</main>
      <EatygoFooter />
    </div>
  );
}
