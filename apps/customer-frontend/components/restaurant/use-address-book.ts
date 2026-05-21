"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAddresses } from "@/lib/api/addresses.api";
import { useAddressMutations } from "./hooks/use-address-mutations";

export type AddressLabel = "Home" | "Work" | "Hotel" | "Other";

export type SavedAddress = {
  id: string;
  label: AddressLabel;
  address: string;
  details: string;
  alternateNumber?: string;
};

export function useAddressBook() {
  const {
    data: rawAddresses = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: fetchAddresses,
    staleTime: 30 * 1000,
    retry: 1,
  });

  const {
    addAddress,
    editAddress,
    removeAddress,
    isSaving,
    isEditing,
    isRemoving,
  } = useAddressMutations();

  const addresses = isError ? [] : rawAddresses.map((raw) => ({
    id: raw.id,
    label: raw.label as AddressLabel,
    address: raw.address,
    details: raw.details ?? "",
    alternateNumber: raw.alternateNumber ?? undefined,
  }));

  return {
    addresses,
    addAddress,
    editAddress,
    removeAddress,
    isSaving,
    isEditing,
    isRemoving,
    hydrated: !isLoading,
  };
}
