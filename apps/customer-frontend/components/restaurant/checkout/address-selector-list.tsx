"use client";
import { Plus } from "lucide-react";
import type { SavedAddress } from "../use-address-book";
import { CheckoutAddressSelectorItem } from "./checkout-address-selector-item";
import { AddressSelectorHeader } from "./address-selector-header";

interface AddressSelectorListProps {
  addresses: SavedAddress[];
  selectedAddressId?: string;
  isLocating: boolean;
  onSelectAddress: (address: SavedAddress) => void;
  onEditAddress: (address: SavedAddress) => void;
  onUseCurrentLocation: () => void;
  onOpenMapChooser: () => void;
  onAddAddress: () => void;
  onClose: () => void;
}

export function AddressSelectorList({
  addresses,
  selectedAddressId,
  isLocating,
  onSelectAddress,
  onEditAddress,
  onUseCurrentLocation,
  onOpenMapChooser,
  onAddAddress,
  onClose,
}: AddressSelectorListProps) {
  return (
    <>
      <AddressSelectorHeader
        isLocating={isLocating}
        onUseCurrentLocation={onUseCurrentLocation}
        onOpenMapChooser={onOpenMapChooser}
      />

      <div className="max-h-[52vh] space-y-3 overflow-y-auto pb-4">
        {addresses.map((address) => (
          <CheckoutAddressSelectorItem
            key={address.id}
            address={address}
            isSelected={address.id === selectedAddressId}
            onSelect={(selected) => { onSelectAddress(selected); onClose(); }}
            onEdit={onEditAddress}
          />
        ))}
      </div>

      <div className="border-t border-[rgb(var(--border)/0.7)] pt-4">
        <button
          type="button"
          onClick={onAddAddress}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[rgb(var(--brand))] px-5 py-4 text-base font-semibold text-white shadow-[0_10px_24px_rgba(15,118,110,0.22)] transition-transform active:scale-[0.99]"
        >
          <Plus className="h-4 w-4" />
          Add delivery address
        </button>
      </div>
    </>
  );
}
