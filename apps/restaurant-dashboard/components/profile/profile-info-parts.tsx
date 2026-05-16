import type { LucideIcon } from "lucide-react";

export function ProfileRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3">
      <Icon className="mt-0.5 h-4 w-4 text-slate-400 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-700">{value}</p>
      </div>
    </div>
  );
}

export function EditField({ label, value, onChange, icon: Icon, full }: { label: string; value: string; onChange: (v: string) => void; icon: LucideIcon; full?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${full ? "sm:col-span-2" : ""}`}>
      <Icon className="h-4 w-4 text-slate-400 shrink-0" />
      <div className="flex-1">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</label>
        <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-amber-500 focus:outline-none" />
      </div>
    </div>
  );
}
