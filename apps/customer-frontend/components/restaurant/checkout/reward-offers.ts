import type { RegisteredUser } from '@/components/auth/registered-user';
import { readFreshRegistration } from '@/components/auth/registration-context';
import type { DeliveryOrder } from '../use-restaurant-fulfillment';
import {
  ORDER_REWARD_DELAY_MS,
  WELCOME_REWARD_DELAY_MS,
  getOrderRewardSeenKey,
  getWelcomeRewardSeenKey,
  normalizePhoneKey,
  readBooleanStorage,
} from './reward-storage';
import type { ScratchReward } from './reward-types';

export type ScratchRewardCandidate = {
  reward: ScratchReward;
  delayMs: number;
};

const ORDER_REWARD_STALE_MS = 10 * 60 * 1000;

function normalizeOrderCode(orderId: string) {
  return orderId.replace(/\W/g, '').slice(-4).toUpperCase();
}

export function buildWelcomeScratchReward(user: RegisteredUser): ScratchReward {
  return {
    id: `welcome:${user.mobile.replace(/\D/g, '')}`,
    trigger: 'welcome',
    kind: 'voucher',
    title: 'Welcome offer',
    subtitle: 'Thanks for joining JustSearch.',
    code: 'WELCOME15',
    discountLabel: '15% OFF',
    discount: { kind: 'percent', value: 15 },
    expiryLabel: 'Expires in 7 days',
    mobile: user.mobile,
  };
}

export function buildOrderScratchReward(order: DeliveryOrder): ScratchReward {
  return {
    id: `order:${order.id}`,
    trigger: 'order',
    kind: 'voucher',
    title: 'Next order offer',
    subtitle: 'Enjoy a discount on your next delivery.',
    code: `NEXT10-${normalizeOrderCode(order.id) || 'ORDER'}`,
    discountLabel: '10% OFF',
    discount: { kind: 'percent', value: 10 },
    expiryLabel: 'Expires in 5 days',
    orderId: order.id,
  };
}

export function getNextScratchRewardCandidate({
  user,
  orders,
  now,
}: {
  user: RegisteredUser | null;
  orders: DeliveryOrder[];
  now: number;
}): ScratchRewardCandidate | null {
  if (user) {
    const freshRegistration = readFreshRegistration();
    const welcomeSeenKey = getWelcomeRewardSeenKey(user.mobile);
    if (
      freshRegistration &&
      normalizePhoneKey(freshRegistration.mobile) === normalizePhoneKey(user.mobile) &&
      !readBooleanStorage(welcomeSeenKey)
    ) {
      const reward = buildWelcomeScratchReward(user);
      return {
        reward,
        delayMs: Math.max(0, WELCOME_REWARD_DELAY_MS - Math.max(0, now - user.verifiedAt)),
      };
    }
  }

  const latestOrder = [...orders]
    .sort((a, b) => b.createdAt - a.createdAt)
    .find((order) => {
      const rewardSeenKey = getOrderRewardSeenKey(order.id);
      const isFreshEnough = now - order.createdAt <= ORDER_REWARD_STALE_MS;
      return isFreshEnough && !readBooleanStorage(rewardSeenKey);
    });

  if (!latestOrder) {
    return null;
  }

  const reward = buildOrderScratchReward(latestOrder);

  return {
    reward,
    delayMs: Math.max(0, ORDER_REWARD_DELAY_MS - Math.max(0, now - latestOrder.createdAt)),
  };
}
