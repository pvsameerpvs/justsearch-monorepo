import { apiClient } from './client';

export type Address = {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  address: string;
  details: string;
  alternateNumber?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateAddressPayload = {
  label: string;
  address: string;
  details?: string;
  alternateNumber?: string;
  isDefault?: boolean;
};

export async function fetchAddresses(): Promise<Address[]> {
  const data = await apiClient<{ addresses: Address[] }>('/addresses');
  return data.addresses;
}

export async function createAddress(payload: CreateAddressPayload): Promise<Address> {
  const data = await apiClient<{ address: Address }>('/addresses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.address;
}

export async function deleteAddress(id: string): Promise<void> {
  await apiClient<void>(`/addresses/${id}`, { method: 'DELETE' });
}
