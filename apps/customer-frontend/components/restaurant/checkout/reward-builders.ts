import type { RegisteredUser } from '@/components/auth/registered-user';
import type { DeliveryOrder } from '../use-restaurant-fulfillment';
import type { ScratchCampaign } from './use-scratch-campaigns';
import type { ScratchReward } from './reward-types';

function normalizeRewardKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ':');
}

function buildDiscountFromCampaign(campaign: ScratchCampaign) {
  if (campaign.voucherType === 'fixed') {
    return { kind: 'flat' as const, value: campaign.voucherValue };
  }
  return { kind: 'percent' as const, value: campaign.voucherValue };
}

export function buildWelcomeScratchReward(
  user: RegisteredUser,
  campaign: ScratchCampaign,
  restaurantId: string
): ScratchReward {
  return {
    id: `welcome:${normalizeRewardKey(restaurantId)}:${user.mobile.replace(/\D/g, '')}`,
    trigger: 'welcome',
    kind: 'voucher',
    title: campaign.title || 'Welcome offer',
    subtitle: 'Thanks for joining us.',
    code: campaign.voucherCode,
    discountLabel: campaign.voucherCode,
    discount: buildDiscountFromCampaign(campaign),
    expiryLabel: 'Expires in 7 days',
    mobile: user.mobile,
  };
}

export function buildOrderScratchReward(
  order: DeliveryOrder,
  campaign: ScratchCampaign,
  restaurantId: string
): ScratchReward {
  return {
    id: `order:${normalizeRewardKey(restaurantId)}:${order.id}`,
    trigger: 'order',
    kind: 'voucher',
    title: campaign.title || 'Next order offer',
    subtitle: 'Enjoy a discount on your next delivery.',
    code: campaign.voucherCode,
    discountLabel: campaign.voucherCode,
    discount: buildDiscountFromCampaign(campaign),
    expiryLabel: 'Expires in 5 days',
    orderId: order.id,
  };
}
