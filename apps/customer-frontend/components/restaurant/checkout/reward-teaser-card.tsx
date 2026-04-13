"use client";

import { motion } from 'framer-motion';
import { Coins, Ticket, X } from 'lucide-react';
import type { ScratchReward } from './reward-types';

type RewardTeaserCardProps = {
  reward: ScratchReward;
  onOpen: () => void;
  onDismiss: () => void;
};

function getTeaserTitle(reward: ScratchReward) {
  return reward.kind === 'voucher' ? reward.discountLabel : `+${reward.points} POINTS`;
}

function getTeaserSubtitle(reward: ScratchReward) {
  if (reward.kind === 'voucher') {
    return 'Tap to open the scratch card and copy your code.';
  }

  return 'Tap to open the scratch card and claim points.';
}

export function RewardTeaserCard({ reward, onOpen, onDismiss }: RewardTeaserCardProps) {
  return (
    <div className="fixed inset-x-0 bottom-4 z-[99999] flex justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        role="button"
        tabIndex={0}
        aria-label="Open scratch reward card"
        onClick={onOpen}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onOpen();
          }
        }}
        className="relative w-[min(92vw,380px)] overflow-hidden rounded-[28px] border border-[rgb(var(--border)/0.8)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,255,255,0.92))] p-4 shadow-[0_20px_50px_rgba(15,23,42,0.18)] outline-none transition-transform active:scale-[0.99]"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,rgb(var(--brand)),rgb(var(--accent)),rgb(var(--brand)))]" />

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDismiss();
          }}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgb(var(--border)/0.8)] bg-white text-[rgb(var(--muted))] transition-colors hover:text-[rgb(var(--ink))]"
          aria-label="Dismiss reward card"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3 pr-10">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[rgb(var(--brand)/0.12)] text-[rgb(var(--brand))]">
            {reward.kind === 'voucher' ? (
              <Ticket className="h-6 w-6" />
            ) : (
              <Coins className="h-6 w-6" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[rgb(var(--muted))]">
              Reward ready
            </p>
            <h3 className="mt-1 text-[17px] font-black tracking-[-0.04em] text-[rgb(var(--ink))]">
              {getTeaserTitle(reward)}
            </h3>
            <p className="mt-1 text-[12px] leading-4 text-[rgb(var(--muted))]">
              {getTeaserSubtitle(reward)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-[22px] bg-[rgb(var(--brand-soft)/0.12)] px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[rgb(var(--muted))]">
              Tap card to open
            </p>
            <p className="mt-1 text-[13px] font-semibold text-[rgb(var(--ink))]">
              Scratch to reveal
            </p>
          </div>

          <span className="inline-flex h-10 items-center rounded-full bg-[rgb(var(--brand))] px-4 text-[12px] font-bold text-white shadow-[0_10px_24px_rgb(var(--brand)/0.22)]">
            Open
          </span>
        </div>
      </motion.div>
    </div>
  );
}
