import { Phone, Mail, MapPin, CalendarDays, ShoppingBag, Wallet, Coins, Cake, Gamepad2, Ticket, Home } from "lucide-react";
import { InfoItem, StatCard } from "./customer-detail-info-item";
import type { Customer } from "./types/customer.types";

interface CustomerDetailOverviewProps {
  customer: Customer;
}

export function CustomerDetailOverview({ customer }: CustomerDetailOverviewProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <InfoItem icon={Phone} label="Phone" value={customer.phone} />
        <InfoItem icon={Mail} label="Email" value={customer.email} />
        <InfoItem icon={Cake} label="Birthday" value={customer.birthday} />
        <InfoItem icon={MapPin} label="Location" value={customer.location} />
        <InfoItem icon={CalendarDays} label="Registered" value={customer.registeredAt} />
        <InfoItem icon={CalendarDays} label="Last Visit" value={customer.lastVisit} />
      </div>

      <div className="grid grid-cols-4 gap-3">
        <StatCard icon={ShoppingBag} label="Orders" value={String(customer.totalOrders)} />
        <StatCard icon={Wallet} label="Spent" value={`AED ${customer.totalSpent.toLocaleString()}`} />
        <StatCard icon={Coins} label="Points" value={customer.points.toLocaleString()} />
        <StatCard icon={Gamepad2} label="Games" value={String(customer.gameHistory.length)} />
      </div>

      <CustomerAddresses addresses={customer.addresses} />
      <CustomerVouchers vouchers={customer.voucherHistory} />
    </div>
  );
}

function CustomerAddresses({ addresses }: { addresses: Customer["addresses"] }) {
  if (addresses.length === 0) return null;
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
        Saved Addresses ({addresses.length})
      </p>
      <div className="space-y-2">
        {addresses.map((addr, index) => (
          <div key={index} className="rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-2">
            <div className="flex items-center gap-1.5 mb-1">
              <Home className="h-3 w-3 text-indigo-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">{addr.label}</span>
            </div>
            <p className="text-xs font-bold text-indigo-900">{addr.address}</p>
            {addr.details && <p className="text-[10px] text-indigo-600">{addr.details}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomerVouchers({ vouchers }: { vouchers: Customer["voucherHistory"] }) {
  if (vouchers.length === 0) return null;
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Recent Vouchers</p>
      <div className="space-y-2">
        {vouchers.slice(0, 3).map((v) => (
          <div key={v.code} className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
            <div className="flex items-center gap-2">
              <Ticket className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs font-bold text-slate-700">{v.code}</span>
              <span className="text-xs text-slate-500">{v.title}</span>
            </div>
            <span className="text-xs font-bold text-amber-600">{v.discount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
