"use client";

import { X } from 'lucide-react';
import type { SavedAddress } from '../use-address-book';
import { CheckoutAddAddressForm } from './checkout-add-address-form';
import { CheckoutMapAddressPicker } from './checkout-map-address-picker';
import { AddressSelectorEmpty } from './address-selector-empty';
import { AddressSelectorList } from './address-selector-list';
import { useAddressSelector } from './use-address-selector';

interface CheckoutAddressSelectorSheetProps {
  open: boolean;
  addresses: SavedAddress[];
  selectedAddressId?: string;
  onClose: () => void;
  onSelectAddress: (address: SavedAddress) => void;
  onAddAddress: (address: Omit<SavedAddress, 'id'>) => void;
  onUseCurrentLocation: (address: string) => void;
}

export function CheckoutAddressSelectorSheet({
  open,
  addresses,
  selectedAddressId,
  onClose,
  onSelectAddress,
  onAddAddress,
  onUseCurrentLocation,
}: CheckoutAddressSelectorSheetProps) {
  const {
    mode,
    mapSelection,
    setMapSelection,
    currentLocationAddress,
    currentLocationCoords,
    isLocating,
    handleUseCurrentLocation,
    handleOpenMapChooser,
    handleSaveAddress,
    handlePrimaryMapAction,
    handlePinnedLocationChange,
    goToAdd,
    cancelAdd,
  } = useAddressSelector(open, addresses, selectedAddressId, onClose, onSelectAddress, onAddAddress, onUseCurrentLocation);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <button type="button" aria-label="Close address selector" className="absolute inset-0 h-full w-full cursor-default" onClick={onClose} />

      <div className="relative z-10 mx-4 w-full max-w-3xl">
        <div className="relative max-h-[85vh] overflow-hidden rounded-[28px] bg-white shadow-[0_18px_56px_rgba(15,23,42,0.18)]">
          <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-[rgb(var(--ink))]">
            <X className="h-5 w-5" />
          </button>

          <div className="max-h-[85vh] overflow-y-auto px-5 pb-[calc(env(safe-area-inset-bottom,0px)+20px)] pt-5 sm:px-6">
            {mode === 'add' ? (
              <CheckoutAddAddressForm
                initialAddress={currentLocationAddress ?? undefined}
                onSave={handleSaveAddress}
                onCancel={cancelAdd}
              />
            ) : mode === 'map' && currentLocationAddress ? (
              <CheckoutMapAddressPicker
                pinnedAddress={currentLocationAddress}
                pinnedCoords={currentLocationCoords}
                addresses={addresses}
                selection={mapSelection}
                isLocating={isLocating}
                onLocateMe={handleUseCurrentLocation}
                onSelectPinned={() => setMapSelection({ type: 'pinned' })}
                onSelectSaved={(id) => setMapSelection({ type: 'saved', id })}
                onUsePinnedForOrder={() => { onUseCurrentLocation(currentLocationAddress); onClose(); }}
                onPinnedLocationChange={handlePinnedLocationChange}
                onPrimaryAction={handlePrimaryMapAction}
                primaryActionLabel={mapSelection.type === 'saved' ? 'Deliver to selected address' : 'Add address details'}
              />
            ) : addresses.length === 0 ? (
              <AddressSelectorEmpty onUseCurrentLocation={handleUseCurrentLocation} onAddAddress={goToAdd} />
            ) : (
              <AddressSelectorList
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                isLocating={isLocating}
                onSelectAddress={onSelectAddress}
                onUseCurrentLocation={handleUseCurrentLocation}
                onOpenMapChooser={handleOpenMapChooser}
                onAddAddress={goToAdd}
                onClose={onClose}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
