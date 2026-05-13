export function SectionCard({ icon: Icon, title, accent, children }: { icon: React.ElementType; title: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50">
          <Icon className="h-4 w-4" style={{ color: accent }} />
        </div>
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        <div className="ml-auto h-px flex-1 bg-slate-100" />
      </div>
      {children}
    </div>
  );
}

export function FormField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="elegant-input w-full mt-1" />
    </div>
  );
}
