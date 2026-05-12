import { Star, Crown } from 'lucide-react';
import type { ElementType } from 'react';

export const TIER_CONFIG: Record<string, { color: string; bg: string; icon: ElementType }> = {
  Bronze: { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: Star },
  Silver: { color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200', icon: Star },
  Gold: { color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', icon: Crown },
  Platinum: { color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: Crown },
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  totalOrders: number;
  totalSpent: number;
  vipTier: string;
  points: number;
  lastVisit: string;
  location: string;
};
