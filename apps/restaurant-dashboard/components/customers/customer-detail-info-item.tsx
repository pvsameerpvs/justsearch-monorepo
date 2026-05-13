interface InfoItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

export function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3 w-3 text-slate-400" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
      </div>
      <p className="text-xs font-bold text-slate-900">{value}</p>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

export function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className="rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-2 text-center">
      <Icon className="h-4 w-4 text-indigo-400 mx-auto mb-1" />
      <p className="text-sm font-bold text-indigo-900">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">{label}</p>
    </div>
  );
}
