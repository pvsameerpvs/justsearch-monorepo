import { Check, Clock3, Leaf } from 'lucide-react';

interface AvailabilityBadgeProps {
  available: boolean;
  size?: 'sm' | 'md';
}

export function AvailabilityBadge({ available, size = 'md' }: AvailabilityBadgeProps) {
  const isSm = size === 'sm';
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-${isSm ? '2 py-1 text-[9px]' : '3 py-1.5 text-[10px]'} font-bold uppercase tracking-[0.1em] ${
      available ? 'bg-[rgb(var(--brand-soft))] text-[rgb(var(--brand))]' : 'bg-[rgb(var(--border)/0.78)] text-[rgb(var(--muted))]'
    }`}>
      {available ? <Check className={isSm ? 'h-3 w-3' : 'h-3.5 w-3.5'} /> : <Clock3 className={isSm ? 'h-3 w-3' : 'h-3.5 w-3.5'} />}
      {available ? 'Available' : 'Limited'}
    </span>
  );
}

interface DietaryBadgeProps {
  isVeg?: boolean;
  size?: 'sm' | 'md';
}

export function DietaryBadge({ isVeg, size = 'md' }: DietaryBadgeProps) {
  if (!isVeg) return null;
  const isSm = size === 'sm';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 px-${isSm ? '2 py-0.5 text-[9px]' : '2.5 py-1 text-[10px]'} font-bold uppercase tracking-[0.1em] text-emerald-700`}>
      <Leaf className={isSm ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      Veg
    </span>
  );
}
