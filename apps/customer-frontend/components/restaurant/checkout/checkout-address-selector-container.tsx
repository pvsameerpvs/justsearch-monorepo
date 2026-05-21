"use client";

import { CheckoutAddressSelectorSheet } from './checkout-address-selector-sheet';
import { geocodeAddress } from './use-address-geocode';
import type { SavedAddress } from '../use-address-book';

interface CheckoutAddressSelectorContainerProps {
  state: {
    addresses: SavedAddress[];
    selectedAddressId: string | null;
    isAddressBookOpen: boolean;
    setIsAddressBookOpen: (v: boolean) => void;
    addAddress: (address: Omit<SavedAddress, 'id'>) => Promise<SavedAddress>;
    editAddress: (id: string, updates: Omit<SavedAddress, 'id'>) => Promise<SavedAddress>;
    applySavedAddress: (addr: SavedAddress) => void;
    applyCurrentLocationAddress: (addr: string) => void;
    applyPinnedLocation: (addr: string, lat: number, lng: number) => void;
    coords: { setLatLng: (lat: number, lng: number) => void };
  };
}

export function CheckoutAddressSelectorContainer({ state }: CheckoutAddressSelectorContainerProps) {
  return (
    <CheckoutAddressSelectorSheet
      open={state.isAddressBookOpen}
      addresses={state.addresses}
      selectedAddressId={state.selectedAddressId ?? undefined}
      onClose={() => state.setIsAddressBookOpen(false)}
      onSelectAddress={(addr) => {
        state.applySavedAddress(addr);
        state.setIsAddressBookOpen(false);
      }}
      onAddAddress={async (newAddress) => {
        try {
          state.applySavedAddress(await state.addAddress(newAddress));
        } catch {
          // Inline error handled by form.
        }
      }}
      onEditAddress={async (id, updates) => {
        try {
          await state.editAddress(id, updates);
        } catch {
          // Inline error handled by form.
        }
      }}
      onUseCurrentLocation={async (resolvedAddress) => {
        state.applyCurrentLocationAddress(resolvedAddress);
        const result = await geocodeAddress(resolvedAddress);
        if (result) state.coords.setLatLng(result.lat, result.lng);
      }}
      onUsePinnedLocation={(address, lat, lng) => {
        state.applyPinnedLocation(address, lat, lng);
        state.coords.setLatLng(lat, lng);
        state.setIsAddressBookOpen(false);
      }}
    />
  );
}
