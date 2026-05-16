"use client";

import type { SavedAddress } from '../use-address-book';
import type { GeolocationCoordinates } from '../use-geolocation';
import { CheckoutAddAddressForm } from './checkout-add-address-form';
import { CheckoutMapAddressPicker } from './checkout-map-address-picker';
import { AddressSelectorEmpty } from './address-selector-empty';
import { AddressSelectorList } from './address-selector-list';

export function CheckoutAddressSelectorList({
  mode, addresses, selectedAddressId, mapSelection, currentLocationAddress,
  currentLocationCoords, isLocating, onSelectAddress, onClose, onSaveAddress,
  onCancelAdd, onSetMapSelection, onUsePinnedForOrder, onPinnedLocationChange,
  onPrimaryMapAction, onUseCurrentLocation, onOpenMapChooser, onAddAddress,
}: {
  mode: string; addresses: SavedAddress[]; selectedAddressId?: string;
  mapSelection: { type: 'pinned' } | { type: 'saved'; id: string };
  currentLocationAddress: string | null; currentLocationCoords: GeolocationCoordinates | null;
  isLocating: boolean; onSelectAddress: (a: SavedAddress) => void; onClose: () => void;
  onSaveAddress: (a: Omit<SavedAddress, 'id'>) => void; onCancelAdd: () => void;
  onSetMapSelection: (s: { type: 'pinned' } | { type: 'saved'; id: string }) => void;
  onUsePinnedForOrder: () => void; onPinnedLocationChange: (address: string, coords: GeolocationCoordinates | null) => void;
  onPrimaryMapAction: () => void; onUseCurrentLocation: () => void; onOpenMapChooser: () => void; onAddAddress: () => void;
}) {
  if (mode === 'add') return <CheckoutAddAddressForm initialAddress={currentLocationAddress ?? undefined} onSave={onSaveAddress} onCancel={onCancelAdd} />;
  if (mode === 'map' && currentLocationAddress) return <CheckoutMapAddressPicker pinnedAddress={currentLocationAddress} pinnedCoords={currentLocationCoords} addresses={addresses} selection={mapSelection} isLocating={isLocating} onLocateMe={onUseCurrentLocation} onSelectPinned={() => onSetMapSelection({ type: 'pinned' })} onSelectSaved={(id) => onSetMapSelection({ type: 'saved', id })} onUsePinnedForOrder={onUsePinnedForOrder} onPinnedLocationChange={onPinnedLocationChange} onPrimaryAction={onPrimaryMapAction} primaryActionLabel={mapSelection.type === 'saved' ? 'Deliver to selected address' : 'Add address details'} />;
  if (addresses.length === 0) return <AddressSelectorEmpty onUseCurrentLocation={onUseCurrentLocation} onAddAddress={onAddAddress} />;
  return <AddressSelectorList addresses={addresses} selectedAddressId={selectedAddressId} isLocating={isLocating} onSelectAddress={onSelectAddress} onUseCurrentLocation={onUseCurrentLocation} onOpenMapChooser={onOpenMapChooser} onAddAddress={onAddAddress} onClose={onClose} />;
}
