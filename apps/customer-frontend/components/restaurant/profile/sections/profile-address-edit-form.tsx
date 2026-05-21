"use client";

import { useState } from "react";
import { Surface } from "@/components/shared/surface";
import { type SavedAddress } from "../../use-address-book";
import { ProfileAddressFormFields } from "./profile-address-form-fields";

interface ProfileAddressEditFormProps {
  address: SavedAddress;
  onSave: (updated: Omit<SavedAddress, "id">) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export function ProfileAddressEditForm({ address, onSave, onCancel, isSaving }: ProfileAddressEditFormProps) {
  const [value, setValue] = useState<Omit<SavedAddress, "id">>({
    label: address.label,
    address: address.address,
    details: address.details,
    alternateNumber: address.alternateNumber || "",
  });

  const handleSave = () => {
    if (!value.address) return;
    onSave(value);
  };

  return (
    <Surface className="rounded-[28px] border-[rgb(var(--brand)/0.2)] bg-white p-6 shadow-xl ring-2 ring-[rgb(var(--brand)/0.1)]">
      <div className="space-y-4">
        <p className="text-sm font-bold text-[rgb(var(--ink))]">Edit Address</p>
        <ProfileAddressFormFields
          value={value}
          onChange={setValue}
          isLocating={false}
          onGetCurrentLocation={() => {}}
        />
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !value.address}
            className="flex-1 rounded-xl bg-[rgb(var(--brand))] py-3 text-sm font-bold text-white transition-colors hover:bg-[rgb(var(--brand)/0.9)] disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </Surface>
  );
}
