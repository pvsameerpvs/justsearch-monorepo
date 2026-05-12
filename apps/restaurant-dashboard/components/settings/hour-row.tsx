import { Trash2 } from 'lucide-react';

interface Hour {
  day: string;
  hours: string;
  isToday?: boolean;
}

interface HourRowProps {
  hour: Hour;
  isEditing: boolean;
  onUpdateDay: (value: string) => void;
  onUpdateHours: (value: string) => void;
  onToggleToday: () => void;
  onRemoveDay: () => void;
}

export function HourRow({
  hour,
  isEditing,
  onUpdateDay,
  onUpdateHours,
  onToggleToday,
  onRemoveDay,
}: HourRowProps) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl px-4 py-3 ${
        hour.isToday ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50'
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        {isEditing ? (
          <>
            <input value={hour.day} onChange={(e) => onUpdateDay(e.target.value)} className="elegant-input w-32 text-sm" />
            <input value={hour.hours} onChange={(e) => onUpdateHours(e.target.value)} className="elegant-input w-32 text-sm" />
            <button onClick={onToggleToday} className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${hour.isToday ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
              TODAY
            </button>
            <button onClick={onRemoveDay} className="text-red-400 hover:text-red-600">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <>
            <span className={`text-sm font-semibold ${hour.isToday ? 'text-amber-800' : 'text-slate-700'}`}>
              {hour.day}
            </span>
            {hour.isToday && (
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                TODAY
              </span>
            )}
          </>
        )}
      </div>
      {!isEditing && (
        <span className={`text-sm font-medium ${hour.isToday ? 'text-amber-700' : 'text-slate-600'}`}>
          {hour.hours}
        </span>
      )}
    </div>
  );
}
