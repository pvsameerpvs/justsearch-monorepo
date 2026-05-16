"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAddresses,
  createAddress,
  deleteAddress,
  type Address,
} from '@/lib/api/addresses.api';

export type AddressLabel = 'Home' | 'Work' | 'Other';

export type SavedAddress = {
  id: string;
  label: AddressLabel;
  address: string;
  details: string;
  alternateNumber?: string;
};

function normalizeAddress(raw: Address): SavedAddress {
  return {
    id: raw.id,
    label: raw.label as AddressLabel,
    address: raw.address,
    details: raw.details ?? '',
    alternateNumber: raw.alternateNumber ?? undefined,
  };
}

export function useAddressBook() {
  const queryClient = useQueryClient();

  const {
    data: rawAddresses = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['addresses'],
    queryFn: fetchAddresses,
    staleTime: 30 * 1000,
    retry: 1,
  });

  const addresses = isError ? [] : rawAddresses.map(normalizeAddress);

  const addMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  const addAddress = async (newAddr: Omit<SavedAddress, 'id'>) => {
    const created = await addMutation.mutateAsync({
      label: newAddr.label,
      address: newAddr.address,
      details: newAddr.details || undefined,
      alternateNumber: newAddr.alternateNumber || undefined,
    });
    return normalizeAddress(created);
  };

  const removeAddress = async (id: string) => {
    await removeMutation.mutateAsync(id);
  };

  return {
    addresses,
    addAddress,
    removeAddress,
    hydrated: !isLoading,
  };
}
