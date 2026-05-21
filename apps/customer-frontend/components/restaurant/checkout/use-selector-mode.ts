"use client";

import { useState } from 'react';
import type { SavedAddress } from '../use-address-book';

export type UseSelectorModeReturn = {
  mode: 'list' | 'map' | 'add' | 'edit';
  setMode: React.Dispatch<React.SetStateAction<'list' | 'map' | 'add' | 'edit'>>;
  mapSelection: { type: 'pinned' } | { type: 'saved'; id: string };
  setMapSelection: React.Dispatch<React.SetStateAction<{ type: 'pinned' } | { type: 'saved'; id: string }>>;
  editingAddress: SavedAddress | null;
  setEditingAddress: React.Dispatch<React.SetStateAction<SavedAddress | null>>;
  goToList: () => void;
  goToMap: () => void;
  goToAdd: () => void;
  goToEdit: (addr: SavedAddress) => void;
  reset: () => void;
};

export function useSelectorMode(): UseSelectorModeReturn {
  const [mode, setMode] = useState<'list' | 'map' | 'add' | 'edit'>('list');
  const [mapSelection, setMapSelection] = useState<{ type: 'pinned' } | { type: 'saved'; id: string }>({ type: 'pinned' });
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);

  const goToList = () => setMode('list');
  const goToMap = () => setMode('map');
  const goToAdd = () => setMode('add');
  const goToEdit = (addr: SavedAddress) => {
    setEditingAddress(addr);
    setMode('edit');
  };

  const reset = () => {
    setMode('list');
    setMapSelection({ type: 'pinned' });
    setEditingAddress(null);
  };

  return {
    mode,
    setMode,
    mapSelection,
    setMapSelection,
    editingAddress,
    setEditingAddress,
    goToList,
    goToMap,
    goToAdd,
    goToEdit,
    reset,
  };
}
