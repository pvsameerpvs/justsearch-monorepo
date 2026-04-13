import type { VexRunnerFoodItem } from './vex-runner-model';

type LegFrame = 0 | 1;

const spriteCache = new Map<string, HTMLImageElement>();

const SVG_VIEWBOX = 120;
const SPRITE_FRAME_MS = 120;
const SPRITE_SCALE = 1.78;
const SHADOW_COLOR = 'rgba(0, 0, 0, 0.18)';
const SHADOW_OFFSET_Y = 2;
const SHADOW_RADIUS_X_RATIO = 0.4;
const SHADOW_RADIUS_Y_RATIO = 0.11;
const BOB_SPEED = 0.011;
const BOB_RATIO = 0.03;
const TILT_DIVISOR = 1900;
const TILT_MAX = 0.22;

const FACE_MARKUP = `
  <circle cx="52" cy="68" r="2.8" fill="#1f2937"/>
  <circle cx="68" cy="68" r="2.8" fill="#1f2937"/>
  <path d="M52 78 Q60 84 68 78" stroke="#1f2937" stroke-width="3.2" stroke-linecap="round" fill="none"/>
`;

const LEG_MARKUP_BY_FRAME: Record<LegFrame, string> = {
  0: `
    <path d="M50 86 L43 107" stroke="#1f2937" stroke-width="6" stroke-linecap="round"/>
    <path d="M70 86 L80 107" stroke="#1f2937" stroke-width="6" stroke-linecap="round"/>
    <path d="M41 107 L49 107" stroke="#1f2937" stroke-width="5" stroke-linecap="round"/>
    <path d="M78 107 L86 107" stroke="#1f2937" stroke-width="5" stroke-linecap="round"/>
    <path d="M45 72 L34 78" stroke="#1f2937" stroke-width="5" stroke-linecap="round"/>
    <path d="M75 72 L85 68" stroke="#1f2937" stroke-width="5" stroke-linecap="round"/>
  `,
  1: `
    <path d="M50 86 L40 107" stroke="#1f2937" stroke-width="6" stroke-linecap="round"/>
    <path d="M70 86 L77 107" stroke="#1f2937" stroke-width="6" stroke-linecap="round"/>
    <path d="M38 107 L46 107" stroke="#1f2937" stroke-width="5" stroke-linecap="round"/>
    <path d="M75 107 L83 107" stroke="#1f2937" stroke-width="5" stroke-linecap="round"/>
    <path d="M45 72 L35 67" stroke="#1f2937" stroke-width="5" stroke-linecap="round"/>
    <path d="M75 72 L86 78" stroke="#1f2937" stroke-width="5" stroke-linecap="round"/>
  `,
};

