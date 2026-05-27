import {
  HERO_METRICS,
  KITCHENS,
  ORDER_HIGHLIGHTS,
  ORDER_STEPS,
  PLATFORM_FEATURES,
  SEARCH_TAGS,
} from '@/lib/constants/eatygo.constants';
import { EatygoPresenter } from './eatygo-presenter';

export function EatygoContainer() {
  return (
    <EatygoPresenter
      metrics={HERO_METRICS}
      tags={SEARCH_TAGS}
      kitchens={KITCHENS}
      steps={ORDER_STEPS}
      highlights={ORDER_HIGHLIGHTS}
      platformFeatures={PLATFORM_FEATURES}
    />
  );
}
