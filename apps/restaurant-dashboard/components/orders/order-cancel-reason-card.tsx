import { AlertTriangle } from "lucide-react";

type OrderCancelReasonCardProps = {
  reason?: string;
};

export function OrderCancelReasonCard({ reason }: OrderCancelReasonCardProps) {
  const display = reason?.trim() || "No reason provided.";
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-3">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-red-500">Cancellation reason</p>
          <p className="mt-0.5 text-sm font-semibold text-red-700">{display}</p>
        </div>
      </div>
    </div>
  );
}
