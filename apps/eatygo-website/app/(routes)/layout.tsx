import type { ReactNode } from 'react';
import { EatygoPageShell } from '@/components/eatygo/eatygo-page-shell';
import { NAV_LINKS } from '@/lib/constants/eatygo.constants';

export default function RoutesLayout({ children }: { children: ReactNode }) {
  return <EatygoPageShell links={NAV_LINKS}>{children}</EatygoPageShell>;
}
