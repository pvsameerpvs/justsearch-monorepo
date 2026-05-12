import { Phone, Mail, Cake, MapPin } from 'lucide-react';
import type { Customer } from './types/customer.types';

export function CustomerDetails({ customer }: { customer: Customer }) {
  const rows = [
    { icon: Phone, value: customer.phone },
    { icon: Mail, value: customer.email },
    { icon: Cake, value: customer.birthday },
    { icon: MapPin, value: customer.location },
  ];

  return (
    <div className="mt-4 space-y-2">
      {rows.map((row) => (
        <div key={row.value} className="flex items-center gap-2 text-xs text-slate-600">
          <row.icon className="h-3.5 w-3.5 text-slate-400" />
          {row.value}
        </div>
      ))}
    </div>
  );
}
