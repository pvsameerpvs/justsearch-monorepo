export function AgentChecklist({ items }: { items: string[] }) {
  return (
    <div className="rounded-3xl border border-orange-100 bg-orange-50/80 p-4">
      <p className="text-sm font-semibold text-slate-900">Route checklist</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm text-slate-600">
            <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
