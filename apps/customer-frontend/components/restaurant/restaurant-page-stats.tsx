export type RestaurantPageStat = {
  label: string;
  value: string;
};

type RestaurantPageStatsProps = {
  stats: readonly RestaurantPageStat[];
};

export function RestaurantPageStats({ stats }: RestaurantPageStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-[24px] border border-[rgb(var(--card-border)/0.86)] bg-[rgb(var(--card-surface)/0.84)] p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)]"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
            {stat.label}
          </p>
          <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.05em] text-[rgb(var(--ink))]">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
