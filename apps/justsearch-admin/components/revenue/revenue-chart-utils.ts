export function formatAed(value: number) {
  if (value >= 1000) return `AED ${(value / 1000).toFixed(0)}k`;
  return `AED ${value}`;
}

export function buildChartData(months: string[], trend: number[]) {
  return trend.map((revenue, i) => ({ month: months[i] ?? '', revenue }));
}
