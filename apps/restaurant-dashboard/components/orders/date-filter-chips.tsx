import { isSameUtcDay, isSameUtcMonth } from "./time-utils";

interface DateFilterChipsProps {
  date: Date;
  view: "day" | "month" | "all";
  today: Date;
  onDateChange: (d: Date) => void;
  onViewChange: (v: "day" | "month" | "all") => void;
}

export function DateFilterChips({ date, view, today, onDateChange, onViewChange }: DateFilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => { onViewChange("day"); onDateChange(today); }}
        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
          view === "day" && isSameUtcDay(date, today)
            ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        Today
      </button>
      <button
        onClick={() => { onViewChange("month"); onDateChange(today); }}
        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
          view === "month" && isSameUtcMonth(date, today)
            ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        This Month
      </button>
      <button
        onClick={() => onViewChange("all")}
        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
          view === "all"
            ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        All Time
      </button>
    </div>
  );
}
