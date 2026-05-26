"use client";

import { useState } from "react";
import { X, AlertCircle, AlertTriangle } from "lucide-react";
import { CancelReasonList } from "./cancel-reason-list";
import { CancelReasonFooter } from "./cancel-reason-footer";

interface CancelReasonPickerProps {
  orderCode: string;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

export function CancelReasonPicker({ orderCode, onConfirm, onClose }: CancelReasonPickerProps) {
  const [selected, setSelected] = useState<string>("Item not available today");
  const [custom, setCustom] = useState('');

  const isCustom = selected === 'custom';
  const finalReason = isCustom ? custom.trim() : selected;
  const canConfirm = finalReason.length > 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <h3 className="text-base font-bold text-slate-900">Cancel Order</h3>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-500">Order {orderCode}</p>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-800">This action cannot be undone</p>
            <p className="text-xs text-amber-700 mt-0.5">The customer will be notified immediately. Please provide a clear reason.</p>
          </div>
        </div>

        <CancelReasonList
          selected={selected}
          custom={custom}
          onSelect={setSelected}
          onCustomChange={setCustom}
        />

        <CancelReasonFooter
          canConfirm={canConfirm}
          onClose={onClose}
          onConfirm={() => onConfirm(finalReason)}
        />
      </div>
    </div>
  );
}
