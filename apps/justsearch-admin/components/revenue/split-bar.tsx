interface SplitBarProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

export function SplitBar({ label, value, total, color }: SplitBarProps) {
  const percent = Math.round((value / total) * 100);
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-slate-700">{label}</span>
        <span className="font-bold text-slate-900">AED {value.toLocaleString()}</span>
      </div>
      <div className="mt-1 h-3 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
