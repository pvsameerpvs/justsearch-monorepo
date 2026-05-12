import type { SliceMasterFoodItem, SliceTrail } from './slice-master-model';
import { FOOD_COLORS, FOOD_EMOJIS } from './slice-master-model';

export function drawSliceMasterScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  items: SliceMasterFoodItem[],
  trails: SliceTrail[],
  score: number,
  lives: number,
  maxCombo: number,
  now: number,
) {
  // Background
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#fef3c7');
  gradient.addColorStop(1, '#fde68a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Kitchen counter line
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, height - 60);
  ctx.lineTo(width, height - 60);
  ctx.stroke();

  // Draw trails
  drawTrails(ctx, trails, now);

  // Draw items
  for (const item of items) {
    if (item.sliced) {
      drawSlicedItem(ctx, item, now);
    } else {
      drawWholeItem(ctx, item);
    }
  }

  // HUD
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.font = '800 22px ui-sans-serif, system-ui';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`Score: ${score}`, 16, 16);

  // Combo display
  if (maxCombo >= 3) {
    ctx.fillStyle = '#d97706';
    ctx.font = '700 16px ui-sans-serif, system-ui';
    ctx.fillText(`Max Combo: ${maxCombo}x`, 16, 44);
  }

  // Lives
  ctx.textAlign = 'right';
  ctx.font = '800 22px ui-sans-serif, system-ui';
  ctx.fillStyle = '#dc2626';
  let livesText = '';
  for (let i = 0; i < lives; i++) {
    livesText += '❤️';
  }
  ctx.fillText(livesText, width - 16, 16);

  // Missed hearts
  const missed = 3 - lives;
  if (missed > 0) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    let missedText = '';
    for (let i = 0; i < missed; i++) {
      missedText += '🖤';
    }
    ctx.fillText(missedText, width - 16, 16);
  }
}

function drawWholeItem(ctx: CanvasRenderingContext2D, item: SliceMasterFoodItem) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(item.rotation);

  const r = item.radius;

  // Glow
  ctx.shadowColor = FOOD_COLORS[item.type];
  ctx.shadowBlur = 12;

  // Body
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = FOOD_COLORS[item.type];
  ctx.fill();
  ctx.shadowBlur = 0;

  // Emoji
  ctx.font = `${r * 1.2}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(FOOD_EMOJIS[item.type], 0, 2);

  ctx.restore();
}

function drawSlicedItem(
  ctx: CanvasRenderingContext2D,
  item: SliceMasterFoodItem,
  now: number,
) {
  const elapsed = now - item.sliceTime;
  const alpha = Math.max(0, 1 - elapsed / 400);

  if (alpha <= 0) return;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(item.x, item.y);

  const r = item.radius;

  // Left half
  ctx.save();
  ctx.rotate(-0.3 - elapsed * 0.002);
  ctx.beginPath();
  ctx.arc(0, 0, r, Math.PI / 2, -Math.PI / 2);
  ctx.fillStyle = FOOD_COLORS[item.type];
  ctx.fill();
  ctx.restore();

  // Right half
  ctx.save();
  ctx.rotate(0.3 + elapsed * 0.002);
  ctx.beginPath();
  ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2);
  ctx.fillStyle = FOOD_COLORS[item.type];
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

function drawTrails(
  ctx: CanvasRenderingContext2D,
  trails: SliceTrail[],
  now: number,
) {
  if (trails.length < 2) return;

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (let i = 1; i < trails.length; i++) {
    const prev = trails[i - 1];
    const curr = trails[i];
    const age = now - curr.time;
    const alpha = Math.max(0, 1 - age / 200);

    if (alpha <= 0) continue;

    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(curr.x, curr.y);
    ctx.lineWidth = 8 * alpha;
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
    ctx.stroke();
  }

  ctx.restore();
}

export function drawGameOverScreen(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  score: number,
  maxCombo: number,
  isTopScorer: boolean,
) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = '800 36px ui-sans-serif, system-ui';
  ctx.fillText('Chop! Game Over!', width / 2, height / 2 - 50);

  ctx.font = '600 22px ui-sans-serif, system-ui';
  ctx.fillText(`Score: ${score}`, width / 2, height / 2 + 10);

  if (maxCombo >= 3) {
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`Best Combo: ${maxCombo}x`, width / 2, height / 2 + 40);
  }

  if (isTopScorer) {
    ctx.font = '800 24px ui-sans-serif, system-ui';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('You are the Top Scorer!', width / 2, height / 2 + 80);
  }
}
