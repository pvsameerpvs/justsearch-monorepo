"use client";

import { useState, useMemo, useCallback } from 'react';
import { useVoucherWallet } from './use-voucher-wallet';
import { useVoucherValidate } from './use-voucher-validate';

export function useCheckoutPromo(subtotal: number) {
  const { findVoucherByCode, markVoucherUsed, addVoucher } = useVoucherWallet();
  const { validateCode, isValidating } = useVoucherValidate();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const appliedVoucher = useMemo(
    () => (appliedPromoCode ? findVoucherByCode(appliedPromoCode) : null),
    [appliedPromoCode, findVoucherByCode]
  );

  const discount = useMemo(
    () => (appliedVoucher && !appliedVoucher.isUsed ? promoDiscount : 0),
    [appliedVoucher, promoDiscount]
  );

  const applyPromoCode = useCallback(async (overrideCode?: string) => {
    const normalized = (overrideCode ?? promoCode).trim().toUpperCase();
    setPromoError(null);

    if (!normalized) {
      setAppliedPromoCode(null);
      setPromoDiscount(0);
      return;
    }

    // 1. Check wallet — if code was already used, reject immediately
    const walletVoucher = findVoucherByCode(normalized);
    if (walletVoucher?.isUsed) {
      setPromoError('This voucher has already been used');
      return;
    }

    // 2. Always validate against backend for correct discount (handles maxDiscount, dates, usage limits)
    const result = await validateCode(normalized, subtotal);
    if (!result) {
      setPromoError('Please enter a promo code');
      return;
    }
    if (!result.valid) {
      setPromoError(result.reason);
      setAppliedPromoCode(null);
      setPromoDiscount(0);
      return;
    }

    // 3. Save validated code to wallet if not already there (ensures persistence)
    if (!walletVoucher) {
      const discountLabel = result.voucher.type === 'percentage'
        ? `${result.voucher.value}% OFF`
        : `AED ${result.voucher.value} OFF`;
      const expiryLabel = result.voucher.maxDiscount
        ? `Up to AED ${result.voucher.maxDiscount} off`
        : '';

      addVoucher({
        code: result.voucher.code,
        title: result.voucher.title || discountLabel,
        discountLabel,
        discount: result.voucher.type === 'percentage'
          ? { kind: 'percent', value: result.voucher.value }
          : { kind: 'flat', value: result.voucher.value },
        expiryLabel,
        source: 'order',
      });
    }

    // 4. Use backend-computed discount (correctly capped at maxDiscount)
    setAppliedPromoCode(result.voucher.code);
    setPromoDiscount(result.discount);
  }, [promoCode, subtotal, findVoucherByCode, validateCode, addVoucher]);

  const consumePromo = useCallback(() => {
    if (appliedVoucher && !appliedVoucher.isUsed) {
      markVoucherUsed(appliedVoucher.code);
    }
  }, [appliedVoucher, markVoucherUsed]);

  return {
    promoCode,
    setPromoCode,
    appliedPromoCode,
    appliedVoucher,
    discount,
    promoError,
    isValidating,
    applyPromoCode,
    consumePromo,
    setPromoError,
  };
}
