import { useCallback } from "react";

export type OpeningHourRow = {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
  isToday?: boolean;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const DEFAULT_OPENING_HOURS: OpeningHourRow[] = DAYS.map((day) => ({
  day,
  open: "09:00",
  close: "22:00",
  isOpen: true,
}));

export function formatHoursDisplay(hours: OpeningHourRow[]): string {
  const today = hours.find((h) => h.isToday);
  if (!today || !today.isOpen) return "Closed today";
  return `${today.open} – ${today.close}`;
}

export function useOpeningHoursEditor(
  openingHours: OpeningHourRow[],
  onChange: (hours: OpeningHourRow[]) => void
) {
  const toggleDay = useCallback(
    (day: string) => {
      onChange(
        openingHours.map((h) =>
          h.day === day ? { ...h, isOpen: !h.isOpen } : h
        )
      );
    },
    [openingHours, onChange]
  );

  const updateTime = useCallback(
    (day: string, field: "open" | "close", value: string) => {
      onChange(
        openingHours.map((h) =>
          h.day === day ? { ...h, [field]: value } : h
        )
      );
    },
    [openingHours, onChange]
  );

  return { toggleDay, updateTime };
}
