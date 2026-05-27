import type { RestaurantBenefit } from '@/lib/types/eatygo.types';
import { SectionHeading } from '../shared/section-heading';
import { RestaurantBenefitList } from './restaurant-benefit-list';
import { RestaurantRegisterPanel } from './restaurant-register-panel';

interface RestaurantGrowthSectionProps {
  benefits: RestaurantBenefit[];
}

export function RestaurantGrowthSection({ benefits }: RestaurantGrowthSectionProps) {
  return (
    <section id="register" className="bg-[#101820] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_0.8fr] lg:items-start">
        <div>
          <SectionHeading
            eyebrow="For restaurant owners"
            title="Why choose Eatygo for your restaurant?"
            description="Eatygo helps restaurants look premium online, accept more order types, keep table service simple, and bring customers back with games and loyalty."
            dark
          />
          <RestaurantBenefitList benefits={benefits} />
        </div>
        <RestaurantRegisterPanel />
      </div>
    </section>
  );
}
