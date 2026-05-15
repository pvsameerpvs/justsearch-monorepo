"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { voucherSchema } from "@/lib/validations/dashboard.schema";
import type { VoucherFormData } from "@/lib/validations/dashboard.schema";
import type { Voucher } from "../types/voucher.types";

const EMPTY_VALUES: VoucherFormData = {
  code: "",
  title: "",
  description: "",
  type: "percentage",
  value: 10,
  minOrderValue: 0,
  maxDiscount: 0,
  usageLimit: 100,
  startDate: "",
  endDate: "",
};

export function useVoucherForm(voucher: Voucher | null) {
  const form = useForm<VoucherFormData>({
    resolver: zodResolver(voucherSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (voucher) {
      form.reset({
        code: voucher.code,
        title: voucher.title,
        description: voucher.description,
        type: voucher.type,
        value: voucher.value,
        minOrderValue: voucher.minOrderValue,
        maxDiscount: voucher.maxDiscount,
        usageLimit: voucher.usageLimit,
        startDate: voucher.startDate,
        endDate: voucher.endDate,
      });
    } else {
      const today = new Date().toISOString().split("T")[0];
      form.reset({ ...EMPTY_VALUES, startDate: today, endDate: today });
    }
  }, [voucher, form]);

  return form;
}
