import { Sparkles, BadgeCheck } from 'lucide-react';
import { Container } from '@/components/shared/container';
import { Pill } from '@/components/shared/pill';
import { ButtonLink } from '@/components/shared/button-link';
import { BrandMark } from './brand-mark';
import { NavLink } from './nav-link';
import { accountNavLinks, primaryNavLinks } from '@/lib/navigation';
import { demoRestaurant } from '@/lib/demo-data';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-[rgba(250,246,239,0.82)] backdrop-blur-xl">
      <Container className="py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BrandMark initials={demoRestaurant.initials} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[rgb(var(--brand))]">
                  JustSearch Live
                </p>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-lg font-semibold tracking-[-0.03em] text-[rgb(var(--ink))]">
                    {demoRestaurant.name}
                  </h1>
                  <Pill tone="brand">{demoRestaurant.category}</Pill>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <Pill tone="success">
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  Checked in
                </span>
              </Pill>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {primaryNavLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="hidden items-center gap-2 lg:flex">
              <Pill tone="success">
                <span className="inline-flex items-center gap-1">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {demoRestaurant.session.state === 'active' ? 'Session active' : 'Session expired'}
                </span>
              </Pill>
            </div>
            <div className="flex items-center gap-2">
              {accountNavLinks.map((link) => (
                <ButtonLink key={link.href} href={link.href} variant={link.label === 'Profile' ? 'primary' : 'secondary'} size="sm">
                  {link.label}
                </ButtonLink>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
