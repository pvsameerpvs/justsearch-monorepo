import type { Highlight, OrderStep } from '@/lib/types/eatygo.types';
import { GamesFeatureGrid } from '../games/games-feature-grid';
import { OrderFlow } from '../order/order-flow';
import { SubPageHero } from '../shared/sub-page-hero';

interface GamesPageProps {
  highlights: Highlight[];
  steps: OrderStep[];
}

export function GamesPage({ highlights, steps }: GamesPageProps) {
  return (
    <>
      <SubPageHero
        eyebrow="Games and loyalty"
        title="Turn restaurant visits into play, points, and repeat customers"
        description="Eatygo connects ordering with simple branded games, rewards, and loyalty so customers have a reason to come back after each meal."
      />
      <section className="bg-[#fbfaf7] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <GamesFeatureGrid />
        </div>
      </section>
      <OrderFlow highlights={highlights} steps={steps} />
    </>
  );
}
