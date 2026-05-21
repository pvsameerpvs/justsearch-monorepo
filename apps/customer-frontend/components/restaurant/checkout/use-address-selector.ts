"use client";

import { useEffect } from 'react';
import type { SavedAddress } from '../use-address-book';
import { useSelectorMode } from './use-selector-mode';
import { useSelectorLocation } from './use-selector-location';
import { useSelectorActions } from './use-selector-actions';

export function useAddressSelector(
  open: boolean,
  addresses: SavedAddress[],
  selectedAddressId: string | undefined,
  onClose: () => void,
  onSelectAddress: (address: SavedAddress) => void,
  onAddAddress: (address: Omit<SavedAddress, 'id'>) => Promise<void>,
  onEditAddress: (id: string, address: Omit<SavedAddress, 'id'>) => Promise<void>,
) {
  const mode = useSelectorMode();
  const loc = useSelectorLocation();
  const actions = useSelectorActions(addresses, selectedAddressId, onClose, onSelectAddress, onAddAddress, onEditAddress, mode, loc);

  useEffect(() => {
    if (open) return;
    mode.reset();
    loc.reset();
  }, [open]);

  return {
    mode: mode.mode,
    mapSelection: mode.mapSelection,
    setMapSelection: mode.setMapSelection,
    editingAddress: mode.editingAddress,
    goToAdd: mode.goToAdd,
    goToEdit: mode.goToEdit,
    currentLocationAddress: loc.currentLocationAddress,
    currentLocationCoords: loc.currentLocationCoords,
    isLocating: loc.isLocating,
    ...actions,
  };
}
