/**
 * Memory Match - Canvas Art
 * Rendering cards with flip animations.
 */

import { Card, MEMORY_MATCH_CONFIG } from './memory-match-model';

interface DrawContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}

export function drawCard(
  { ctx }: DrawContext,
  card: Card,
  x: number,
  y: number,
  size: number,
  flipProgress: number // 0 to 1, where 1 is fully flipped
) {
  const { COLORS } = MEMORY_MATCH_CONFIG;
  const radius = 16;
  
  ctx.save();
  ctx.translate(x + size / 2, y + size / 2);
  
  // Apply horizontal scaling for flip effect
  const scaleX = Math.abs(Math.cos(flipProgress * Math.PI));
  ctx.scale(scaleX, 1);

  const isShowingFront = (flipProgress > 0.5);

  // Draw Card Shadow
  ctx.shadowColor = 'rgba(0,0,0,0.1)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;

  // Draw Card Body
  ctx.beginPath();
  ctx.roundRect(-size / 2, -size / 2, size, size, radius);
  ctx.fillStyle = isShowingFront ? COLORS.CARD_FRONT : COLORS.CARD_BACK;
  ctx.fill();
  
  // Draw Card Border (subtle for dark mode)
  ctx.strokeStyle = isShowingFront ? '#e2e8f0' : '#334155';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  if (isShowingFront) {
    if (card.isMatched) {
        ctx.fillStyle = COLORS.MATCHED + '22';
        ctx.beginPath();
        ctx.roundRect(-size / 2, -size / 2, size, size, radius);
        ctx.fill();
    }

    // Draw Symbol (Emoji)
    ctx.scale(1 / scaleX, 1); // Keep symbol un-squashed
    ctx.font = `${size * 0.5}px Inter, system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(card.value, 0, 0);
  } else {
    // Draw Back Decoration - Premium Dark Look
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)'; // Faint blue glow
    ctx.fill();
    
    // Draw "?" Centered
    ctx.scale(1 / scaleX, 1);
    ctx.font = `black ${size * 0.35}px Inter`;
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MEMORY', 0, 0);
  }

  ctx.restore();
}

export function drawBackground({ ctx, width, height }: DrawContext) {
  // Deep Gradient for Dark Mode
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(1, '#1e293b');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}
