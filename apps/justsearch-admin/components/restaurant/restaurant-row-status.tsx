interface RestaurantRowStatusProps {
  status: string;
}

export function RestaurantRowStatus({ status }: RestaurantRowStatusProps) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
        status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}
