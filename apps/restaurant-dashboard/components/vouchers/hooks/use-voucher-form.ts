"use client";

import { useState, useEffect, useCallback } from "react";
import { validateVoucherForm } from "./voucher-form-validator";
import type { Voucher, VoucherFormData } from "../types/voucher.types";

const EMPTY_FORM: VoucherFormData = {
  code: "", title: "", description: "", type: "percentage",
  value: 10, minOrderValue: 0, maxDiscount: 0,
  usageLimit: 100, startDate: "", endDate: "",
};

export function useVoucherForm(voucher: Voucher | null, onSave: (data: VoucherFormData) => void) {
  const [form, setForm] = useState<VoucherFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (voucher) {
      setForm({
        code: voucher.code, title: voucher.title, description: voucher.description,
        type: voucher.type, value: voucher.value, minOrderValue: voucher.minOrderValue,
        maxDiscount: voucher.maxDiscount, usageLimit: voucher.usageLimit,
        startDate: voucher.startDate, endDate: voucher.endDate,
      });
    } else {
      const today = new Date().toISOString().split("T")[0];
      setForm({ ...EMPTY_FORM, startDate: today, endDate: today });
    }
    setErrors({});
  }, [voucher]);

  const setField = useCallback(
    <K extends keyof VoucherFormData>(field: K, value: VoucherFormData[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const onSubmit = useCallback(() => {
    const nextErrors = validateVoucherForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSave(form);
    }
  }, [form, onSave]);

  return { form, setField, errors, onSubmit };
}
