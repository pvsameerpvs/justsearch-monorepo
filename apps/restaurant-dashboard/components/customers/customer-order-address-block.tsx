import { MapPin } from "lucide-react";

interface OrderAddressBlockProps {
  address: string;
}

export function OrderAddressBlock({ address }: OrderAddressBlockProps) {
  return (
    <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <MapPin className="h-3.5 w-3.5 text-indigo-500" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">Delivery Address</span>
      </div>
      <p className="text-sm font-bold text-indigo-900">{address}</p>
    </div>
  );
}