const FOOD_BODY_MARKUP: Record<VexRunnerFoodItem, string> = {
  burger: `
    <rect x="32" y="76" width="56" height="10" rx="5" fill="#d88934"/>
    <rect x="33" y="67" width="54" height="8" rx="4" fill="#5c2f13"/>
    <rect x="35" y="62" width="50" height="5" rx="2.5" fill="#ffd34a"/>
    <path d="M32 62 Q60 34 88 62 Z" fill="#f2b05b" stroke="#d28b3d" stroke-width="2.5"/>
    <ellipse cx="49" cy="53" rx="2.4" ry="1.3" fill="#fff3d2"/>
    <ellipse cx="59" cy="49" rx="2.4" ry="1.3" fill="#fff3d2"/>
    <ellipse cx="70" cy="53" rx="2.4" ry="1.3" fill="#fff3d2"/>
    <path d="M36 61 Q46 67 56 61 Q66 55 76 61 Q83 66 86 61" stroke="#58c05e" stroke-width="2.8" fill="none" stroke-linecap="round"/>
  `,
  pizza: `
    <path d="M60 18 L90 84 L30 84 Z" fill="#f8c56c" stroke="#cc8f3d" stroke-width="2.5"/>
    <path d="M60 26 L83 79 L37 79 Z" fill="#f25a49"/>
    <circle cx="58" cy="52" r="4.8" fill="#ffd86b"/>
    <circle cx="69" cy="65" r="5.2" fill="#a94835"/>
    <circle cx="49" cy="67" r="4.6" fill="#a94835"/>
    <path d="M44 61 Q53 66 62 61 Q70 56 78 61" stroke="#57bf5e" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  `,
  donut: `
    <circle cx="60" cy="60" r="28" fill="#de9751"/>
    <circle cx="60" cy="57" r="23" fill="#f36bb1"/>
    <circle cx="60" cy="60" r="10.5" fill="#f8f3e8"/>
    <rect x="45" y="46" width="6" height="2.4" rx="1.2" fill="#fff3d7" transform="rotate(-18 48 47)"/>
    <rect x="67" y="49" width="6" height="2.4" rx="1.2" fill="#fff3d7" transform="rotate(24 70 50)"/>
    <rect x="63" y="70" width="6" height="2.4" rx="1.2" fill="#fff3d7" transform="rotate(-26 66 71)"/>
    <rect x="49" y="68" width="6" height="2.4" rx="1.2" fill="#fff3d7" transform="rotate(22 52 69)"/>
  `,
  taco: `
    <path d="M27 82 Q60 24 93 82 Z" fill="#f4bf58" stroke="#cb8f3d" stroke-width="2.5"/>
    <path d="M35 75 Q43 66 51 75 Q59 84 67 75 Q75 66 85 74" stroke="#56c35f" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="48" cy="72" r="3.3" fill="#d76049"/>
    <circle cx="59" cy="76" r="3.3" fill="#d76049"/>
    <circle cx="71" cy="71" r="3.3" fill="#d76049"/>
  `,
  sushi: `
    <rect x="31" y="34" width="58" height="50" rx="11" fill="#202938"/>
    <rect x="37" y="40" width="46" height="37" rx="8" fill="#f5f1ea"/>
    <rect x="41" y="44" width="38" height="14" rx="7" fill="#f67868"/>
    <circle cx="50" cy="50.5" r="2.8" fill="#ffd2a0"/>
    <circle cx="70" cy="50.5" r="2.6" fill="#7bd58a"/>
  `,
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function buildFoodRunnerSvg(foodItem: VexRunnerFoodItem, frame: LegFrame) {
  const bodyMarkup = FOOD_BODY_MARKUP[foodItem] ?? FOOD_BODY_MARKUP.burger;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${SVG_VIEWBOX}" height="${SVG_VIEWBOX}" viewBox="0 0 ${SVG_VIEWBOX} ${SVG_VIEWBOX}">
      <defs>
        <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1f2937" flood-opacity="0.18"/>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        ${bodyMarkup}
        ${FACE_MARKUP}
        ${LEG_MARKUP_BY_FRAME[frame]}
      </g>
    </svg>
  `;
}

function getSprite(foodItem: VexRunnerFoodItem, frame: LegFrame) {
  if (typeof window === 'undefined') {
    return null;
  }

  const key = `${foodItem}:${frame}`;
  const cached = spriteCache.get(key);
  if (cached) {
    return cached;
  }

  const image = new Image();
  image.decoding = 'async';
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    buildFoodRunnerSvg(foodItem, frame),
  )}`;
  spriteCache.set(key, image);
  return image;
}

function getLegFrame(time: number): LegFrame {
  return (Math.floor(time / SPRITE_FRAME_MS) % 2) as LegFrame;
}

export function drawFoodRunner(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  foodItem: VexRunnerFoodItem,
  velocity: number,
  time: number,
) {
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const bob = Math.sin(time * BOB_SPEED) * size * BOB_RATIO;
  const tilt = clamp(velocity / TILT_DIVISOR, -TILT_MAX, TILT_MAX);
  const frame = getLegFrame(time);
  const sprite = getSprite(foodItem, frame);
  getSprite(foodItem, frame === 0 ? 1 : 0);

  ctx.save();

  ctx.fillStyle = SHADOW_COLOR;
  ctx.beginPath();
  ctx.ellipse(
    centerX,
    y + size + SHADOW_OFFSET_Y,
    size * SHADOW_RADIUS_X_RATIO,
    size * SHADOW_RADIUS_Y_RATIO,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  ctx.translate(centerX, centerY + bob);
  ctx.rotate(tilt);
  ctx.translate(-centerX, -centerY);

  const spriteSize = size * SPRITE_SCALE;
  const spriteX = centerX - spriteSize / 2;
  const spriteY = centerY - spriteSize / 2;

  if (sprite?.complete && sprite.naturalWidth > 0) {
    ctx.drawImage(sprite, spriteX, spriteY, spriteSize, spriteSize);
  } else {
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(centerX, centerY, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
