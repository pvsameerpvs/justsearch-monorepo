import { AlertCircle } from "lucide-react";
import { DeliveryBoyRow } from "./delivery-boy-row";
import type { DeliveryBoy } from "@/lib/stores/delivery-boy-store";

interface RowData {
  agent: DeliveryBoy;
  assignedOrderCode: string | null;
  isRecommended: boolean;
  isCurrentlyAssigned: boolean;
  onAssign: () => void;
}

interface ContentProps {
  rows: RowData[];
  freeCount: number;
  busyCount: number;
}

export function DeliveryBoyPickerContent({ rows, freeCount, busyCount }: ContentProps) {
  return (
    <div className="p-5 overflow-y-auto space-y-3">
      {freeCount === 0 && busyCount > 0 && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>No free drivers available. Busy drivers are still assignable.</span>
        </div>
      )}
      {freeCount === 0 && busyCount === 0 && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>All drivers are currently offline.</span>
        </div>
      )}

      {rows.map((row) => (
        <DeliveryBoyRow
          key={row.agent.id}
          agent={row.agent}
          assignedOrderCode={row.assignedOrderCode}
          isRecommended={row.isRecommended}
          isCurrentlyAssigned={row.isCurrentlyAssigned}
          onAssign={row.onAssign}
        />
      ))}
    </div>
  );
}
