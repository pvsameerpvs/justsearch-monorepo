import { AlertTriangle, Ban } from "lucide-react";

type OrderCancelReasonCardProps = {
  reason?: string;
};

export function OrderCancelReasonCard({ reason }: OrderCancelReasonCardProps) {
  const display = reason?.trim() || "No reason provided.";
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100">
          <Ban className="h-4 w-4 text-red-600" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-red-500">Order Cancelled</p>
          <p className="mt-1 text-sm font-semibold text-red-700">{display}</p>
        </div>
        <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
      </div>
    </div>
  );
}
