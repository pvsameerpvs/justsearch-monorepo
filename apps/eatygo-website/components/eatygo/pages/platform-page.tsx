import type { PlatformFeature } from '@/lib/types/eatygo.types';
import { PlatformSection } from '../platform/platform-section';
import { SubPageHero } from '../shared/sub-page-hero';

interface PlatformPageProps {
  features: PlatformFeature[];
}

export function PlatformPage({ features }: PlatformPageProps) {
  return (
    <>
      <SubPageHero
        eyebrow="Platform"
        title="Every restaurant tool connected in one Eatygo platform"
        description="Use table QR ordering, customer websites, delivery flow, games, loyalty, dashboards, and admin controls as one clear restaurant growth system."
      />
      <PlatformSection features={features} />
    </>
  );
}
