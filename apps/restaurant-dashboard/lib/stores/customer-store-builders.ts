import type { Customer, CustomerAddress, GameActivity, VoucherUsage } from "@/components/customers/types/customer.types";

const B = new Date();
export const d = (days: number) => new Date(B.getTime() + days * 86400000).toISOString().split("T")[0];

export function addr(label: string, address: string, details: string): CustomerAddress {
  return { label, address, details };
}

export function game(name: string, score: number, days: number, reward?: string): GameActivity {
  return { gameName: name, score, playedAt: d(days), reward };
}

export function voucher(code: string, title: string, discount: string, days: number, total: number): VoucherUsage {
  return { code, title, discount, usedAt: d(days), orderTotal: total };
}

export function customer(
  id: string,
  name: string,
  phone: string,
  email: string,
  birthday: string,
  location: string,
  orders: number,
  spent: number,
  tier: string,
  points: number,
  lastVisitDays: number,
  registered: string,
  addresses: CustomerAddress[],
  games: GameActivity[],
  vouchers: VoucherUsage[]
): Customer {
  return {
    id, name, phone, email, birthday, location,
    totalOrders: orders, totalSpent: spent, vipTier: tier, points,
    lastVisit: d(lastVisitDays), registeredAt: registered,
    addresses, gameHistory: games, voucherHistory: vouchers,
  };
}
