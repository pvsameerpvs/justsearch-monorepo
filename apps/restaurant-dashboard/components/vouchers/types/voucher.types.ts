export type VoucherType = 'percentage' | 'fixed';

export type VoucherStatus = 'active' | 'expired' | 'scheduled' | 'depleted';

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  type: VoucherType;
  value: number; // percentage (e.g. 20 for 20%) or fixed amount (e.g. 50 for AED 50)
  minOrderValue: number;
  maxDiscount: number; // cap for percentage discounts
  usageLimit: number; // total usage limit
  usageCount: number; // how many times used
  startDate: string; // ISO date
  endDate: string; // ISO date
  isActive: boolean;
  createdAt: string;
}

export interface VoucherFormData {
  code: string;
  title: string;
  description: string;
  type: VoucherType;
  value: number;
  minOrderValue: number;
  maxDiscount: number;
  usageLimit: number;
  startDate: string;
  endDate: string;
}

export interface VoucherStats {
  total: number;
  active: number;
  expired: number;
  scheduled: number;
  usedCount: number;
}
