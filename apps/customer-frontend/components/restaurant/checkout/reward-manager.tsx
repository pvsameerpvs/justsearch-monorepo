"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { clearFreshRegistration } from '@/components/auth/registration-storage';
import { useRegistration } from '@/components/auth/registration-context';
import { useRestaurant } from '@/components/restaurant/restaurant-context';
import { useLoyaltyPoints } from '../use-loyalty-points';
import { useRestaurantFulfillment } from '../use-restaurant-fulfillment';
import { getNextScratchRewardCandidate } from './reward-offers';
import { getRewardSeenKey, writeBooleanStorage } from './reward-storage';
import { useVoucherWallet } from './use-voucher-wallet';
import { useScratchCampaignsQuery } from './use-scratch-campaigns';
import { useMyScratchRewardsQuery, useClaimScratchRewardMutation } from './use-scratch-rewards';
import { RewardManagerOption } from './reward-manager-option';
import type { ScratchReward } from './reward-types';

export function RewardManager() {
  const { user } = useRegistration();
  const restaurant = useRestaurant();
  const { hydrated, orders } = useRestaurantFulfillment();
  const { addPoints } = useLoyaltyPoints();
  const { addVoucher, syncVoucherDiscount } = useVoucherWallet();
  const { data: campaignsData } = useScratchCampaignsQuery();
  const { data: rewardsData } = useMyScratchRewardsQuery();
  const claimMutation = useClaimScratchRewardMutation();
  const [activeReward, setActiveReward] = useState<ScratchReward | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const campaigns = campaignsData?.campaigns ?? [];
  const myRewards = rewardsData?.rewards ?? [];
  const restaurantId = restaurant.id ?? restaurant.subdomain;

  // Sync existing wallet vouchers with actual campaign discount values
  useEffect(() => {
    if (!campaigns.length) return;
    campaigns.forEach((campaign) => {
      const discount = campaign.voucherType === 'fixed'
        ? { kind: 'flat' as const, value: campaign.voucherValue }
        : { kind: 'percent' as const, value: campaign.voucherValue };
      syncVoucherDiscount(campaign.voucherCode, discount);
    });
  }, [campaigns, syncVoucherDiscount]);

  const nextRewardCandidate = useMemo(() => {
    if (!hydrated) return null;
    return getNextScratchRewardCandidate({
      user,
      orders,
      now,
      campaigns,
      myRewards,
      restaurantId,
    });
  }, [hydrated, orders, now, user, campaigns, myRewards, restaurantId]);

  useEffect(() => {
    if (activeReward || !nextRewardCandidate) return;
    const timer = window.setTimeout(() => setActiveReward(nextRewardCandidate.reward), nextRewardCandidate.delayMs);
    return () => window.clearTimeout(timer);
  }, [nextRewardCandidate?.reward.id, activeReward?.id]);

  const claimReward = useCallback((reward: ScratchReward) => {
    if (claimMutation.isPending) return;
    if (reward.kind === 'voucher') {
      addVoucher({
        code: reward.code,
        title: reward.title,
        discountLabel: reward.discountLabel,
        discount: reward.discount,
        expiryLabel: reward.expiryLabel,
        source: reward.trigger,
        mobile: reward.mobile,
        orderId: reward.orderId,
      });

      if (reward.trigger === 'welcome' || reward.trigger === 'order') {
        claimMutation.mutate({
          trigger: reward.trigger,
          voucherCode: reward.code,
        });
      }
    } else {
      addPoints(reward.points);
    }
    writeBooleanStorage(getRewardSeenKey(reward.id), true);
    if (reward.trigger === 'welcome') clearFreshRegistration();
    setActiveReward(null);
  }, [addPoints, addVoucher, claimMutation]);

  const closeReward = useCallback(() => {
    setActiveReward(null);
  }, []);

  return <RewardManagerOption reward={activeReward} onClaim={claimReward} onClose={closeReward} />;
}
