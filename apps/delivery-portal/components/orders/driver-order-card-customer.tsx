import { Phone, User } from 'lucide-react';

type DriverOrderCardCustomerProps = {
  name: string;
  phone: string;
};

export function DriverOrderCardCustomer({ name, phone }: DriverOrderCardCustomerProps) {
  return (
    <div className="px-4 pb-3 border-t border-slate-100 pt-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
            <User className="h-4 w-4 text-slate-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{name}</p>
            <p className="text-xs text-slate-500 truncate">{phone}</p>
          </div>
        </div>
        <a
          href={`tel:${phone.replace(/\s/g, '')}`}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white active:scale-95 transition"
        >
          <Phone className="h-3.5 w-3.5" />
          Call
        </a>
      </div>
    </div>
  );
}
