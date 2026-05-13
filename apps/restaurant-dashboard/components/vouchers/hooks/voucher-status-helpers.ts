import type { Voucher } from "../types/voucher.types";

export function getVoucherStatus(v: Voucher): string {
  const today = new Date().toISOString().split("T")[0];
  if (v.usageCount >= v.usageLimit) return "depleted";
  if (v.endDate < today) return "expired";
  if (v.startDate > today) return "scheduled";
  return v.isActive ? "active" : "inactive";
}
