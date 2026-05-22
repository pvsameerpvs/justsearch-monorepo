import type { DeliveryBoy } from "@/lib/stores/delivery-boy-store";

export interface AgentStatusStyle {
  label: string;
  dot: string;
  bg: string;
  text: string;
  btn: string;
  canAssign: boolean;
}

export function getAgentStatus(agent: DeliveryBoy): AgentStatusStyle {
  const count = agent.activeOrderCount ?? 0;

  if (agent.status === "offline") {
    return {
      label: "Offline",
      dot: "bg-slate-400",
      bg: "bg-slate-100",
      text: "text-slate-600",
      btn: "bg-slate-200 text-slate-400 cursor-not-allowed",
      canAssign: false,
    };
  }

  if (agent.status === "busy" || count > 0) {
    return {
      label: `Busy (${count})`,
      dot: "bg-amber-500",
      bg: "bg-amber-50",
      text: "text-amber-700",
      btn: "bg-amber-500 text-white hover:bg-amber-600",
      canAssign: true,
    };
  }

  return {
    label: "Free",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    btn: "bg-emerald-500 text-white hover:bg-emerald-600",
    canAssign: true,
  };
}
