export function formatLastPlayed(value: string) {
  if (!value) return 'No game played yet';
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return 'No game played yet';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(timestamp));
}

export function getLevelTitle(level: number) {
  const titles = ['Rookie','Novice','Apprentice','Challenger','Veteran','Elite','Master','Grandmaster','Legend','Immortal'];
  return titles[Math.min(level - 1, titles.length - 1)] ?? 'Mythic';
}

export function getTierUI(tier: string) {
  if (tier === 'PLATINUM') return { label: 'PLATINUM', color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200', iconColor: 'text-sky-500' };
  if (tier === 'GOLD') return { label: 'GOLD', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', iconColor: 'text-amber-500' };
  if (tier === 'SILVER') return { label: 'SILVER', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', iconColor: 'text-slate-400' };
  return { label: 'ELITE', color: 'text-[rgb(var(--brand))]', bg: 'bg-[rgb(var(--brand-soft)/0.5)]', border: 'border-[rgb(var(--brand)/0.15)]', iconColor: 'text-[rgb(var(--brand))]' };
}
