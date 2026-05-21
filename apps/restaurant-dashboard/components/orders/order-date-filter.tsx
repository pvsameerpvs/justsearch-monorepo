import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { addUtcDays, addUtcMonths, formatUtcDateLabel } from "./time-utils";
import { DateFilterChips } from "./date-filter-chips";

interface OrderDateFilterProps {
  date: Date;
  view: "day" | "month" | "all";
  onDateChange: (date: Date) => void;
  onViewChange: (view: "day" | "month" | "all") => void;
}

const VIEWS = ["day", "month", "all"] as const;

function getTodayUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

export function OrderDateFilter({ date, view, onDateChange, onViewChange }: OrderDateFilterProps) {
  const label = view === "all" ? "All Time" : formatUtcDateLabel(date, view);
  const today = getTodayUtc();

  const handlePrev = () => {
    onDateChange(view === "day" ? addUtcDays(date, -1) : addUtcMonths(date, -1));
  };

  const handleNext = () => {
    onDateChange(view === "day" ? addUtcDays(date, 1) : addUtcMonths(date, 1));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {view !== "all" && (
          <button onClick={handlePrev} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        <div className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-bold text-slate-800">{label}</span>
        </div>

        {view !== "all" && (
          <button onClick={handleNext} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        <div className="flex rounded-lg bg-slate-100 p-0.5">
          {VIEWS.map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={`rounded-md px-3 py-1.5 text-xs font-bold capitalize transition-all ${
                view === v ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <DateFilterChips date={date} view={view} today={today} onDateChange={onDateChange} onViewChange={onViewChange} />
    </div>
  );
}
