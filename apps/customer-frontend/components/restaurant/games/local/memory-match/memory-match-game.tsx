"use client";

import { useRef, useEffect, useState } from 'react';
import { useMemoryMatchEngine } from './use-memory-match-engine';
import { drawCard, drawBackground } from './memory-match-canvas-art';
import { RotateCcw } from 'lucide-react';
import { LocalGameRendererProps } from '../local-game-renderer';

/** 
 * 🎮 GEM MATCH - Premium Mobile UI 
 */

/** 📊 Game HUD Sub-component */
function GameHUD({ level, matchedPairs, totalPairs, timeLeft, score }: { 
  level: number; 
  matchedPairs: number; 
  totalPairs: number; 
  timeLeft: number; 
  score: number;
}) {
  return (
    <div className="absolute bottom-10 inset-x-0 flex justify-center z-20 px-6 pointer-events-none">
      <div className="w-full max-w-sm bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-3 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.4)] flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-4 pl-6">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Stage</span>
            <span className="text-xl font-black text-white leading-tight">{level}</span>
          </div>
          <div className="h-10 w-px bg-white/10 mx-1" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Status</span>
            <span className="text-sm font-bold text-slate-400 leading-tight">{matchedPairs}/{totalPairs}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-5 py-3 rounded-2xl flex flex-col items-center justify-center transition-all ${timeLeft < 10 ? 'bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-slate-800'}`}>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Time</span>
            <span className={`text-base font-mono font-black leading-tight ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>{timeLeft}s</span>
          </div>
          <div className="px-6 py-3 bg-blue-600 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-blue-900/40 border border-blue-400/20">
            <span className="text-[9px] font-black text-blue-200 uppercase tracking-widest leading-none">Score</span>
            <span className="text-base font-black text-white leading-tight">{score}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** ✨ Level Success Overlay */
function LevelCompleteOverlay() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="bg-white px-8 py-4 rounded-3xl shadow-2xl flex flex-col items-center">
         <span className="text-4xl mb-2">🎉</span>
         <span className="text-2xl font-black text-slate-900 uppercase italic italic tracking-tighter">Stage Complete!</span>
      </div>
    </div>
  );
}

/** 💀 Game Over Sub-component */
function GameOverScreen({ score, onRestart }: { score: number; onRestart: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-2xl z-30 px-6 animate-in zoom-in duration-300">
      <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center text-5xl mb-8 shadow-[0_0_50px_rgba(239,68,68,0.2)] border-2 border-red-500/50 animate-pulse">
        ⌛
      </div>
      <h2 className="text-5xl font-black text-white mb-3 uppercase tracking-tighter italic">Session Over!</h2>
      <p className="text-slate-500 font-bold mb-10 uppercase tracking-[0.2em] text-[10px]">Challenge Reward: <span className="text-amber-400 text-lg font-black">{score} PTS</span></p>
      <button 
        onClick={(e) => { e.stopPropagation(); onRestart(); }}
        className="px-14 py-6 bg-white text-slate-950 font-black rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 uppercase tracking-[0.15em] text-xs"
      >
        <RotateCcw className="h-5 w-5" />
        Reset Session
      </button>
    </div>
  );
}

