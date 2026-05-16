import { Coins, Sparkles } from 'lucide-react';

interface EatPlayWalletCardProps {
  points: number;
}

export function EatPlayWalletCard({ points }: EatPlayWalletCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[40px] border-2 border-white bg-white/70 p-7 shadow-2xl shadow-black/5 ring-1 ring-black/[0.02] backdrop-blur-xl md:min-w-[280px]">
      <div className="absolute -right-6 -top-6 opacity-[0.08] pointer-events-none">
        <Coins className="h-28 w-28 rotate-12 text-amber-600" />
      </div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[rgb(var(--muted))]">GAME WALLET</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="font-display text-5xl font-black tracking-tight text-amber-600">{points.toLocaleString()}</p>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-amber-600/60 uppercase">Coins</span>
            </div>
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100/80 text-amber-600 shadow-inner">
          <Coins className="h-7 w-7" />
        </div>
      </div>
      <div className="mt-8 space-y-3">
        <button type="button" className="group/redeem relative w-full overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#f59e0b,#d97706)] p-4 text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95">
          <div className="relative z-10 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 animate-pulse text-amber-200" />
            <span className="text-sm font-black uppercase tracking-widest">Redeem Points</span>
          </div>
          <div className="absolute inset-0 translate-x-[-100%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] transition-transform duration-700 group-hover/redeem:translate-x-[100%]" />
        </button>
        <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-amber-700/70">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          Earn points by playing games
        </div>
      </div>
    </div>
  );
}
