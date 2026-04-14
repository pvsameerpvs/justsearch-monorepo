import { CHEESE_CHASE_CONFIG } from './cheese-chase-model';

interface DrawContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}

export function drawMaze(
  { ctx }: DrawContext,
  maze: boolean[][][], // [row][col][top, right, bottom, left]
  cellSize: number,
  offsetX: number,
  offsetY: number
) {
  ctx.strokeStyle = CHEESE_CHASE_CONFIG.COLORS.WALL;
  ctx.lineWidth = Math.max(2, cellSize * 0.1);
  ctx.lineCap = 'round';

  const rows = maze.length;
  const cols = maze[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = offsetX + c * cellSize;
      const y = offsetY + r * cellSize;
      const walls = maze[r][c];

      // Draw walls
      if (walls[0]) { // Top
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + cellSize, y);
        ctx.stroke();
      }
      if (walls[1]) { // Right
        ctx.beginPath();
        ctx.moveTo(x + cellSize, y);
        ctx.lineTo(x + cellSize, y + cellSize);
        ctx.stroke();
      }
      if (walls[2]) { // Bottom
        ctx.beginPath();
        ctx.moveTo(x + cellSize, y + cellSize);
        ctx.lineTo(x, y + cellSize);
        ctx.stroke();
      }
      if (walls[3]) { // Left
        ctx.beginPath();
        ctx.moveTo(x, y + cellSize);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  }
}

export function drawEntity(
  { ctx }: { ctx: CanvasRenderingContext2D },
  col: number,
  row: number,
  cellSize: number,
  offsetX: number,
  offsetY: number,
  type: 'MOUSE' | 'CHEESE' | 'TRAP'
) {
  const x = offsetX + col * cellSize + cellSize / 2;
  const y = offsetY + row * cellSize + cellSize / 2;
  const size = cellSize * 0.7;

  ctx.save();
  ctx.translate(x, y);

  if (type === 'MOUSE') {
    // Draw Cute Mouse 🐭
    ctx.fillStyle = CHEESE_CHASE_CONFIG.COLORS.MOUSE;
    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, size/2, size/3, 0, 0, Math.PI * 2);
    ctx.fill();
    // Ears
    ctx.beginPath();
    ctx.arc(-size/4, -size/3, size/6, 0, Math.PI * 2);
    ctx.arc(size/4, -size/3, size/6, 0, Math.PI * 2);
    ctx.fill();
    // Eyes
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-size/6, -size/10, 2, 0, Math.PI * 2);
    ctx.arc(size/6, -size/10, 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'CHEESE') {
    // Draw Cheese 🧀
    ctx.fillStyle = CHEESE_CHASE_CONFIG.COLORS.CHEESE;
    ctx.beginPath();
    ctx.moveTo(-size/2, size/2);
    ctx.lineTo(size/2, size/2);
    ctx.lineTo(size/3, -size/2);
    ctx.closePath();
    ctx.fill();
    
    // Cheese holes
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.arc(0, 0, size/10, 0, Math.PI * 2);
    ctx.arc(size/4, size/4, size/15, 0, Math.PI * 2);
    ctx.arc(-size/4, size/5, size/12, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Draw Trap (Sticky Spot) 🍯
    ctx.fillStyle = '#d97706';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.ellipse(0, 0, size/2.5, size/3.5, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }

  ctx.restore();
}


export function drawFog(
  { ctx, width, height }: DrawContext,
  mouseCol: number,
  mouseRow: number,
  cellSize: number,
  offsetX: number,
  offsetY: number
) {
  const x = offsetX + mouseCol * cellSize + cellSize / 2;
  const y = offsetY + mouseRow * cellSize + cellSize / 2;
  const radius = cellSize * 2.5;

  ctx.save();
  ctx.globalCompositeOperation = 'destination-in';
  const grad = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius);
  grad.addColorStop(0, 'rgba(0,0,0,1)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}
