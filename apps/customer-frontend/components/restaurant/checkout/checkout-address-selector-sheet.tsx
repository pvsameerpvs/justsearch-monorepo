"use client";

import type { SavedAddress } from '../use-address-book';
import { useAddressSelector } from './use-address-selector';
import { CheckoutAddressSelectorHeader } from './checkout-address-selector-header';
import { CheckoutAddressSelectorList } from './checkout-address-selector-list';

interface CheckoutAddressSelectorSheetProps {
  open: boolean;
  addresses: SavedAddress[];
  selectedAddressId?: string;
  onClose: () => void;
  onSelectAddress: (address: SavedAddress) => void;
  onAddAddress: (address: Omit<SavedAddress, 'id'>) => Promise<void>;
  onUseCurrentLocation: (address: string) => void;
}

export function CheckoutAddressSelectorSheet({
  open, addresses, selectedAddressId, onClose, onSelectAddress, onAddAddress, onUseCurrentLocation,
}: CheckoutAddressSelectorSheetProps) {
  const { mode, mapSelection, setMapSelection, currentLocationAddress, currentLocationCoords, isLocating, handleUseCurrentLocation, handleOpenMapChooser, handleSaveAddress, handlePrimaryMapAction, handlePinnedLocationChange, goToAdd, cancelAdd } = useAddressSelector(open, addresses, selectedAddressId, onClose, onSelectAddress, onAddAddress, onUseCurrentLocation);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <button type="button" aria-label="Close address selector" className="absolute inset-0 h-full w-full cursor-default" onClick={onClose} />
      <div className="relative z-10 mx-4 w-full max-w-3xl">
        <div className="relative max-h-[85vh] overflow-hidden rounded-[28px] bg-white shadow-[0_18px_56px_rgba(15,23,42,0.18)]">
          <CheckoutAddressSelectorHeader onClose={onClose} />
          <div className="max-h-[85vh] overflow-y-auto px-5 pb-[calc(env(safe-area-inset-bottom,0px)+20px)] pt-5 sm:px-6">
            <CheckoutAddressSelectorList
              mode={mode} addresses={addresses} selectedAddressId={selectedAddressId}
              mapSelection={mapSelection} currentLocationAddress={currentLocationAddress}
              currentLocationCoords={currentLocationCoords} isLocating={isLocating}
              onSelectAddress={onSelectAddress} onClose={onClose} onSaveAddress={handleSaveAddress}
              onCancelAdd={cancelAdd} onSetMapSelection={setMapSelection}
              onUsePinnedForOrder={() => { onUseCurrentLocation(currentLocationAddress!); onClose(); }}
              onPinnedLocationChange={handlePinnedLocationChange} onPrimaryMapAction={handlePrimaryMapAction}
              onUseCurrentLocation={handleUseCurrentLocation} onOpenMapChooser={handleOpenMapChooser}
              onAddAddress={goToAdd}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
