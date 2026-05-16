"use client";

import { useEffect } from "react";
import { drawCard, drawBackground } from "./memory-match-canvas-art";
import { getCardLayout } from "./memory-match-types";
import type { Card, GameState } from "./memory-match-model";

interface MemoryMatchBoardProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  dimensions: { width: number; height: number };
  cards: Card[];
  flipStates: Record<number, number>;
  config: { gridSize: { rows: number; cols: number } };
  gameState: GameState;
  onCardClick: (index: number) => void;
}

export function MemoryMatchBoard({
  canvasRef,
  dimensions,
  cards,
  flipStates,
  config,
  gameState,
  onCardClick,
}: MemoryMatchBoardProps) {
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !cards.length) return;
    const { width, height } = dimensions;
    const { cardSize, offX, offY, gap } = getCardLayout(width, height, config.gridSize.cols, config.gridSize.rows);
    ctx.clearRect(0, 0, width, height);
    drawBackground({ ctx, width, height });
    cards.forEach((card, i) => {
      const x = offX + (i % config.gridSize.cols) * (cardSize + gap);
      const y = offY + Math.floor(i / config.gridSize.cols) * (cardSize + gap);
      drawCard({ ctx, width, height }, card, x, y, cardSize, flipStates[card.id] ?? 0);
    });
  }, [dimensions, cards, flipStates, config, canvasRef]);

  const handleClick = (e: React.MouseEvent) => {
    if (gameState !== "PLAYING") return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { cardSize, offX, offY, gap } = getCardLayout(dimensions.width, dimensions.height, config.gridSize.cols, config.gridSize.rows);
    const col = Math.floor((x - offX) / (cardSize + gap));
    const row = Math.floor((y - offY) / (cardSize + gap));
    if (col >= 0 && col < config.gridSize.cols && row >= 0 && row < config.gridSize.rows) {
      const idx = row * config.gridSize.cols + col;
      const cX = offX + col * (cardSize + gap);
      const cY = offY + row * (cardSize + gap);
      if (x >= cX && x <= cX + cardSize && y >= cY && y <= cY + cardSize) onCardClick(idx);
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col z-10" onClick={handleClick}>
      <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} className="block w-full h-full cursor-pointer" />
    </div>
  );
}
