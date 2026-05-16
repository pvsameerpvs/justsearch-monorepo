"use client";
import { useEffect } from "react";
import { drawMaze, drawEntity, drawFog } from "./cheese-chase-canvas-art";
import { CHEESE_CHASE_PADDING } from "./cheese-chase-types";
interface CheeseChaseBoardProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  dimensions: { width: number; height: number };
  maze: boolean[][][];
  mousePos: { col: number; row: number };
  cheesePos: { col: number; row: number };
  traps: { col: number; row: number }[];
  isStuck: boolean;
  gameState: string;
  config: { gridSize: { cols: number; rows: number }; hasFog?: boolean };
}
export function CheeseChaseBoard({
  canvasRef,
  dimensions,
  maze,
  mousePos,
  cheesePos,
  traps,
  isStuck,
  gameState,
  config,
}: CheeseChaseBoardProps) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !maze.length) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = dimensions;
    const padding = CHEESE_CHASE_PADDING;
    const cellSize = Math.min((width - padding * 2) / config.gridSize.cols, (height - padding * 2) / config.gridSize.rows);
    const mazeWidth = cellSize * config.gridSize.cols;
    const mazeHeight = cellSize * config.gridSize.rows;
    const offsetX = (width - mazeWidth) / 2;
    const offsetY = (height - mazeHeight) / 2;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      drawMaze({ ctx, width, height }, maze, cellSize, offsetX, offsetY);
      traps.forEach((trap) => drawEntity({ ctx }, trap.col, trap.row, cellSize, offsetX, offsetY, "TRAP"));
      drawEntity({ ctx }, cheesePos.col, cheesePos.row, cellSize, offsetX, offsetY, "CHEESE");
      ctx.save();
      if (isStuck) ctx.globalAlpha = 0.5;
      drawEntity({ ctx }, mousePos.col, mousePos.row, cellSize, offsetX, offsetY, "MOUSE");
      ctx.restore();
      if (config.hasFog) drawFog({ ctx, width, height }, mousePos.col, mousePos.row, cellSize, offsetX, offsetY);
      if (gameState === "INTER-LEVEL") {
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#1e293b";
        ctx.font = "black 32px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.letterSpacing = "2px";
        ctx.fillText("LEVEL COMPLETE!", width / 2, height / 2);
      }
    };

    const frameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frameId);
  }, [dimensions, maze, mousePos, cheesePos, traps, isStuck, gameState, config, canvasRef]);

  return (
    <div className="flex-1 relative">
      <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} className="block h-full w-full touch-none" />
    </div>
  );
}
