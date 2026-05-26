const SETTINGS_KEY = "driver-settings-v1";

interface DriverSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  volumeLevel: number;
}

export function readNotificationSettings(): DriverSettings {
  if (typeof window === "undefined") return { soundEnabled: true, vibrationEnabled: true, volumeLevel: 100 };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { soundEnabled: true, vibrationEnabled: true, volumeLevel: 100 };
    const parsed = JSON.parse(raw);
    return {
      soundEnabled: parsed.soundEnabled !== false,
      vibrationEnabled: parsed.vibrationEnabled !== false,
      volumeLevel: typeof parsed.volumeLevel === "number" ? Math.max(0, Math.min(100, parsed.volumeLevel)) : 100,
    };
  } catch {
    return { soundEnabled: true, vibrationEnabled: true, volumeLevel: 100 };
  }
}

function playTone(
  ctx: AudioContext,
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType,
  vol: number
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(vol, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration);
}

export function playBigBell() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const settings = readNotificationSettings();
    const vol = (settings.volumeLevel / 100) * 0.95;

    // LOUD DING-DING-DING-DONG
    playTone(ctx, 880, now, 0.35, "sine", vol);
    playTone(ctx, 1760, now, 0.25, "triangle", vol * 0.3);
    playTone(ctx, 880, now + 0.35, 0.35, "sine", vol);
    playTone(ctx, 1760, now + 0.35, 0.25, "triangle", vol * 0.3);
    playTone(ctx, 880, now + 0.70, 0.35, "sine", vol);
    playTone(ctx, 1760, now + 0.70, 0.25, "triangle", vol * 0.3);
    playTone(ctx, 660, now + 1.15, 0.70, "sine", vol * 0.9);
    playTone(ctx, 1320, now + 1.15, 0.50, "triangle", vol * 0.25);

    setTimeout(() => { try { ctx.close(); } catch { /* ignore */ } }, 2500);
  } catch {
    // Audio not supported
  }
}

export function doVibrate() {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate([300, 150, 300, 150, 500]);
  }
}
