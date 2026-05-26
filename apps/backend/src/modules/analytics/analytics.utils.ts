// Get UTC midnight and end-of-day for a given date offset from today
export function getUtcDayBounds(daysAgo = 0): { start: string; end: string } {
  const now = new Date();
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo, 0, 0, 0));
  const start = d.toISOString();
  const end = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo, 23, 59, 59, 999)).toISOString();
  return { start, end };
}

export function safeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[];
  if (typeof value === 'string') {
    try { return JSON.parse(value) as string[]; } catch { return []; }
  }
  return [];
}

export function sumTotals(orders: Record<string, unknown>[]): number {
  return orders.reduce((sum, o) => sum + Number(o.total ?? 0), 0);
}
