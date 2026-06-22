"use client";

import { useCallback, useState } from 'react';
import { apiClient } from '@/lib/api/client';

export type ValidateResult =
  | { valid: true; discount: number; voucher: { id: string; code: string; title: string | null; type: string; value: number; minOrder: number; maxDiscount: number | null } }
  | { valid: false; reason: string };

export function useVoucherValidate() {
  const [isValidating, setIsValidating] = useState(false);

  const validateCode = useCallback(async (code: string, subtotal: number): Promise<ValidateResult | null> => {
    if (!code.trim()) return null;
    setIsValidating(true);
    try {
      const result = await apiClient<ValidateResult>('/vouchers/validate', {
        method: 'POST',
        body: JSON.stringify({ code: code.trim().toUpperCase(), subtotal }),
      });
      return result;
    } catch {
      return { valid: false, reason: 'Could not validate code. Please try again.' };
    } finally {
      setIsValidating(false);
    }
  }, []);

  return { validateCode, isValidating };
}
