interface StatCardProps {
  label: string;
  value: string;
  color: "amber" | "blue" | "emerald" | "purple";
}

export function DemoStatCard({ label, value, color }: StatCardProps) {
  const colors = {
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    purple: "bg-purple-50 text-purple-700",
  };
  return (
    <div className={"elegant-card p-3 " + colors[color]}>
      <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{label}</p>
      <p className="text-lg font-bold mt-0.5">{value}</p>
    </div>
  );
}
