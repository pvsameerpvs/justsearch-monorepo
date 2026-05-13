interface FormFieldProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, icon: Icon, error, children }: FormFieldProps) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={`h-3.5 w-3.5 ${error ? "text-red-400" : "text-slate-400"}`} />
        <span className={`text-[10px] font-bold uppercase tracking-wider ${error ? "text-red-500" : "text-slate-400"}`}>
          {label}
        </span>
      </div>
      {children}
      {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
    </div>
  );
}
