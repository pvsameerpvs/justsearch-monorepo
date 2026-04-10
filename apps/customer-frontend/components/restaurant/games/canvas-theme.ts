type RgbFallback = `${number} ${number} ${number}` | `${number},${number},${number}` | string;

function normalizeTriplet(value: string): string | null {
  const parts = value
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => Number(part));

  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    return null;
  }

  return `${parts[0]}, ${parts[1]}, ${parts[2]}`;
}

function readCssVar(varName: string): string {
  if (typeof window === 'undefined') {
    return '';
  }

  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

export function themeRgb(varName: string, fallback: RgbFallback): string {
  const raw = readCssVar(varName) || String(fallback);
  const triplet = normalizeTriplet(raw) ?? normalizeTriplet(String(fallback));

  return triplet ? `rgb(${triplet})` : 'rgb(15, 23, 42)';
}

export function themeRgba(varName: string, fallback: RgbFallback, alpha: number): string {
  const raw = readCssVar(varName) || String(fallback);
  const triplet = normalizeTriplet(raw) ?? normalizeTriplet(String(fallback));

  return triplet ? `rgba(${triplet}, ${alpha})` : `rgba(15, 23, 42, ${alpha})`;
}

