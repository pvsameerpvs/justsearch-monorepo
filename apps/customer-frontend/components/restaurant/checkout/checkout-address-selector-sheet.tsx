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
    <div className="fixed inset-0 z-[10002] bg-black/40 backdrop-blur-[2px]">
      <button type="button" aria-label="Close address selector" className="absolute inset-0 h-full w-full cursor-default" onClick={onClose} />

      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl">
        <div className="relative rounded-t-[28px] bg-white shadow-[0_-18px_56px_rgba(15,23,42,0.18)]">
          <button type="button" onClick={onClose} aria-label="Close" className="absolute left-4 top-0 -translate-y-[calc(100%+12px)] inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-[rgb(var(--ink))] shadow-[0_8px_24px_rgba(15,23,42,0.18)]">
            <X className="h-5 w-5" />
          </button>

          <div className="px-5 pb-[calc(env(safe-area-inset-bottom,0px)+20px)] pt-5 sm:px-6">
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
