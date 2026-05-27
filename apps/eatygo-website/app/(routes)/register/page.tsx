import { RegisterPage } from '@/components/eatygo/pages/register-page';
import { RESTAURANT_BENEFITS } from '@/lib/constants/eatygo.constants';

export default function Page() {
  return <RegisterPage benefits={RESTAURANT_BENEFITS} />;
}
