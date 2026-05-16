export type OpeningHour = {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
  isToday?: boolean;
};

export function getTodaysHours(hours: OpeningHour[]): string {
  const today = hours.find((h) => h.isToday);
  if (!today || !today.isOpen) return "Closed today";
  return `${today.open} – ${today.close}`;
}

export function isCurrentlyOpen(hours: OpeningHour[]): boolean {
  const today = hours.find((h) => h.isToday);
  if (!today || !today.isOpen) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [openH, openM] = today.open.split(":").map(Number);
  const [closeH, closeM] = today.close.split(":").map(Number);

  const openMinutes = (openH || 0) * 60 + (openM || 0);
  const closeMinutes = (closeH || 0) * 60 + (closeM || 0);

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}
