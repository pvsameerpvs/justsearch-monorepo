"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAddress, updateAddress, deleteAddress } from "@/lib/api/addresses.api";
import type { SavedAddress } from "../use-address-book";
import { normalizeAddress } from "./address-mappers";

export function useAddressMutations() {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateAddress>[1] }) =>
      updateAddress(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });

  const addAddress = async (newAddr: Omit<SavedAddress, "id">) => {
    const created = await addMutation.mutateAsync({
      label: newAddr.label,
      address: newAddr.address,
      details: newAddr.details || undefined,
      alternateNumber: newAddr.alternateNumber || undefined,
      lat: newAddr.lat,
      lng: newAddr.lng,
    });
    return normalizeAddress(created);
  };

  const editAddress = async (id: string, updates: Omit<SavedAddress, "id">) => {
    const updated = await updateMutation.mutateAsync({
      id,
      payload: {
        label: updates.label,
        address: updates.address,
        details: updates.details || undefined,
        alternateNumber: updates.alternateNumber || undefined,
        lat: updates.lat,
        lng: updates.lng,
      },
    });
    return normalizeAddress(updated);
  };

  const removeAddress = async (id: string) => {
    await removeMutation.mutateAsync(id);
  };

  return {
    addAddress,
    editAddress,
    removeAddress,
    isSaving: addMutation.isPending,
    isEditing: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}
