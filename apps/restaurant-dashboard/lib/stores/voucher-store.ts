"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Voucher, VoucherFormData } from "@/components/vouchers/types/voucher.types";

interface VoucherStore {
  vouchers: Voucher[];
  addVoucher: (data: VoucherFormData) => void;
  updateVoucher: (id: string, data: VoucherFormData) => void;
  deleteVoucher: (id: string) => void;
  toggleActive: (id: string) => void;
  incrementUsage: (id: string) => void;
}

function generateVoucherCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export const useVoucherStore = create<VoucherStore>()(
  persist(
    (set) => ({
      vouchers: [],
      addVoucher: (data) =>
        set((state) => ({
          vouchers: [
            ...state.vouchers,
            {
              id: crypto.randomUUID(),
              code: data.code || generateVoucherCode(),
              title: data.title,
              description: data.description,
              type: data.type,
              value: data.value,
              minOrderValue: data.minOrderValue,
              maxDiscount: data.maxDiscount,
              usageLimit: data.usageLimit,
              usageCount: 0,
              startDate: data.startDate,
              endDate: data.endDate,
              isActive: true,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateVoucher: (id, data) =>
        set((state) => ({
          vouchers: state.vouchers.map((v) =>
            v.id === id ? { ...v, ...data, code: data.code || v.code } : v
          ),
        })),
      deleteVoucher: (id) =>
        set((state) => ({
          vouchers: state.vouchers.filter((v) => v.id !== id),
        })),
      toggleActive: (id) =>
        set((state) => ({
          vouchers: state.vouchers.map((v) =>
            v.id === id ? { ...v, isActive: !v.isActive } : v
          ),
        })),
      incrementUsage: (id) =>
        set((state) => ({
          vouchers: state.vouchers.map((v) =>
            v.id === id ? { ...v, usageCount: v.usageCount + 1 } : v
          ),
        })),
    }),
    { name: "voucher-store" }
  )
);
