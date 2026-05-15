interface RestaurantStatusBadgeProps {
  status: string;
}

export function RestaurantStatusBadge({ status }: RestaurantStatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
        status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}
