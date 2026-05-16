"use client";

import { useRef, useEffect, useState } from "react";
import { useCheeseChaseEngine } from "./use-cheese-chase-engine";
import { CheeseChaseBoard } from "./cheese-chase-board";
import { CheeseChaseControls } from "./cheese-chase-controls";
import type { LocalGameRendererProps } from "../local-game-renderer";

export function CheeseChaseGame({ onAward }: LocalGameRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const { gameState, level, maze, mousePos, cheesePos, timeLeft, traps, isStuck, startGame, moveMouse, containerRef, config } = useCheeseChaseEngine({ onAward });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [containerRef]);

  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col bg-[radial-gradient(circle_at_50%_50%,#fffbeb_0%,#fef3c7_100%)]">
      <div className="absolute top-0 left-0 w-full z-10 pointer-events-none overflow-hidden h-20">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-[120%] h-full -translate-x-[5%]">
          <path d="M0,0V80.52c16.35,11,46.15,13.68,85.16,5C124.17,76.84,144,38.16,192,44.16c48,6,61.88,48,111.88,52,50,4,66.12-32,116.12-28,50,4,58.82,42,108.82,46s61.54-36,111.54-32,54.12,40,104.12,44c50,4,62.15-38,112.15-32s51.54,42,101.54,46c50,4,59.23-38,109.23-32s52.82,40,102.82,44V0Z" fill="#92400e" className="opacity-90 shadow-2xl" />
          <path d="M0,0V60.52c10.35,8,30.15,10.68,60.16,4C88.17,58.84,104,28.16,142,32.16c38,4,47.88,38,87.88,42,40,4,52.12-26,92.12-22,40,4,46.82,32,86.82,36s49.54-28,89.54-24,44.12,32,84.12,36c40,4,49.15-30,89.15-24s42.54,32,82.54,36c40,4,47.23-30,87.23-24s42.82,32,82.82,36V0Z" fill="#d97706" className="opacity-40" />
        </svg>
      </div>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#b45309 2px, transparent 2px)", backgroundSize: "40px 40px" }} />
      <CheeseChaseBoard canvasRef={canvasRef} dimensions={dimensions} maze={maze} mousePos={mousePos} cheesePos={cheesePos} traps={traps} isStuck={isStuck} gameState={gameState} config={config} />
      <CheeseChaseControls gameState={gameState} level={level} timeLeft={timeLeft} onMove={moveMouse} onRestart={startGame} />
    </div>
  );
}
