interface ContactRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
  isEditing: boolean;
  onChange?: (val: string) => void;
}

export function ContactRow({ icon: Icon, label, value, isEditing, onChange }: ContactRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3">
      <Icon className="mt-0.5 h-4 w-4 text-slate-400" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        {isEditing ? (
          <input value={value} onChange={(e) => onChange?.(e.target.value)} className="elegant-input w-full mt-1" />
        ) : (
          <p className="text-sm font-medium text-slate-700 truncate">{value || '—'}</p>
        )}
      </div>
    </div>
  );
}
