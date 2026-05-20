import type { SavedAddress } from '../use-address-book';

export type PlaceApi = {
  placingOrder: unknown;
  setPlaceError: (msg: string) => void;
  startPlacing: (orderId: string) => void;
};

export type PromoApi = {
  consumePromo: () => void;
  appliedVoucher?: { code: string } | null;
  discount: number;
};

export type AddressApi = {
  addresses: SavedAddress[];
  address: string;
  addressTitle: string;
  addressDetails: string;
  alternateNumber: string;
  selectedAddressId: string | null;
  addAddress: (addr: Omit<SavedAddress, 'id'>) => Promise<SavedAddress>;
};
