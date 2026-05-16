"use client";

import { useRef, useEffect, useState } from "react";
import { useMemoryMatchEngine } from "./use-memory-match-engine";
import { MemoryMatchBoard } from "./memory-match-board";
import { MemoryMatchControls } from "./memory-match-controls";
import type { LocalGameRendererProps } from "../local-game-renderer";

export function MemoryMatchGame({ onAward }: LocalGameRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const { gameState, level, cards, score, timeLeft, startGame, handleCardClick, containerRef, config } = useMemoryMatchEngine({ onAward });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [flipStates, setFlipStates] = useState<Record<number, number>>({});

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

  useEffect(() => {
    let frameId: number;
    const animate = () => {
      setFlipStates((prev) => {
        const next = { ...prev };
        let changed = false;
        cards.forEach((c) => {
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

  return (
    <div className="relative h-full w-full bg-[#0f172a] overflow-hidden font-sans select-none touch-none">
      <div className="absolute top-0 left-0 w-full h-1/4 z-0 pointer-events-none opacity-10">
        <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
          <path fill="#3b82f6" d="M0,192L1440,64L1440,0L0,0Z" />
        </svg>
      </div>
      <MemoryMatchBoard canvasRef={canvasRef} dimensions={dimensions} cards={cards} flipStates={flipStates} config={config} gameState={gameState} onCardClick={handleCardClick} />
      <MemoryMatchControls gameState={gameState} level={level} cards={cards} score={score} timeLeft={timeLeft} config={config} onRestart={startGame} />
    </div>
  );
}
