"use client";

import { Truck, Loader2 } from "lucide-react";

interface SettingsDeliveryCardHeaderProps {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export function SettingsDeliveryCardHeader({ isEditing, isSaving, onEdit, onCancel, onSave }: SettingsDeliveryCardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
          <Truck className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Delivery Settings</h3>
          <p className="text-[11px] text-slate-500">Configure radius, pricing tiers & location</p>
        </div>
      </div>
      {isEditing ? (
        <div className="flex items-center gap-2">
          <button onClick={onCancel} disabled={isSaving} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onSave} disabled={isSaving} className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 disabled:opacity-60">
            {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />} {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      ) : (
        <button onClick={onEdit} className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors">
          Edit
        </button>
      )}
    </div>
  );
}
