"use client";

type ProfileAddressFormActionsProps = {
  onCancel: () => void;
  onSave: () => void;
};

export function ProfileAddressFormActions({ onCancel, onSave }: ProfileAddressFormActionsProps) {
  return (
    <div className="flex gap-2 pt-2">
      <button type="button" onClick={onCancel} className="flex-1 py-4 text-sm font-bold text-slate-400 hover:text-[rgb(var(--ink))] transition-colors">
        Cancel
      </button>
      <button type="button" onClick={onSave} className="flex-[2] py-4 rounded-2xl bg-[rgb(var(--brand))] text-white text-sm font-bold shadow-lg shadow-[rgb(var(--brand)/0.2)] transition-transform active:scale-95">
        Save Address
      </button>
    </div>
  );
}
