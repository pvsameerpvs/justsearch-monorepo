import { Calendar } from "lucide-react";

export function OpeningTodayCard({ hours }: { hours: string }) {
  return (
    <div className="flex justify-center pb-5 pt-2">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 pr-6 text-white backdrop-blur-xl transition-all hover:bg-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgb(var(--brand)/0.2)] text-[rgb(var(--brand))]">
          <Calendar className="h-4 w-4" />
        </div>
        <div className="text-left">
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">Opening Today</p>
          <p className="font-display text-sm font-bold">{hours}</p>
        </div>
      </div>
    </div>
  );
}
