"use client";

import { useState, useMemo } from 'react';
import { useVoucherWallet, getVoucherDiscountAmount } from './use-voucher-wallet';

export function useCheckoutPromo(total: number) {
  const { findVoucherByCode, markVoucherUsed } = useVoucherWallet();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);

  const appliedVoucher = useMemo(
    () => (appliedPromoCode ? findVoucherByCode(appliedPromoCode) : null),
    [appliedPromoCode, findVoucherByCode]
  );

  const discount = useMemo(
    () => (appliedVoucher && !appliedVoucher.isUsed ? getVoucherDiscountAmount(appliedVoucher, total) : 0),
    [appliedVoucher, total]
  );

  const applyPromoCode = () => {
    const normalized = promoCode.trim().toUpperCase();
    if (!normalized) {
      setAppliedPromoCode(null);
      return;
    }
    const voucher = findVoucherByCode(normalized);
    if (!voucher || voucher.isUsed) return;
    setAppliedPromoCode(voucher.code);
  };

  const consumePromo = () => {
    if (appliedVoucher && !appliedVoucher.isUsed) {
      markVoucherUsed(appliedVoucher.code);
    }
  };

  return {
    promoCode,
    setPromoCode,
    appliedVoucher,
    discount,
    applyPromoCode,
    consumePromo,
  };
}
