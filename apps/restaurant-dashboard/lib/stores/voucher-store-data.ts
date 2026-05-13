import type { Voucher } from "@/components/vouchers/types/voucher.types";

const BASE_DATE = new Date();

export function generateVoucherCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function d(days: number): string {
  return new Date(BASE_DATE.getTime() + days * 86400000).toISOString().split("T")[0];
}

function iso(days: number): string {
  return new Date(BASE_DATE.getTime() + days * 86400000).toISOString();
}

export const INITIAL_VOUCHERS: Voucher[] = [
  {
    id: "v1", code: "WELCOME20", title: "Welcome Offer",
    description: "20% off for new customers on first order",
    type: "percentage", value: 20, minOrderValue: 50, maxDiscount: 30,
    usageLimit: 100, usageCount: 34,
    startDate: d(-30), endDate: d(60), isActive: true, createdAt: iso(-30),
  },
  {
    id: "v2", code: "FLAT50", title: "Flat AED 50 Off",
    description: "Flat discount on orders above AED 200",
    type: "fixed", value: 50, minOrderValue: 200, maxDiscount: 50,
    usageLimit: 50, usageCount: 12,
    startDate: d(-15), endDate: d(15), isActive: true, createdAt: iso(-15),
  },
  {
    id: "v3", code: "SUMMER25", title: "Summer Special",
    description: "25% off all summer menu items",
    type: "percentage", value: 25, minOrderValue: 80, maxDiscount: 40,
    usageLimit: 200, usageCount: 89,
    startDate: d(-5), endDate: d(25), isActive: true, createdAt: iso(-5),
  },
  {
    id: "v4", code: "FLASH10", title: "Flash Sale",
    description: "10% off limited time flash sale",
    type: "percentage", value: 10, minOrderValue: 0, maxDiscount: 15,
    usageLimit: 500, usageCount: 500,
    startDate: d(-20), endDate: d(-5), isActive: true, createdAt: iso(-20),
  },
  {
    id: "v5", code: "BDAY2026", title: "Birthday Celebration",
    description: "AED 100 off for birthday orders",
    type: "fixed", value: 100, minOrderValue: 300, maxDiscount: 100,
    usageLimit: 20, usageCount: 0,
    startDate: d(10), endDate: d(40), isActive: true, createdAt: iso(0),
  },
];
