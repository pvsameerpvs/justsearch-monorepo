import type { CheckoutAddressFormData } from '@/lib/validations/common.schema';

export function formatCombinedAddress(data: CheckoutAddressFormData): string {
  const parts = [
    data.areaStreet,
    data.buildingName,
    data.villaNo ? `Villa/Flat ${data.villaNo}` : '',
  ].filter(Boolean);
  return parts.join(', ');
}

export function formatDetails(data: CheckoutAddressFormData): string {
  const parts = [
    data.landmark ? `Landmark: ${data.landmark}` : '',
    data.alternateNumber ? `Alt: ${data.alternateNumber}` : '',
  ].filter(Boolean);
  return parts.join('. ');
}
