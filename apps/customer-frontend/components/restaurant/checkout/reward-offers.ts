import type { RegisteredUser } from '@/components/auth/registered-user';
import { readFreshRegistration } from '@/components/auth/registration-storage';
import type { DeliveryOrder } from '../use-restaurant-fulfillment';
import type { ScratchCampaign } from './use-scratch-campaigns';
import {
  ORDER_REWARD_DELAY_MS,
  WELCOME_REWARD_DELAY_MS,
  getOrderRewardSeenKey,
  getWelcomeRewardSeenKey,
  normalizePhoneKey,
  readBooleanStorage,
} from './reward-storage';
import { buildWelcomeScratchReward, buildOrderScratchReward } from './reward-builders';
import type { ScratchReward } from './reward-types';

export type ScratchRewardCandidate = {
  reward: ScratchReward;
  delayMs: number;
};

const ORDER_REWARD_STALE_MS = 10 * 60 * 1000;

export function getNextScratchRewardCandidate({
  user,
  orders,
  now,
  campaigns,
  myRewards,
  restaurantId,
}: {
  user: RegisteredUser | null;
  orders: DeliveryOrder[];
  now: number;
  campaigns: ScratchCampaign[];
  myRewards: { trigger: string; isUsed: boolean }[];
  restaurantId: string;
}): ScratchRewardCandidate | null {
  const welcomeCampaign = campaigns.find((c) => c.trigger === 'welcome' && c.isEnabled);
  if (welcomeCampaign && user) {
    const freshRegistration = readFreshRegistration();
    const welcomeSeenKey = getWelcomeRewardSeenKey(restaurantId, user.mobile);
    const alreadyClaimed = myRewards.some((r) => r.trigger === 'welcome');
    if (
      freshRegistration &&
      normalizePhoneKey(freshRegistration.mobile) === normalizePhoneKey(user.mobile) &&
      !readBooleanStorage(welcomeSeenKey) &&
      !alreadyClaimed
    ) {
      const reward = buildWelcomeScratchReward(user, welcomeCampaign, restaurantId);
      return {
        reward,
        delayMs: Math.max(0, WELCOME_REWARD_DELAY_MS - Math.max(0, now - user.verifiedAt)),
      };
    }
  }

  const orderCampaign = campaigns.find((c) => c.trigger === 'order' && c.isEnabled);
  if (orderCampaign) {
    const latestOrder = [...orders]
      .sort((a, b) => b.createdAt - a.createdAt)
      .find((order) => {
        const rewardSeenKey = getOrderRewardSeenKey(restaurantId, order.id);
        const isFreshEnough = now - order.createdAt <= ORDER_REWARD_STALE_MS;
        const alreadyClaimed = myRewards.some((r) => r.trigger === 'order');
        return isFreshEnough && !readBooleanStorage(rewardSeenKey) && !alreadyClaimed;
      });

    if (latestOrder) {
      const reward = buildOrderScratchReward(latestOrder, orderCampaign, restaurantId);
      return {
        reward,
        delayMs: Math.max(0, ORDER_REWARD_DELAY_MS - Math.max(0, now - latestOrder.createdAt)),
      };
    }
  }

  return null;
}
