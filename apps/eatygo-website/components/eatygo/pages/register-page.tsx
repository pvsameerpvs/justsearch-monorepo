import type { RestaurantBenefit } from '@/lib/types/eatygo.types';
import { RestaurantGrowthSection } from '../restaurant/restaurant-growth-section';
import { SubPageHero } from '../shared/sub-page-hero';

interface RegisterPageProps {
  benefits: RestaurantBenefit[];
}

export function RegisterPage({ benefits }: RegisterPageProps) {
  return (
    <>
      <SubPageHero
        eyebrow="Register"
        title="Bring your restaurant into Eatygo"
        description="Share your restaurant details, choose what you need first, and connect your menus, QR tables, delivery, games, and website when integration starts."
      />
      <RestaurantGrowthSection benefits={benefits} />
    </>
  );
}
