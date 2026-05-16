"use client";

import { AnimatePresence } from 'framer-motion';
import { ScratchCard } from './scratch-card';
import type { ScratchReward } from './reward-types';

interface RewardManagerOptionProps {
  reward: ScratchReward | null;
  onClaim: (reward: ScratchReward) => void;
  onClose: () => void;
}

export function RewardManagerOption({ reward, onClaim, onClose }: RewardManagerOptionProps) {
  return (
    <AnimatePresence>
      {reward ? (
        <ScratchCard
          reward={reward}
          onClaim={onClaim}
          onClose={onClose}
        />
      ) : null}
    </AnimatePresence>
  );
}
