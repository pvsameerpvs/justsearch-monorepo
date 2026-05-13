import { X } from "lucide-react";
import { OrderStatusBadge } from "./order-status-config";
import { formatDateTime } from "./time-utils";

interface OrderDetailHeaderProps {
  code: string;
  status: string;
  createdAt: string;
  onClose: () => void;
}

export function OrderDetailHeader({ code, status, createdAt, onClose }: OrderDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between p-5 border-b border-slate-100">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-slate-900">{code}</span>
          <OrderStatusBadge status={status} />
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{formatDateTime(createdAt)}</p>
      </div>
      <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
