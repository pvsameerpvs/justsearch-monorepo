"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { clearFreshRegistration } from '@/components/auth/registration-storage';
import { useRegistration } from '@/components/auth/registration-context';
import { useLoyaltyPoints } from '../use-loyalty-points';
import { useRestaurantFulfillment } from '../use-restaurant-fulfillment';
import { getNextScratchRewardCandidate } from './reward-offers';
import { getRewardSeenKey, writeBooleanStorage } from './reward-storage';
import { useVoucherWallet } from './use-voucher-wallet';
import { RewardManagerOption } from './reward-manager-option';
import type { ScratchReward } from './reward-types';

export function RewardManager() {
  const { user } = useRegistration();
  const { hydrated, orders } = useRestaurantFulfillment();
  const { addPoints } = useLoyaltyPoints();
  const { addVoucher } = useVoucherWallet();
  const [activeReward, setActiveReward] = useState<ScratchReward | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const nextRewardCandidate = useMemo(() => {
    if (!hydrated) return null;
    return getNextScratchRewardCandidate({ user, orders, now });
  }, [hydrated, orders, now, user]);

  useEffect(() => {
    if (activeReward || !nextRewardCandidate) return;
    const timer = window.setTimeout(() => setActiveReward(nextRewardCandidate.reward), nextRewardCandidate.delayMs);
    return () => window.clearTimeout(timer);
  }, [nextRewardCandidate?.reward.id, activeReward?.id]);

  const claimReward = useCallback((reward: ScratchReward) => {
    if (reward.kind === 'voucher') {
      addVoucher({ code: reward.code, title: reward.title, discountLabel: reward.discountLabel, discount: reward.discount, expiryLabel: reward.expiryLabel, source: reward.trigger, mobile: reward.mobile, orderId: reward.orderId });
    } else {
      addPoints(reward.points);
    }
    writeBooleanStorage(getRewardSeenKey(reward.id), true);
    if (reward.trigger === 'welcome') clearFreshRegistration();
  }, [addPoints, addVoucher]);

  const closeReward = useCallback(() => {
    if (activeReward) {
      writeBooleanStorage(getRewardSeenKey(activeReward.id), true);
      if (activeReward.trigger === 'welcome') clearFreshRegistration();
    }
    setActiveReward(null);
  }, [activeReward]);

  return <RewardManagerOption reward={activeReward} onClaim={claimReward} onClose={closeReward} />;
}
