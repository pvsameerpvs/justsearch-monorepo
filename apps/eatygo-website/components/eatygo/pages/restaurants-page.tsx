import type { Kitchen } from '@/lib/types/eatygo.types';
import { KitchenSection } from '../kitchens/kitchen-section';
import { SubPageHero } from '../shared/sub-page-hero';

interface RestaurantsPageProps {
  kitchens: Kitchen[];
}

export function RestaurantsPage({ kitchens }: RestaurantsPageProps) {
  return (
    <>
      <SubPageHero
        eyebrow="Restaurants"
        title="All restaurants can be listed, promoted, and ordered from"
        description="Eatygo is ready for your restaurant list, including popular places, new kitchens, QR table restaurants, delivery-ready brands, and featured dishes."
      />
      <KitchenSection kitchens={kitchens} />
    </>
  );
}
