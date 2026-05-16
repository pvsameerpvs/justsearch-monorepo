"use client";

import { Trophy, Timer } from "lucide-react";

interface CheeseChaseControlsProps {
  gameState: string;
  level: number;
  timeLeft: number | undefined;
  onMove: (dCol: number, dRow: number) => void;
  onRestart: () => void;
}

export function CheeseChaseControls({ gameState, level, timeLeft, onMove, onRestart }: CheeseChaseControlsProps) {
  if (gameState === "GAMEOVER") return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm z-50 px-6 text-center">
      <div className="h-20 w-20 bg-amber-100 rounded-[1.5rem] flex items-center justify-center text-4xl mb-6 shadow-xl border-b-4 border-amber-200 animate-bounce">🐭</div>
      <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Round Over!</h2>
      <p className="text-slate-500 font-bold mb-8 uppercase tracking-widest text-xs">Reached Level <span className="text-amber-600">{level}</span></p>
      <button onClick={onRestart} className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm">Try Again</button>
    </div>
  );

  const danger = timeLeft !== undefined && timeLeft < 5;
  const pill = "flex items-center gap-3 rounded-2xl border border-white bg-white/95 px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_8px_40px_rgba(0,0,0,0.12)] backdrop-blur-md whitespace-nowrap";
  const btn = "p-5 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-xl font-bold text-slate-700 active:scale-90 active:bg-slate-50 transition-all select-none";

  return (
    <>
      <div className="absolute left-1/2 bottom-5 -translate-x-1/2 z-20 flex items-center gap-3">
        <div className={`${pill} text-slate-800`}><Trophy className="h-4 w-4 text-amber-500 fill-current" /><span>Level {level}</span></div>
        <div className={`${pill} ${danger ? "text-red-500 animate-pulse" : "text-slate-800"}`}><Timer className="h-4 w-4" /><span>{timeLeft ?? 0}S</span></div>
      </div>
      <div className="relative z-20 flex flex-col items-center bg-white/40 backdrop-blur-md border-t border-white/50 pb-[env(safe-area-inset-bottom,0px)]">
        <div className="w-full p-6 grid grid-cols-3 gap-3 sm:hidden max-w-sm">
          <div />
          <button onPointerDown={() => onMove(0, -1)} className={btn}>↑</button>
          <div />
          <button onPointerDown={() => onMove(-1, 0)} className={btn}>←</button>
          <button onPointerDown={() => onMove(0, 1)} className={btn}>↓</button>
          <button onPointerDown={() => onMove(1, 0)} className={btn}>→</button>
        </div>
      </div>
    </>
  );
}
