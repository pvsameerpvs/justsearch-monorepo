import type { ElementType } from 'react';
import { Crown } from 'lucide-react';

interface RoleMeta {
  label: string;
  color: string;
  icon: ElementType;
}

export const ROLE_META: Record<string, RoleMeta> = {
  owner: { label: 'Owner', color: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white', icon: Crown },
  manager: { label: 'Manager', color: 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white', icon: Crown },
  cashier: { label: 'Cashier', color: 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white', icon: Crown },
  kitchen_staff: { label: 'Kitchen', color: 'bg-gradient-to-br from-rose-400 to-pink-500 text-white', icon: Crown },
};

export const DEFAULT_ROLE_META: RoleMeta = {
  label: 'Staff',
  color: 'bg-slate-200 text-slate-600',
  icon: Crown,
};

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}
