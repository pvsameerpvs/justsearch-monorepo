import { TIER_CONFIG, type Customer } from './types/customer.types';

export function CustomerHeader({ customer }: { customer: Customer }) {
  const tier = TIER_CONFIG[customer.vipTier];
  const TierIcon = tier.icon;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-sm font-bold text-blue-700">
          {customer.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <div>
          <p className="font-bold text-slate-900">{customer.name}</p>
          <p className="text-xs text-slate-500">{customer.lastVisit}</p>
        </div>
      </div>
      <span className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-bold ${tier.bg} ${tier.color}`}>
        <TierIcon className="h-3 w-3" />
        {customer.vipTier}
      </span>
    </div>
  );
}
