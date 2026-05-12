import { User, Phone, Mail, Cake, Star, ShoppingBag, Crown, Gift, MapPin } from 'lucide-react';

const TIER_CONFIG: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  Bronze: { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: Star },
  Silver: { color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200', icon: Star },
  Gold: { color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', icon: Crown },
  Platinum: { color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: Crown },
};

type Customer = {
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

export function CustomerCard({ customer }: { customer: Customer }) {
  const tier = TIER_CONFIG[customer.vipTier];
  const TierIcon = tier.icon;

  return (
    <div className="card-premium-hover p-5">
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

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Phone className="h-3.5 w-3.5 text-slate-400" />
          {customer.phone}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Mail className="h-3.5 w-3.5 text-slate-400" />
          {customer.email}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Cake className="h-3.5 w-3.5 text-slate-400" />
          {customer.birthday}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          {customer.location}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3">
        <div className="flex items-center gap-1.5 text-xs">
          <ShoppingBag className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-bold text-slate-700">{customer.totalOrders}</span>
          <span className="text-slate-500">orders</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <Gift className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-bold text-slate-700">{customer.points}</span>
          <span className="text-slate-500">pts</span>
        </div>
        <div className="ml-auto text-xs font-bold text-slate-900">
          AED {customer.totalSpent.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
