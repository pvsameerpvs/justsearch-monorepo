"use client";

import { X, Users } from "lucide-react";
import { useDeliveryBoyPicker } from "./use-delivery-boy-picker";
import { DeliveryBoyPickerContent } from "./delivery-boy-picker-content";

interface DeliveryBoyPickerProps {
  orderId: string;
  onClose: () => void;
}

export function DeliveryBoyPicker({ orderId, onClose }: DeliveryBoyPickerProps) {
  const { order, rows, freeCount, busyCount } = useDeliveryBoyPicker(orderId, onClose);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Assign Delivery Boy</h3>
              <p className="text-xs text-slate-500">Order {order?.code} — AED {order?.total}</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <DeliveryBoyPickerContent rows={rows} freeCount={freeCount} busyCount={busyCount} />
      </div>
    </div>
  );
}
