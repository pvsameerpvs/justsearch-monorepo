import type { RestaurantRevenue } from '@/lib/constants/revenue.constants';

function getStatusColor(status: RestaurantRevenue['status']) {
  if (status === 'active') return 'bg-green-50 text-green-700';
  if (status === 'draft') return 'bg-amber-50 text-amber-700';
  return 'bg-red-50 text-red-700';
}

interface RevenueRestaurantRowProps {
  restaurant: RestaurantRevenue;
}

export function RevenueRestaurantRow({ restaurant }: RevenueRestaurantRowProps) {
  const total = restaurant.adRevenue + restaurant.subscriptionRevenue;

  return (
    <tr>
      <td className="py-3">
        <p className="font-semibold text-slate-900">{restaurant.name}</p>
        <p className="text-xs text-slate-400">{restaurant.city}</p>
      </td>
      <td className="py-3 text-center">
        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getStatusColor(restaurant.status)}`}>
          {restaurant.status}
        </span>
      </td>
      <td className="py-3 text-right font-medium text-slate-700">{restaurant.orders.toLocaleString()}</td>
      <td className="py-3 text-right font-medium text-slate-700">{restaurant.views.toLocaleString()}</td>
      <td className="py-3 text-right font-medium text-slate-700">AED {restaurant.adRevenue.toLocaleString()}</td>
      <td className="py-3 text-right font-bold text-slate-900">AED {total.toLocaleString()}</td>
    </tr>
  );
}
