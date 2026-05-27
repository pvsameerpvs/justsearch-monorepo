import { PlatformPage } from '@/components/eatygo/pages/platform-page';
import { PLATFORM_FEATURES } from '@/lib/constants/eatygo.constants';

export default function Page() {
  return <PlatformPage features={PLATFORM_FEATURES} />;
}
