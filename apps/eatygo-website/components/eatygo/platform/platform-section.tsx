import type { PlatformFeature } from '@/lib/types/eatygo.types';
import { SectionHeading } from '../shared/section-heading';
import { StaggerContainer, StaggerItem } from '../shared/animations';
import { PlatformFeatureCard } from './platform-feature-card';

interface PlatformSectionProps {
  features: PlatformFeature[];
}

export function PlatformSection({ features }: PlatformSectionProps) {
  return (
    <section id="platform" className="relative bg-white px-4 py-24 sm:px-6 lg:px-8">
      {/* Decorative top border */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-end">
          <SectionHeading
            eyebrow="Restaurant platform"
            title="One Eatygo system for every restaurant touchpoint"
            description="Restaurants can run customer websites, table QR ordering, delivery, games, loyalty, and admin operations from a single branded platform."
          />
          <p className="max-w-xl text-sm leading-6 text-slate-500 lg:justify-self-end">
            The website explains everything now, and the restaurant integrations can connect later
            when your onboarding, menus, QR codes, orders, and delivery data are ready.
          </p>
        </div>

        <StaggerContainer className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
          {features.map((feature) => (
            <StaggerItem key={feature.id}>
              <PlatformFeatureCard feature={feature} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
