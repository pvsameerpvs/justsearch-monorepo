export function formatTime(isoString: string): string {
  const d = new Date(isoString);
  const h = String(d.getUTCHours()).padStart(2, "0");
  const m = String(d.getUTCMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export function formatDateTime(isoString: string): string {
  const d = new Date(isoString);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  const time = formatTime(isoString);
  return `${date}, ${time}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function getDurationBetween(startIso: string, endIso: string): string {
  const diffMs = new Date(endIso).getTime() - new Date(startIso).getTime();
  const diffMin = diffMs / 60000;
  return formatDuration(diffMin);
}

/* ── UTC date helpers (stable SSR ↔ client) ── */

export function isSameUtcDay(d1: Date, d2: Date): boolean {
  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  );
}

export function isSameUtcMonth(d1: Date, d2: Date): boolean {
  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth()
  );
}

export function addUtcDays(date: Date, days: number): Date {
  const r = new Date(date);
  r.setUTCDate(r.getUTCDate() + days);
  return r;
}

export function addUtcMonths(date: Date, months: number): Date {
  const r = new Date(date);
  r.setUTCMonth(r.getUTCMonth() + months);
  return r;
}

export function formatUtcDateLabel(date: Date, view: "day" | "month"): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (view === "day") {
    return `${date.getUTCDate()} ${months[date.getUTCMonth()]}, ${date.getUTCFullYear()}`;
  }
  return `${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}
