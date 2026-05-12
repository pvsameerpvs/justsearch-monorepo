interface TopPerformingRestaurantPanelProps {
  topRestaurant: string;
  topRestaurantRevenue: number;
  totalRevenue: number;
}

export function TopPerformingRestaurantPanel({
  topRestaurant,
  topRestaurantRevenue,
  totalRevenue,
}: TopPerformingRestaurantPanelProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-bold text-slate-900">Top Performing Restaurant</h3>
      <div className="mt-4 rounded-xl bg-slate-50 p-4">
        <p className="font-bold text-slate-900">{topRestaurant}</p>
        <p className="text-sm text-slate-500">
          AED {topRestaurantRevenue.toLocaleString()} revenue
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-amber-500"
            style={{ width: `${(topRestaurantRevenue / totalRevenue) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
