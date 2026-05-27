import type { HeroMetric, Highlight, Kitchen, OrderStep, PlatformFeature } from '@/lib/types/eatygo.types';
import { EatygoHero } from './hero/eatygo-hero';
import { KitchenSection } from './kitchens/kitchen-section';
import { MobileShowcaseSection } from './mobile-showcase/mobile-showcase-section';
import { OrderFlow } from './order/order-flow';
import { PlatformSection } from './platform/platform-section';
import { RestaurantKitSection } from './restaurant-kit/restaurant-kit-section';
import { StatsSection } from './stats/stats-section';

interface EatygoPresenterProps {
  metrics: HeroMetric[];
  tags: string[];
  kitchens: Kitchen[];
  steps: OrderStep[];
  highlights: Highlight[];
  platformFeatures: PlatformFeature[];
}

export function EatygoPresenter({
  metrics,
  tags,
  kitchens,
  steps,
  highlights,
  platformFeatures,
}: EatygoPresenterProps) {
  return (
    <div className="min-h-screen bg-[#fbfaf7] text-ink">
      <EatygoHero metrics={metrics} tags={tags} />
      <RestaurantKitSection />
      <PlatformSection features={platformFeatures} />
      <KitchenSection kitchens={kitchens} />
      <MobileShowcaseSection />
      <StatsSection />
      <OrderFlow highlights={highlights} steps={steps} />
    </div>
  );
}
