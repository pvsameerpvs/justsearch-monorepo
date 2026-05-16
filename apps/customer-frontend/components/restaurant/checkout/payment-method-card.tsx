"use client";

import type { LucideIcon } from 'lucide-react';

export type PaymentMethodCardProps = {
  id: string; label: string; icon: LucideIcon; isSelected: boolean; onSelect: () => void;
};

export function PaymentMethodCard({
  id, label, icon: Icon, isSelected, onSelect,
}: PaymentMethodCardProps) {
  return (
    <button
      key={id}
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
        isSelected ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
          isSelected ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <span className="flex-1 font-semibold text-slate-900">{label}</span>
      {isSelected && (
        <div className="h-5 w-5 rounded-full border-4 border-amber-500 bg-white" />
      )}
    </button>
  );
}
