import { useState } from "react";
import { Gift, X } from "lucide-react";
import { useUpdateScratchCampaignMutation } from "./hooks/use-scratch-campaigns";

interface Props { code: string; onDismiss: () => void; }

type Trigger = "none" | "welcome" | "order" | "order_threshold";

const TRIGGER_OPTIONS = [
  { value: "none" as Trigger, label: "— Don't assign" },
  { value: "welcome" as Trigger, label: "Welcome Offer (scratch card on first visit)" },
  { value: "order" as Trigger, label: "Post-Order Offer (scratch card after first order)" },
  { value: "order_threshold" as Trigger, label: "High-Value Auto-Reward (auto-add for big orders)" },
];

export function VoucherAssignBanner({ code, onDismiss }: Props) {
  const update = useUpdateScratchCampaignMutation();
  const [assigning, setAssigning] = useState(false);
  const [trigger, setTrigger] = useState<Trigger>("none");
  const [minAmount, setMinAmount] = useState(50);

  const handleAssign = () => {
    if (trigger === "none") { onDismiss(); return; }
    setAssigning(true);
    const isThreshold = trigger === "order_threshold";
    update.mutate({
      trigger,
      data: {
        isEnabled: true,
        voucherCode: code,
        behavior: isThreshold ? "auto_add" : "scratch_card",
        ...(isThreshold ? { config: { minAmount } } : {}),
      },
    }, { onSettled: () => { setAssigning(false); onDismiss(); } });
  };

  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-indigo-900">Voucher "<span className="font-mono">{code}</span>" created!</p>
            <p className="text-xs text-indigo-600 mt-0.5">Assign it to a reward trigger, or skip to do it later from the Reward Rules section.</p>
          </div>
        </div>
        <button onClick={onDismiss} className="shrink-0 text-indigo-400 hover:text-indigo-600"><X className="h-4 w-4" /></button>
      </div>

      <div className="mt-3 space-y-3">
        <select value={trigger} onChange={(e) => setTrigger(e.target.value as Trigger)}
          className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
          {TRIGGER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {trigger === "order_threshold" && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-600 whitespace-nowrap">Min Order Total (AED)</label>
            <input type="number" value={minAmount} onChange={(e) => setMinAmount(Math.max(0, Number(e.target.value)))}
              className="w-24 rounded border border-slate-200 bg-white px-2 py-1.5 text-sm font-bold" min="0" />
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={handleAssign} disabled={assigning}
            className="flex-1 rounded-lg bg-indigo-600 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
            {assigning ? "Assigning..." : trigger === "none" ? "Skip" : `Assign to ${TRIGGER_OPTIONS.find((o) => o.value === trigger)?.label.split(" (")[0]}`}
          </button>
          <button onClick={onDismiss} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">Skip</button>
        </div>
      </div>
    </div>
  );
}
