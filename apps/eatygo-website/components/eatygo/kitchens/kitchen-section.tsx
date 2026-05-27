import type { Kitchen } from '@/lib/types/eatygo.types';
import { SectionHeading } from '../shared/section-heading';
import { StaggerContainer, StaggerItem } from '../shared/animations';
import { KitchenCard } from './kitchen-card';

interface KitchenSectionProps {
  kitchens: Kitchen[];
}

export function KitchenSection({ kitchens }: KitchenSectionProps) {
  return (
    <section id="restaurants" className="relative bg-[#fbfaf7] px-4 py-24 sm:px-6 lg:px-8">
      {/* Subtle top border */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="All restaurant list"
          title="Browse every restaurant ready for Eatygo ordering"
          description="Show popular restaurants, new kitchens, QR-table locations, delivery-ready brands, and featured dishes in one clean customer view."
        />

        <StaggerContainer className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
          {kitchens.map((kitchen) => (
            <StaggerItem key={kitchen.id}>
              <KitchenCard kitchen={kitchen} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
