import { AnimatePresence, motion } from 'framer-motion';
import type { ScratchReward } from './reward-types';
import { getRewardHeadline, getRewardMessage } from './scratch-card-types';

type ScratchCardRevealProps = {
  reward: ScratchReward;
  isCopied: boolean;
  onCopy: () => void;
};

export function ScratchCardReveal({ reward, isCopied, onCopy }: ScratchCardRevealProps) {
  return (
    <div className="flex h-[300px] w-[300px] flex-col items-center justify-center rounded-2xl bg-white p-6 text-center shadow-inner">
      <span className="text-4xl">🎉</span>
      <h3 className="mt-4 text-xl font-black tracking-tight text-slate-800">{getRewardHeadline(reward)}</h3>
      <p className="mt-2 max-w-[220px] text-[12px] leading-4 text-slate-500">{getRewardMessage(reward)}</p>
      {reward.kind === 'voucher' ? (
        <div className="mt-4 flex flex-col items-center gap-3">
          <button type="button" className="relative cursor-pointer" onClick={onCopy}>
            <AnimatePresence>
              {isCopied ? (
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: -40 }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none absolute inset-x-0 -top-2 rounded bg-black px-2 py-1 text-center text-[10px] font-bold text-white"
                >
                  COPIED! 🎉
                </motion.div>
              ) : null}
            </AnimatePresence>
            <div className="rounded-lg border-2 border-dashed border-amber-400 bg-amber-50 px-6 py-2 font-mono text-[15px] font-bold tracking-[0.18em] text-amber-700 transition-all hover:scale-105 active:scale-95">
              {reward.code}
            </div>
            <div className="mt-1 text-[10px] font-bold uppercase text-amber-600 opacity-60">Tap to copy</div>
          </button>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            {reward.expiryLabel.toUpperCase()}
          </div>
        </div>
      ) : (
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-[10px] font-bold text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          POINTS ADDED TO WALLET
        </div>
      )}
    </div>
  );
}
