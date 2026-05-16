import { Calendar } from "lucide-react";
import { isCurrentlyOpen } from "@/lib/opening-hours";
import type { OpeningHour } from "@/lib/opening-hours";

interface OpeningTodayCardProps {
  hours: OpeningHour[];
}

export function OpeningTodayCard({ hours }: OpeningTodayCardProps) {
  const open = isCurrentlyOpen(hours);
  const today = hours.find((h) => h.isToday);

  let display: string;
  let statusLabel: string;

  if (!today || !today.isOpen) {
    display = "Closed";
    statusLabel = "Closed";
  } else if (today.is24Hour) {
    display = "Open 24 hours";
    statusLabel = "Open 24h";
  } else {
    display = `${today.open} – ${today.close}`;
    statusLabel = open ? "Open Now" : "Closed";
  }

  const isOpen = open || today?.is24Hour || false;

  return (
    <div className="flex justify-center pb-5 pt-2">
      <div className={`flex items-center gap-3 rounded-2xl border p-3 pr-6 text-white backdrop-blur-xl transition-all hover:bg-white/10 ${
        isOpen ? "border-white/10 bg-white/5" : "border-red-400/20 bg-red-500/10"
      }`}>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
          isOpen ? "bg-[rgb(var(--brand)/0.2)] text-[rgb(var(--brand))]" : "bg-red-500/20 text-red-400"
        }`}>
          <Calendar className="h-4 w-4" />
        </div>
        <div className="text-left">
          <p className={`text-[9px] font-bold uppercase tracking-widest ${
            isOpen ? "text-white/40" : "text-red-300/60"
          }`}>
            {statusLabel}
          </p>
          <p className="font-display text-sm font-bold">{display}</p>
        </div>
      </div>
    </div>
  );
}
