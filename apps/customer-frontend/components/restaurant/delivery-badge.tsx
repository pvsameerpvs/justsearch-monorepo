import { Bike } from "lucide-react";

export function DeliveryBadge() {
  return (
    <div className="flex justify-center pt-5">
      <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 backdrop-blur-md border border-white/10">
        <Bike className="h-3.5 w-3.5 text-white/80" />
        <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Delivery Only</span>
      </div>
    </div>
  );
}
