import type { Address } from "@/lib/api/addresses.api";
import type { SavedAddress } from "../use-address-book";

export function normalizeAddress(raw: Address): SavedAddress {
  return {
    id: raw.id,
    label: raw.label as SavedAddress["label"],
    address: raw.address,
    details: raw.details ?? "",
    alternateNumber: raw.alternateNumber ?? undefined,
    lat: raw.lat ?? undefined,
    lng: raw.lng ?? undefined,
  };
}
