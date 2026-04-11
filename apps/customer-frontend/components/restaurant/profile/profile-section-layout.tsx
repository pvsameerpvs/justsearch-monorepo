"use client";

import { Container } from '@/components/shared/container';
import { cn } from '@/lib/cn';

type ProfileSectionLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function ProfileSectionLayout({
  title,
  description,
  children,
  className,
}: ProfileSectionLayoutProps) {
  return (
    <section className="py-8 sm:py-10">
      <Container className={cn("max-w-4xl", className)}>
        <div className="mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-[-0.07em] text-[rgb(var(--ink))]">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-base font-medium text-[rgb(var(--muted))]">
                {description}
              </p>
            )}
          </div>
        </div>

        {children}
      </Container>
    </section>
  );
}
