"use client";

/**
 * Old mechanical telephone bell — "DRING ... DRIIIING".
 * Raspy square wave with fast attack, long ring decay, mechanical pause between strikes.
 * Very loud, 10+ seconds, unmistakable old-phone sound.
 */

let sharedCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!sharedCtx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    sharedCtx = new AC();
  }
  return sharedCtx;
}

export function prepareAudioContext() {
  getContext();
}

export function resumeAudioContext(): Promise<void> {
  const ctx = getContext();
  if (!ctx) return Promise.resolve();
  if (ctx.state === "suspended") return ctx.resume();
  return Promise.resolve();
}

export function isAudioReady(): boolean {
  const ctx = getContext();
  return ctx !== null && ctx.state === "running";
}

let activeOsc: OscillatorNode | null = null;
let activeGain: GainNode | null = null;
let activeFilter: BiquadFilterNode | null = null;
let ringInterval: ReturnType<typeof setInterval> | null = null;
let stopTimer: ReturnType<typeof setTimeout> | null = null;

function clearAll(): void {
  if (activeOsc) { try { activeOsc.stop(); activeOsc.disconnect(); } catch {} activeOsc = null; }
  if (activeGain) { try { activeGain.disconnect(); } catch {} activeGain = null; }
  if (activeFilter) { try { activeFilter.disconnect(); } catch {} activeFilter = null; }
  if (ringInterval) { clearInterval(ringInterval); ringInterval = null; }
  if (stopTimer) { clearTimeout(stopTimer); stopTimer = null; }
}

/** Play one mechanical "DRING" strike. */
function playDringStrike(ctx: AudioContext, now: number) {
  // Lowpass filter simulates the metal bell's limited harmonics
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2500, now);
  filter.Q.setValueAtTime(1.5, now);

  // Square wave = raspy mechanical bell ringer
  const osc = ctx.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(800, now);
  // Slight pitch wobble for mechanical imperfection
  osc.frequency.linearRampToValueAtTime(780, now + 0.3);
  osc.frequency.linearRampToValueAtTime(800, now + 0.6);

  // VERY LOUD gain
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  // Fast mechanical strike (3ms)
  gain.gain.linearRampToValueAtTime(0.98, now + 0.003);
  // Long ring decay (the "DRIIIIIING")
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

  // Add a second slightly detuned osc for thickness
  const osc2 = ctx.createOscillator();
  osc2.type = "square";
  osc2.frequency.setValueAtTime(805, now);
  const g2 = ctx.createGain();
  g2.gain.setValueAtTime(0.35, now);
  g2.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

  osc.connect(gain);
  osc2.connect(g2);
  gain.connect(filter);
  g2.connect(filter);
  filter.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 2.0);
  osc2.start(now);
  osc2.stop(now + 1.8);

  activeOsc = osc;
  activeGain = gain;
  activeFilter = filter;
}

/**
 * Play old phone bell: DRING ... DRIIIING ... DRING ... DRIIIING
 * 10 seconds total, very loud mechanical ringer.
 */
export function playNotificationSound(): boolean {
  const ctx = getContext();
  if (!ctx) return false;

  clearAll();

  const now = ctx.currentTime;

  // First strike immediately
  playDringStrike(ctx, now);

  // Then every 1.8 seconds: DRING ... (pause) ... DRING
  let strikes = 1;
  ringInterval = setInterval(() => {
    if (!sharedCtx) return;
    playDringStrike(sharedCtx, sharedCtx.currentTime);
    strikes++;
    if (strikes >= 6) {
      // After 6 strikes, slow down to every 2.5s for the tail
      if (ringInterval) clearInterval(ringInterval);
      ringInterval = setInterval(() => {
        if (!sharedCtx) return;
        playDringStrike(sharedCtx, sharedCtx.currentTime);
      }, 2500);
    }
  }, 1800);

  // Total duration: 12 seconds
  stopTimer = setTimeout(() => {
    clearAll();
  }, 12_000);

  return true;
}

export function stopNotificationSound(): void {
  clearAll();
}

export function unlockAudioOnInteraction(): void {
  if (typeof window === "undefined") return;

  const unlock = () => {
    resumeAudioContext();
    window.removeEventListener("click", unlock);
    window.removeEventListener("keydown", unlock);
    window.removeEventListener("touchstart", unlock);
  };

  window.addEventListener("click", unlock, { once: true, passive: true });
  window.addEventListener("keydown", unlock, { once: true, passive: true });
  window.addEventListener("touchstart", unlock, { once: true, passive: true });
}
