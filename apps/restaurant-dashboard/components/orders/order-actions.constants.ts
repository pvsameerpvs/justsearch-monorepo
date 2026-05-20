export const KITCHEN_NEXT_STATUS: Record<string, string> = {
  confirmed: "preparing",
  preparing: "ready",
};

export const ACTION_META: Record<string, { label: string; color: string; hover: string }> = {
  pending:     { label: "Accept Order",            color: "bg-emerald-500",      hover: "hover:bg-emerald-600" },
  confirmed:   { label: "Start Preparing",         color: "bg-amber-500",       hover: "hover:bg-amber-600" },
  preparing:   { label: "Mark Ready for Delivery", color: "bg-violet-500",      hover: "hover:bg-violet-600" },
  ready:       { label: "Mark Completed",          color: "bg-emerald-500",      hover: "hover:bg-emerald-600" },
  out_for_delivery: { label: "Mark Completed",     color: "bg-emerald-500",      hover: "hover:bg-emerald-600" },
};

export function getNextStatus(status: string, type: string, isKitchen: boolean): string | null {
  if (isKitchen) return KITCHEN_NEXT_STATUS[status] ?? null;
  if (status === "pending") return "confirmed";
  if (status === "confirmed") return "preparing";
  if (status === "preparing") return "ready";
  if (status === "ready" && type !== "delivery") return "completed";
  if (status === "out_for_delivery") return "completed";
  return null;
}
