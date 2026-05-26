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
    <div className="flex items-center justify-between p-5 border-b border-slate-100/80 bg-white">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg font-black text-slate-900 tracking-tight">{code}</span>
          <OrderStatusBadge status={status} />
        </div>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">{formatDateTime(createdAt)}</p>
      </div>
      <button
        onClick={onClose}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all border border-slate-100/60"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
