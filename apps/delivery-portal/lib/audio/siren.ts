import { playTone } from "./tone";

export function playSiren(volume: number) {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const vol = Math.max(0, Math.min(1, volume));

    playTone(ctx, 1200, now, 0.25, "square", 1.0 * vol);
    playTone(ctx, 880, now + 0.25, 0.25, "square", 1.0 * vol);
    playTone(ctx, 1200, now + 0.50, 0.25, "square", 1.0 * vol);
    playTone(ctx, 880, now + 0.75, 0.25, "square", 1.0 * vol);
    playTone(ctx, 2000, now, 0.08, "sine", 0.8 * vol);
    playTone(ctx, 2000, now + 0.25, 0.08, "sine", 0.8 * vol);
    playTone(ctx, 2000, now + 0.50, 0.08, "sine", 0.8 * vol);
    playTone(ctx, 2000, now + 0.75, 0.08, "sine", 0.8 * vol);
    playTone(ctx, 150, now, 0.15, "sine", 0.6 * vol);
    playTone(ctx, 150, now + 0.50, 0.15, "sine", 0.6 * vol);

    setTimeout(() => {
      try { ctx.close(); } catch { /* ignore */ }
    }, 1500);
  } catch { /* Audio not supported */ }
}

export function playBigBell(volume: number) {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const vol = Math.max(0, Math.min(1, volume)) * 0.95;

    playTone(ctx, 880, now, 0.35, "sine", vol);
    playTone(ctx, 1760, now, 0.25, "triangle", vol * 0.3);
    playTone(ctx, 880, now + 0.35, 0.35, "sine", vol);
    playTone(ctx, 1760, now + 0.35, 0.25, "triangle", vol * 0.3);
    playTone(ctx, 880, now + 0.70, 0.35, "sine", vol);
    playTone(ctx, 1760, now + 0.70, 0.25, "triangle", vol * 0.3);
    playTone(ctx, 660, now + 1.15, 0.70, "sine", vol * 0.9);
    playTone(ctx, 1320, now + 1.15, 0.50, "triangle", vol * 0.25);

    setTimeout(() => {
      try { ctx.close(); } catch { /* ignore */ }
    }, 2500);
  } catch { /* Audio not supported */ }
}
