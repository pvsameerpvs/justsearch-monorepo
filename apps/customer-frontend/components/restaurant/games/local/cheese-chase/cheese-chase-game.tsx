"use client";

import { useRef, useEffect, useState } from 'react';
import { useCheeseChaseEngine } from './use-cheese-chase-engine';
import { drawMaze, drawEntity, drawFog } from './cheese-chase-canvas-art';
import { Trophy, Timer } from 'lucide-react';

interface CheddarChaseGameProps {
  onAward: (award: { points: number; score: number; label: string }) => void;
}

/**
 * Cheddar Chase Game
 * A premium maze runner game following the arcade strategy.
 */
export function CheeseChaseGame({ onAward }: CheddarChaseGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    gameState,
    level,
    maze,
    mousePos,
    cheesePos,
    timeLeft,
    traps,
    isStuck,
    startGame,
    moveMouse,
    containerRef,
    config
  } = useCheeseChaseEngine({ onAward });

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Sync dimensions for the engine and canvas
  useEffect(() => {
    const updateDimensions = () => {
      const parent = canvasRef.current?.parentElement;
      if (parent) {
        const width = parent.clientWidth;
        const height = parent.clientHeight;
        setDimensions({ width, height });
        containerRef.current = { width, height };
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [containerRef]);

  // High Performance Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !maze.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;
    const padding = 60;
    const cellSize = Math.min(
      (width - padding * 2) / config.gridSize.cols,
      (height - padding * 2) / config.gridSize.rows
    );

    const mazeWidth = cellSize * config.gridSize.cols;
    const mazeHeight = cellSize * config.gridSize.rows;
    const offsetX = (width - mazeWidth) / 2;
    const offsetY = (height - mazeHeight) / 2;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw World
      drawMaze({ ctx, width, height }, maze, cellSize, offsetX, offsetY);
      
      // Draw Hazards (Traps)
      traps.forEach(trap => {
        drawEntity({ ctx }, trap.col, trap.row, cellSize, offsetX, offsetY, 'TRAP');
      });

      // Draw Objectives
      drawEntity({ ctx }, cheesePos.col, cheesePos.row, cellSize, offsetX, offsetY, 'CHEESE');
      
      // Draw Player (Rat)
      ctx.save();
      if (isStuck) ctx.globalAlpha = 0.5;
      drawEntity({ ctx }, mousePos.col, mousePos.row, cellSize, offsetX, offsetY, 'MOUSE');
      ctx.restore();
      
      // Apply Fog of War Effect
      if (config.hasFog) {
        drawFog({ ctx, width, height }, mousePos.col, mousePos.row, cellSize, offsetX, offsetY);
      }

      // Transition States
      if (gameState === 'INTER-LEVEL') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#1e293b';
        ctx.font = 'black 32px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.letterSpacing = '2px';
        ctx.fillText('LEVEL COMPLETE!', width/2, height/2);
      }
    };

    const frameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frameId);
  }, [dimensions, maze, mousePos, cheesePos, level, timeLeft, gameState, config, traps, isStuck]);

  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col bg-[radial-gradient(circle_at_50%_50%,#fffbeb_0%,#fef3c7_100%)]">
      {/* 🧀 Thematic Decorations */}
      <div className="absolute top-0 left-0 w-full z-10 pointer-events-none overflow-hidden h-20">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-[120%] h-full -translate-x-[5%]">
          <path d="M0,0V80.52c16.35,11,46.15,13.68,85.16,5C124.17,76.84,144,38.16,192,44.16c48,6,61.88,48,111.88,52,50,4,66.12-32,116.12-28,50,4,58.82,42,108.82,46s61.54-36,111.54-32,54.12,40,104.12,44c50,4,62.15-38,112.15-32s51.54,42,101.54,46c50,4,59.23-38,109.23-32s52.82,40,102.82,44V0Z" fill="#92400e" className="opacity-90 shadow-2xl" />
          <path d="M0,0V60.52c10.35,8,30.15,10.68,60.16,4C88.17,58.84,104,28.16,142,32.16c38,4,47.88,38,87.88,42,40,4,52.12-26,92.12-22,40,4,46.82,32,86.82,36s49.54-28,89.54-24,44.12,32,84.12,36c40,4,49.15-30,89.15-24s42.54,32,82.54,36c40,4,47.23-30,87.23-24s42.82,32,82.82,36V0Z" fill="#d97706" className="opacity-40" />
        </svg>
      </div>

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#b45309 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
      
      {/* 🎮 Game Screen (Canvas) Area */}
      <div className="flex-1 relative">
        <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} className="block h-full w-full touch-none" />
        
        {/* Elegant Floating HUD */}
        <div className="absolute left-1/2 bottom-5 -translate-x-1/2 z-20 flex items-center gap-3">
          <StatPill icon={<Trophy className="h-4 w-4 text-amber-500 fill-current" />} label={`Level ${level}`} />
          <StatPill 
            icon={<Timer className="h-4 w-4" />} 
            label={`${timeLeft ?? 0}S`} 
            danger={timeLeft !== undefined && timeLeft < 5} 
          />
        </div>
      </div>

      {/* 🕹️ Control & Navigation Panel */}
      <div className="relative z-20 flex flex-col items-center bg-white/40 backdrop-blur-md border-t border-white/50 pb-[env(safe-area-inset-bottom,0px)]">
        <div className="w-full p-6 grid grid-cols-3 gap-3 sm:hidden max-w-sm">
          <div />
          <ControlButton onClick={() => moveMouse(0, -1)}>↑</ControlButton>
          <div />
          <ControlButton onClick={() => moveMouse(-1, 0)}>←</ControlButton>
          <ControlButton onClick={() => moveMouse(0, 1)}>↓</ControlButton>
          <ControlButton onClick={() => moveMouse(1, 0)}>→</ControlButton>
        </div>
      </div>

      {/* 🖼️ Modals & Overlays */}
      {gameState === 'GAMEOVER' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm z-50 px-6 text-center">
          <div className="h-20 w-20 bg-amber-100 rounded-[1.5rem] flex items-center justify-center text-4xl mb-6 shadow-xl border-b-4 border-amber-200 animate-bounce">
            🐭
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Round Over!</h2>
          <p className="text-slate-500 font-bold mb-8 uppercase tracking-widest text-xs">
            Reached Level <span className="text-amber-600">{level}</span>
          </p>
          <button onClick={startGame} className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

// Internal UI Components for Clean Code
function StatPill({ icon, label, danger }: { icon: React.ReactNode; label: string; danger?: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl border border-white bg-white/95 px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_8px_40px_rgba(0,0,0,0.12)] backdrop-blur-md whitespace-nowrap ${danger ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
}

function ControlButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button 
      onPointerDown={onClick} 
      className="p-5 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-xl font-bold text-slate-700 active:scale-90 active:bg-slate-50 transition-all select-none"
    >
      {children}
    </button>
  );
}