/** 🎮 Main Game Component */
export function MemoryMatchGame({ onAward }: LocalGameRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    gameState,
    level,
    cards,
    score,
    timeLeft,
    startGame,
    handleCardClick,
    containerRef,
    config
  } = useMemoryMatchEngine({ onAward });

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [flipStates, setFlipStates] = useState<Record<number, number>>({});

  // 📐 Sync Canvas Dimensions
  useEffect(() => {
    const update = () => {
      const parent = canvasRef.current?.parentElement;
      if (parent) {
        const d = { width: parent.clientWidth, height: parent.clientHeight };
        setDimensions(d);
        containerRef.current = d;
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [containerRef]);

  // 🔄 Optimized Animation Loop
  useEffect(() => {
    let frameId: number;
    const animate = () => {
      setFlipStates(prev => {
        const next = { ...prev };
        let changed = false;
        cards.forEach(c => {
          const target = c.isFlipped ? 1 : 0;
          const current = prev[c.id] ?? 0;
          if (Math.abs(current - target) > 0.01) {
            next[c.id] = current + (target - current) * 0.25;
            changed = true;
          } else {
            next[c.id] = target;
          }
        });
        return changed ? next : prev;
      });
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [cards]);

  // 🖌️ Redraw Canvas on any state change
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !cards.length) return;

    const { width, height } = dimensions;
    const gap = 16, padding = 40;
    
    const cardSize = Math.min(
      (width - padding * 2 - (config.gridSize.cols - 1) * gap) / config.gridSize.cols,
      (height - padding * 2 - (config.gridSize.rows - 1) * gap) / config.gridSize.rows
    );

    const offX = (width - (cardSize * config.gridSize.cols + gap * (config.gridSize.cols - 1))) / 2;
    const offY = (height - (cardSize * config.gridSize.rows + gap * (config.gridSize.rows - 1))) / 2;

    ctx.clearRect(0, 0, width, height);
    drawBackground({ ctx, width, height });

    cards.forEach((card, i) => {
      const x = offX + (i % config.gridSize.cols) * (cardSize + gap);
      const y = offY + Math.floor(i / config.gridSize.cols) * (cardSize + gap);
      drawCard({ ctx, width, height }, card, x, y, cardSize, flipStates[card.id] ?? 0);
    });
  }, [dimensions, cards, flipStates, config]);

  const handleClick = (e: React.MouseEvent) => {
    if (gameState !== 'PLAYING') return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const gap = 16, padding = 40;
    const cardSize = Math.min(
      (dimensions.width - padding * 2 - (config.gridSize.cols - 1) * gap) / config.gridSize.cols,
      (dimensions.height - padding * 2 - (config.gridSize.rows - 1) * gap) / config.gridSize.rows
    );

    const offX = (dimensions.width - (cardSize * config.gridSize.cols + gap * (config.gridSize.cols - 1))) / 2;
    const offY = (dimensions.height - (cardSize * config.gridSize.rows + gap * (config.gridSize.rows - 1))) / 2;

    const col = Math.floor((x - offX) / (cardSize + gap));
    const row = Math.floor((y - offY) / (cardSize + gap));

    if (col >= 0 && col < config.gridSize.cols && row >= 0 && row < config.gridSize.rows) {
      const idx = row * config.gridSize.cols + col;
      const cX = offX + col * (cardSize + gap);
      const cY = offY + row * (cardSize + gap);
      if (x >= cX && x <= cX + cardSize && y >= cY && y <= cY + cardSize) {
        handleCardClick(idx);
      }
    }
  };

  return (
    <div className="relative h-full w-full bg-[#0f172a] overflow-hidden font-sans select-none touch-none">
      {/* 🌊 Subtle Background Wave Decor */}
      <div className="absolute top-0 left-0 w-full h-1/4 z-0 pointer-events-none opacity-10">
        <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
          <path fill="#3b82f6" d="M0,192L1440,64L1440,0L0,0Z" />
        </svg>
      </div>

      <div className="relative h-full w-full flex flex-col z-10" onClick={handleClick}>
        <canvas 
          ref={canvasRef} 
          width={dimensions.width} 
          height={dimensions.height}
          className="block w-full h-full cursor-pointer" 
        />
        
        {/* 📟 Dynamic HUD */}
        {gameState === 'PLAYING' && (
          <GameHUD 
            level={level} 
            matchedPairs={cards.filter(c => c.isMatched).length / 2} 
            totalPairs={config.numPairs} 
            timeLeft={timeLeft} 
            score={score} 
          />
        )}

        {/* 🎬 Overlays */}
        {gameState === 'INTER-LEVEL' && <LevelCompleteOverlay />}
        {gameState === 'GAMEOVER' && <GameOverScreen score={score} onRestart={startGame} />}
      </div>
    </div>
  );
}
