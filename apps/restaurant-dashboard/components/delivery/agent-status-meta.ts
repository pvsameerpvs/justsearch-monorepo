type AgentStatus = "available" | "busy" | "offline";

export const STATUS_META: Record<AgentStatus, { label: string; dot: string; bg: string; text: string; border: string }> = {
  available: { label: "Available", dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  busy:      { label: "On Delivery", dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  offline:   { label: "Offline", dot: "bg-slate-400", bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" },
};
