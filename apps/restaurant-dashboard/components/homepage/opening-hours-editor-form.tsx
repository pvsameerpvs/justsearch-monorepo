import { Clock } from "lucide-react";
import { useOpeningHoursEditor, type OpeningHourRow } from "./opening-hours-editor";

interface OpeningHoursEditorFormProps {
  hours: OpeningHourRow[];
  onChange: (hours: OpeningHourRow[]) => void;
  accent: string;
}

export function OpeningHoursEditorForm({ hours, onChange, accent }: OpeningHoursEditorFormProps) {
  const { toggleDay, toggle24Hour, updateTime } = useOpeningHoursEditor(hours, onChange);

  return (
    <div className="space-y-2">
      {hours.map((h) => (
        <div
          key={h.day}
          className={`flex items-center gap-2 rounded-xl border p-2.5 transition-colors ${
            h.isOpen ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50/60"
          }`}
        >
          <button
            onClick={() => toggleDay(h.day)}
            className={`flex h-8 w-12 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
              h.isOpen
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-400 line-through"
            }`}
          >
            {h.day}
          </button>

          {h.isOpen ? (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {h.is24Hour ? (
                <span className="flex-1 text-xs font-bold text-emerald-600">Open 24 hours</span>
              ) : (
                <>
                  <Clock className="h-3 w-3 text-slate-300 shrink-0" />
                  <TimeInput
                    value={h.open}
                    onChange={(v) => updateTime(h.day, "open", v)}
                  />
                  <span className="text-xs text-slate-300 shrink-0">–</span>
                  <TimeInput
                    value={h.close}
                    onChange={(v) => updateTime(h.day, "close", v)}
                  />
                </>
              )}

              <label className="flex items-center gap-1 ml-auto shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={h.is24Hour || false}
                  onChange={() => toggle24Hour(h.day)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">24h</span>
              </label>
            </div>
          ) : (
            <span className="flex-1 text-xs font-semibold text-slate-400">Closed</span>
          )}
        </div>
      ))}
    </div>
  );
}

function TimeInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-7 rounded-md border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 focus:border-slate-400 focus:outline-none w-[96px]"
    />
  );
}
