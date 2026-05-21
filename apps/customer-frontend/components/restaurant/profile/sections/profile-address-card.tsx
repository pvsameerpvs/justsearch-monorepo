"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { Surface } from "@/components/shared/surface";
import { type SavedAddress } from "../../use-address-book";
import { ProfileAddressDeleteDialog } from "./profile-address-delete-dialog";
import { ProfileAddressEditForm } from "./profile-address-edit-form";
import { AddressLabelIcon } from "./address-label-icon";
import { ProfileAddressCardActions } from "./profile-address-card-actions";

type ProfileAddressCardProps = {
  address: SavedAddress;
  onRemove: (id: string) => void;
  onEdit: (id: string, updated: Omit<SavedAddress, "id">) => void;
  isEditing?: boolean;
  isRemoving?: boolean;
};

export function ProfileAddressCard({ address, onRemove, onEdit, isEditing, isRemoving }: ProfileAddressCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  if (isEditMode) {
    return (
      <ProfileAddressEditForm
        address={address}
        onSave={(updated) => {
          onEdit(address.id, updated);
          setIsEditMode(false);
        }}
        onCancel={() => setIsEditMode(false)}
        isSaving={isEditing}
      />
    );
  }

  return (
    <>
      <Surface className="group relative flex flex-col justify-between rounded-[28px] border-white/60 bg-white/80 p-6 shadow-sm transition-all hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgb(var(--brand-soft)/0.45)] text-[rgb(var(--brand))]">
              <AddressLabelIcon label={address.label} />
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {address.label}
            </span>
          </div>
          <p className="text-sm font-semibold leading-relaxed text-[rgb(var(--ink))]">{address.address}</p>
          <p className="mt-2 text-xs font-medium text-[rgb(var(--muted))]">{address.details}</p>
          {address.alternateNumber && (
            <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[rgb(var(--brand))]">
              <Phone className="h-3 w-3" />
              Alt: {address.alternateNumber}
            </p>
          )}
        </div>

        <ProfileAddressCardActions
          onEdit={() => setIsEditMode(true)}
          onDelete={() => setShowDeleteDialog(true)}
        />
      </Surface>

      {showDeleteDialog && (
        <ProfileAddressDeleteDialog
          label={address.label}
          address={address.address}
          onConfirm={() => {
            onRemove(address.id);
            setShowDeleteDialog(false);
          }}
          onCancel={() => setShowDeleteDialog(false)}
          isRemoving={isRemoving}
        />
      )}
    </>
  );
}
