import { CARD_SIZE, DPR_CAP, BRUSH_SIZE } from './scratch-card-types';

export function drawScratchSurface(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';
  const g = ctx.createLinearGradient(0, 0, width, height);
  g.addColorStop(0, '#e5e5e5');
  g.addColorStop(0.5, '#ffffff');
  g.addColorStop(1, '#d4d4d4');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);
  for (let i = 0; i < 2000; i += 1) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.05)';
    ctx.fillRect(Math.random() * width, Math.random() * height, Math.random() * 1.5, Math.random() * 1.5);
  }
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.moveTo(width * 0.53, height * 0.13);
  ctx.lineTo(width * 0.86, height * 0.12);
  ctx.lineTo(width * 0.90, height * 0.25);
  ctx.lineTo(width * 0.58, height * 0.28);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${Math.max(14, width * 0.053)}px sans-serif`;
  ctx.fillText('SCRAAATCH', width * 0.58, height * 0.20);
  ctx.font = `bold ${Math.max(18, width * 0.067)}px sans-serif`;
  ctx.fillStyle = '#222';
  ctx.fillText('ME', width * 0.83, height * 0.33);
  ctx.fillStyle = '#FFB800';
  ctx.beginPath();
  ctx.ellipse(width * 0.5, height * 0.60, width * 0.40, height * 0.13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#222';
  ctx.lineWidth = Math.max(1.5, Math.min(width, height) * 0.01);
  const star = (x: number, y: number, r: number) => {
    ctx.beginPath();
    for (let i = 0; i < 5; i += 1) {
      ctx.lineTo(Math.cos(((18 + 72 * i) / 180) * Math.PI) * r + x, -Math.sin(((18 + 72 * i) / 180) * Math.PI) * r + y);
      ctx.lineTo(Math.cos(((54 + 72 * i) / 180) * Math.PI) * (r / 2) + x, -Math.sin(((54 + 72 * i) / 180) * Math.PI) * (r / 2) + y);
    }
    ctx.closePath(); ctx.stroke();
  };
  star(width * 0.47, height * 0.40, width * 0.06);
  star(width * 0.62, height * 0.34, width * 0.045);
  star(width * 0.73, height * 0.44, width * 0.035);
  ctx.beginPath(); ctx.arc(width * 0.67, height * 0.60, width * 0.13, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(width * 0.62, height * 0.56, width * 0.01, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(width * 0.72, height * 0.56, width * 0.01, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(width * 0.67, height * 0.63, width * 0.065, 0, Math.PI); ctx.stroke();
}
export function setupCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
  canvas.width = Math.max(1, Math.round(CARD_SIZE * dpr));
  canvas.height = Math.max(1, Math.round(CARD_SIZE * dpr));
  canvas.style.width = `${CARD_SIZE}px`;
  canvas.style.height = `${CARD_SIZE}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawScratchSurface(ctx, CARD_SIZE, CARD_SIZE);
}
export function doScratch(ctx: CanvasRenderingContext2D, last: { x: number; y: number }, x: number, y: number, start: boolean) {
  ctx.globalCompositeOperation = 'destination-out';
  ctx.lineWidth = BRUSH_SIZE;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(start ? x : last.x, start ? y : last.y);
  ctx.lineTo(x, y);
  ctx.stroke();
}
export function checkRevealThreshold(canvas: HTMLCanvasElement, sampleCtx: CanvasRenderingContext2D, size: number) {
  sampleCtx.clearRect(0, 0, size, size);
  sampleCtx.drawImage(canvas, 0, 0, size, size);
  const pixels = sampleCtx.getImageData(0, 0, size, size).data;
  let transparent = 0;
  for (let i = 3; i < pixels.length; i += 4) if (pixels[i] === 0) transparent += 1;
  return (transparent / (pixels.length / 4)) * 100;
}
