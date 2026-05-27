import { GamesPage } from '@/components/eatygo/pages/games-page';
import { ORDER_HIGHLIGHTS, ORDER_STEPS } from '@/lib/constants/eatygo.constants';

export default function Page() {
  return <GamesPage highlights={ORDER_HIGHLIGHTS} steps={ORDER_STEPS} />;
}
