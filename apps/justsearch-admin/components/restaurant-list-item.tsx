import { Badge } from '@justsearch/ui';
import { ChevronRight, MapPin } from 'lucide-react';

const PLAN_CONFIG: Record<string, { label: string; variant: string }> = {
  exclusive: { label: 'Exclusive', variant: 'warning' },
  pool: { label: 'Pool', variant: 'secondary' },
};

const STATUS_CONFIG: Record<string, { label: string; variant: string }> = {
  active: { label: 'Active', variant: 'success' },
  draft: { label: 'Draft', variant: 'secondary' },
};

export function RestaurantListItem({ restaurant }: { restaurant: {
  id: number;
  name: string;
  status: string;
  plan: string;
  city: string;
  orders: number;
  revenue: number;
  customers: number;
} }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition-colors hover:bg-slate-50">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">{restaurant.name}</span>
          <Badge variant={STATUS_CONFIG[restaurant.status].variant as never}>
            {STATUS_CONFIG[restaurant.status].label}
          </Badge>
          <Badge variant={PLAN_CONFIG[restaurant.plan].variant as never}>
            {PLAN_CONFIG[restaurant.plan].label}
          </Badge>
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {restaurant.city}
          </span>
          <span>{restaurant.orders.toLocaleString()} orders</span>
          <span>AED {restaurant.revenue.toLocaleString()} revenue</span>
          <span>{restaurant.customers.toLocaleString()} customers</span>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-slate-400" />
    </div>
  );
}
