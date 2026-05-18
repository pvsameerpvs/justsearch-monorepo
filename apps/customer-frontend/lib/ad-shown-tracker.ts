const STORAGE_KEY = 'justsearch:adShownIds';

interface ShownRecord {
  date: string;
  adIds: string[];
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function getShownAdIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const record: ShownRecord = JSON.parse(raw);
    if (record.date !== getToday()) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    return record.adIds;
  } catch {
    return [];
  }
}

export function markAdShown(adId: string): void {
  try {
    const shown = getShownAdIds();
    if (!shown.includes(adId)) {
      shown.push(adId);
      const record: ShownRecord = { date: getToday(), adIds: shown };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    }
  } catch {
    // Silently fail
  }
}
