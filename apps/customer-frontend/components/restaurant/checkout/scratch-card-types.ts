import type { ScratchReward } from './reward-types';

export type ScratchCardProps = {
  reward: ScratchReward;
  onClaim: (reward: ScratchReward) => void;
  onClose: () => void;
};

export const REVEAL_THRESHOLD = 50;
export const BRUSH_SIZE = 45;
export const CARD_SIZE = 300;
export const DPR_CAP = 2;
export const SAMPLE_SIZE = 48;

export function getRewardHeadline(reward: ScratchReward) {
  return reward.kind === 'voucher' ? reward.discountLabel : `+${reward.points} POINTS`;
}

export function getRewardMessage(reward: ScratchReward) {
  return reward.kind === 'voucher' ? 'Tap the code to copy it.' : 'Points added to your wallet.';
}
