import { HUNGRY_BIRD_RUSH_CONFIG } from './hungry-bird-rush-model';
import type {
  HungryBirdRushBirdState,
  HungryBirdRushPipe,
  HungryBirdRushStatus,
} from './hungry-bird-rush-model';

type DrawHungryBirdRushSceneArgs = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  playHeight: number;
  now: number;
  status: HungryBirdRushStatus;
  score: number;
  bird: HungryBirdRushBirdState;
  pipes: HungryBirdRushPipe[];
  isTopScorer: boolean;
  topScoreToBeat?: number;
};

function drawSky(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  now: number,
) {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#79d8ff');
  sky.addColorStop(1, '#3eb4e1');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  const cloudBaseY = height * 0.18;
  const drift = (now * 0.012) % (width + 260);

  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  for (let index = 0; index < 4; index += 1) {
    const x = ((index * 210 + drift) % (width + 260)) - 130;
    const y = cloudBaseY + ((index % 2) * 32 - 16);
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.arc(x + 35, y - 8, 28, 0, Math.PI * 2);
    ctx.arc(x + 65, y + 2, 24, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPipe(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const body = ctx.createLinearGradient(x, y, x + width, y);
  body.addColorStop(0, '#8bc34a');
  body.addColorStop(0.5, '#d9ff93');
  body.addColorStop(1, '#6e9e32');
  ctx.fillStyle = body;
  ctx.fillRect(x, y, width, height);

  ctx.strokeStyle = '#4f7f23';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
}

function drawPipes(
  ctx: CanvasRenderingContext2D,
  pipes: HungryBirdRushPipe[],
  playHeight: number,
) {
  for (const pipe of pipes) {
    const topHeight = pipe.gapY;
    const bottomY = pipe.gapY + HUNGRY_BIRD_RUSH_CONFIG.pipeGapHeight;
    const bottomHeight = Math.max(0, playHeight - bottomY);

    drawPipe(ctx, pipe.x, 0, HUNGRY_BIRD_RUSH_CONFIG.pipeWidth, topHeight);
    drawPipe(ctx, pipe.x, bottomY, HUNGRY_BIRD_RUSH_CONFIG.pipeWidth, bottomHeight);

    const capHeight = 18;
    const capOffset = 6;
    drawPipe(
      ctx,
      pipe.x - capOffset,
      topHeight - capHeight,
      HUNGRY_BIRD_RUSH_CONFIG.pipeWidth + capOffset * 2,
      capHeight,
    );
    drawPipe(
      ctx,
      pipe.x - capOffset,
      bottomY,
      HUNGRY_BIRD_RUSH_CONFIG.pipeWidth + capOffset * 2,
      capHeight,
    );
  }
}

function drawBird(
  ctx: CanvasRenderingContext2D,
  bird: HungryBirdRushBirdState,
  now: number,
) {
  const { birdX, birdRadius } = HUNGRY_BIRD_RUSH_CONFIG;
  const wobble = Math.sin(now / 95) * 1.2;
  const wingYOffset = Math.sin(now / 70) * 2;

  ctx.save();
  ctx.translate(birdX, bird.y + wobble);

  const tilt = Math.max(-0.5, Math.min(0.7, bird.velocity / 520));
  ctx.rotate(tilt);

  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(0, 0, birdRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(birdRadius - 2, -2);
  ctx.lineTo(birdRadius + 14, 4);
  ctx.lineTo(birdRadius - 2, 9);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.ellipse(-4, 2 + wingYOffset, birdRadius * 0.6, birdRadius * 0.42, -0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(5, -7, 5.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#111827';
  ctx.beginPath();
  ctx.arc(7.2, -7, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawGround(
  ctx: CanvasRenderingContext2D,
  width: number,
  playHeight: number,
  height: number,
) {
  const floor = ctx.createLinearGradient(0, playHeight, 0, height);
  floor.addColorStop(0, '#1f2937');
  floor.addColorStop(1, '#111827');
  ctx.fillStyle = floor;
  ctx.fillRect(0, playHeight, width, HUNGRY_BIRD_RUSH_CONFIG.floorHeight);

  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, playHeight + 1);
  ctx.lineTo(width, playHeight + 1);
  ctx.stroke();
}

function drawCenterMessage(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  title: string,
  subtitle: string,
) {
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = '800 42px ui-sans-serif, system-ui';
  ctx.fillText(title, width / 2, height / 2 - 24);

  ctx.font = '600 20px ui-sans-serif, system-ui';
  ctx.fillText(subtitle, width / 2, height / 2 + 18);
}

export function drawHungryBirdRushScene({
  ctx,
  width,
  height,
  playHeight,
  now,
  status,
  score,
  bird,
  pipes,
  isTopScorer,
  topScoreToBeat: _topScoreToBeat,
}: DrawHungryBirdRushSceneArgs) {
  drawSky(ctx, width, playHeight, now);
  drawPipes(ctx, pipes, playHeight);
  drawBird(ctx, bird, now);
  drawGround(ctx, width, playHeight, height);

  if (status === 'ready') {
    drawCenterMessage(ctx, width, height, 'Hungry Bird Rush', 'Tap to Start');
  }

  if (status === 'finished') {
    drawCenterMessage(ctx, width, height, 'Game Over', `Score: ${score}`);
    if (isTopScorer) {
      ctx.fillStyle = '#fde047';
      ctx.font = '800 20px ui-sans-serif, system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('You are the Top Scorer!', width / 2, height / 2 + 54);
    }
  }
}
