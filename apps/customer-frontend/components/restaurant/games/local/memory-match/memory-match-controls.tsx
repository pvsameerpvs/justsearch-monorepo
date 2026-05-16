"use client";
import { RotateCcw } from "lucide-react";
import type { Card } from "./memory-match-model";

interface MemoryMatchControlsProps {
  gameState: string;
  level: number;
  cards: Card[];
  score: number;
  timeLeft: number;
  config: { numPairs: number };
  onRestart: () => void;
}
export function MemoryMatchControls({ gameState, level, cards, score, timeLeft, config, onRestart }: MemoryMatchControlsProps) {
  const matchedPairs = cards.filter((c) => c.isMatched).length / 2;

  if (gameState === "GAMEOVER") return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-2xl z-30 px-6 animate-in zoom-in duration-300">
      <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center text-5xl mb-8 shadow-[0_0_50px_rgba(239,68,68,0.2)] border-2 border-red-500/50 animate-pulse">⌛</div>
      <h2 className="text-5xl font-black text-white mb-3 uppercase tracking-tighter italic">Session Over!</h2>
      <p className="text-slate-500 font-bold mb-10 uppercase tracking-[0.2em] text-[10px]">Challenge Reward: <span className="text-amber-400 text-lg font-black">{score} PTS</span></p>
      <button onClick={(e) => { e.stopPropagation(); onRestart(); }} className="px-14 py-6 bg-white text-slate-950 font-black rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 uppercase tracking-[0.15em] text-xs"><RotateCcw className="h-5 w-5" />Reset Session</button>
    </div>
  );

  if (gameState === "INTER-LEVEL") return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="bg-white px-8 py-4 rounded-3xl shadow-2xl flex flex-col items-center">
        <span className="text-4xl mb-2">🎉</span>
        <span className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Stage Complete!</span>
      </div>
    </div>
  );

  return (
    <div className="absolute bottom-10 inset-x-0 flex justify-center z-20 px-6 pointer-events-none">
      <div className="w-full max-w-sm bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-3 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.4)] flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-4 pl-6">
          <div className="flex flex-col"><span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Stage</span><span className="text-xl font-black text-white leading-tight">{level}</span></div>
          <div className="h-10 w-px bg-white/10 mx-1" />
          <div className="flex flex-col"><span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Status</span><span className="text-sm font-bold text-slate-400 leading-tight">{matchedPairs}/{config.numPairs}</span></div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-5 py-3 rounded-2xl flex flex-col items-center justify-center transition-all ${timeLeft < 10 ? "bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]" : "bg-slate-800"}`}><span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Time</span><span className={`text-base font-mono font-black leading-tight ${timeLeft < 10 ? "text-red-500 animate-pulse" : "text-blue-400"}`}>{timeLeft}s</span></div>
          <div className="px-6 py-3 bg-blue-600 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-blue-900/40 border border-blue-400/20"><span className="text-[9px] font-black text-blue-200 uppercase tracking-widest leading-none">Score</span><span className="text-base font-black text-white leading-tight">{score}</span></div>
        </div>
      </div>
    </div>
  );
}
