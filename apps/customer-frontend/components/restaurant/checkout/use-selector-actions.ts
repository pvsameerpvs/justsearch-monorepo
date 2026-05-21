"use client";

import type { SavedAddress } from '../use-address-book';
import type { UseSelectorModeReturn } from './use-selector-mode';
import type { UseSelectorLocationReturn } from './use-selector-location';

export function useSelectorActions(
  addresses: SavedAddress[],
  selectedAddressId: string | undefined,
  onClose: () => void,
  onSelectAddress: (address: SavedAddress) => void,
  onAddAddress: (address: Omit<SavedAddress, 'id'>) => Promise<void>,
  onEditAddress: (id: string, address: Omit<SavedAddress, 'id'>) => Promise<void>,
  mode: UseSelectorModeReturn,
  loc: UseSelectorLocationReturn,
) {
  const getFallback = () => {
    const selected = addresses.find((a) => a.id === selectedAddressId) ?? addresses[0];
    return selected?.address ?? 'Pinned delivery location';
  };
  const handleUseCurrentLocation = async () => {
    await loc.handleUseCurrentLocation(getFallback);
    mode.goToMap();
    mode.setMapSelection({ type: 'pinned' });
  };
  const handleOpenMapChooser = () => {
    loc.openMapMode({ address: loc.currentLocationAddress ?? getFallback(), coords: loc.currentLocationCoords ?? null });
    mode.goToMap();
    mode.setMapSelection({ type: 'pinned' });
  };
  const handleSaveAddress = async (address: Omit<SavedAddress, 'id'>) => {
    await onAddAddress(address);
    mode.goToList();
    loc.reset();
    onClose();
  };
  const handleEditSave = async (address: Omit<SavedAddress, 'id'>) => {
    if (!mode.editingAddress) return;
    await onEditAddress(mode.editingAddress.id, address);
    mode.goToList();
    mode.setEditingAddress(null);
  };
  const handlePrimaryMapAction = () => {
    const sel = mode.mapSelection;
    if (sel.type === 'saved') {
      const selected = addresses.find((a) => a.id === sel.id);
      if (selected) { onSelectAddress(selected); onClose(); }
      return;
    }
    mode.goToAdd();
  };
  const handlePinnedLocationChange = (address: string, coords: { latitude: number; longitude: number } | null) => {
    loc.openMapMode({ address, coords });
    mode.setMapSelection({ type: 'pinned' });
  };
  const cancelAdd = () => {
    mode.setMode(loc.currentLocationAddress ? 'map' : 'list');
    mode.setEditingAddress(null);
  };
  return {
    handleUseCurrentLocation,
    handleOpenMapChooser,
    handleSaveAddress,
    handleEditSave,
    handlePrimaryMapAction,
    handlePinnedLocationChange,
    cancelAdd,
  };
}
