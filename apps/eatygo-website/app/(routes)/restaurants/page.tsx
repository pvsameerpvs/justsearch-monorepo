import { RestaurantsPage } from '@/components/eatygo/pages/restaurants-page';
import { KITCHENS } from '@/lib/constants/eatygo.constants';

export default function Page() {
  return <RestaurantsPage kitchens={KITCHENS} />;
}
