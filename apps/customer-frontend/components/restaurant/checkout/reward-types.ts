export type VoucherDiscount =
  | { kind: 'percent'; value: number }
  | { kind: 'flat'; value: number }
  | { kind: 'free_delivery' };

export type RewardTrigger = 'welcome' | 'order';

export type ScratchRewardBase = {
  id: string;
  trigger: RewardTrigger;
  title: string;
  subtitle: string;
  mobile?: string;
  orderId?: string;
};

export type ScratchVoucherReward = ScratchRewardBase & {
  kind: 'voucher';
  code: string;
  discountLabel: string;
  discount: VoucherDiscount;
  expiryLabel: string;
};

export type ScratchPointsReward = ScratchRewardBase & {
  kind: 'points';
  points: number;
  expiryLabel?: string;
};

export type ScratchReward = ScratchVoucherReward | ScratchPointsReward;

export type VoucherWalletEntry = {
  id: string;
  code: string;
  title: string;
  discountLabel: string;
  discount: VoucherDiscount;
  expiryLabel: string;
  isUsed: boolean;
  source: RewardTrigger | 'seed';
  createdAt: number;
  mobile?: string;
  orderId?: string;
};

export type VoucherWalletInput = Omit<VoucherWalletEntry, 'id' | 'createdAt' | 'isUsed'> & {
  id?: string;
  createdAt?: number;
  isUsed?: boolean;
};

