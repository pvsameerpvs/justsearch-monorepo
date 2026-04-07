import type { ReactNode } from 'react';
import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { Pill } from '@/components/shared/pill';

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  badge?: string;
};

export function AuthShell({ title, description, children, badge = 'Account access' }: AuthShellProps) {
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Surface className="p-8">
            <div className="space-y-4">
              <Pill tone="brand">{badge}</Pill>
              <h2 className="font-display text-4xl font-semibold tracking-[-0.06em] text-[rgb(var(--ink))]">
                {title}
              </h2>
              <p className="max-w-xl text-sm leading-6 text-slate-600">{description}</p>
            </div>
          </Surface>
          {children}
        </div>
      </Container>
    </section>
  );
}

