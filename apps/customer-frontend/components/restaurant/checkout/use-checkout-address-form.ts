"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGeolocation } from '../use-geolocation';
import type { AddressLabel } from '../use-address-book';
import {
  checkoutAddressSchema,
  type CheckoutAddressFormData,
} from '@/lib/validations/common.schema';
import { formatCombinedAddress, formatDetails } from './checkout-address-formatters';

type UseCheckoutAddressFormReturn = {
  register: ReturnType<typeof useForm<CheckoutAddressFormData>>['register'];
  handleSubmit: ReturnType<typeof useForm<CheckoutAddressFormData>>['handleSubmit'];
  setValue: ReturnType<typeof useForm<CheckoutAddressFormData>>['setValue'];
  watch: ReturnType<typeof useForm<CheckoutAddressFormData>>['watch'];
  errors: ReturnType<typeof useForm<CheckoutAddressFormData>>['formState']['errors'];
  isValid: boolean;
  saveError: string | null;
  isLocating: boolean;
  handleGetCurrentLocation: () => Promise<void>;
  buildAddressPayload: (data: CheckoutAddressFormData) => { label: AddressLabel; address: string; details: string; alternateNumber: string };
  setSaveError: (msg: string | null) => void;
};

export function useCheckoutAddressForm(initialAddress?: string): UseCheckoutAddressFormReturn {
  const { getCurrentAddress, isLocating, error } = useGeolocation();
  const [saveError, setSaveError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors, isValid } } = useForm<CheckoutAddressFormData>({
    resolver: zodResolver(checkoutAddressSchema),
    mode: 'onChange',
    defaultValues: {
      label: 'Home',
      areaStreet: initialAddress?.trim() ?? '',
      buildingName: '',
      villaNo: '',
      landmark: '',
      alternateNumber: '',
    },
  });

  useEffect(() => {
    if (initialAddress) {
      setValue('areaStreet', initialAddress.trim(), { shouldValidate: true });
    }
  }, [initialAddress, setValue]);

  const handleGetCurrentLocation = async () => {
    const resolvedAddress = await getCurrentAddress();
    if (resolvedAddress) {
      setValue('areaStreet', resolvedAddress, { shouldValidate: true });
    } else if (error) {
      setSaveError(error);
    }
  };

  const buildAddressPayload = (data: CheckoutAddressFormData): { label: AddressLabel; address: string; details: string; alternateNumber: string } => ({
    label: data.label as AddressLabel,
    address: formatCombinedAddress(data),
    details: formatDetails(data),
    alternateNumber: data.alternateNumber?.trim() ?? '',
  });

  return {
    register, handleSubmit, setValue, watch,
    errors, isValid, saveError, isLocating,
    handleGetCurrentLocation, buildAddressPayload, setSaveError,
  };
}
