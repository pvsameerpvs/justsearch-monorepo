import { MapPin, Package, Bike } from "lucide-react";
import type { DeliveryBoy } from "@/lib/stores/delivery-boy-store";

interface CardInfoGridProps {
  agent: DeliveryBoy;
}

export function CardInfoGrid({ agent }: CardInfoGridProps) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
      <div className="flex items-center gap-1.5 text-slate-500">
        <MapPin className="h-3 w-3 text-slate-400" />
        <span className="font-medium">{agent.phone}</span>
      </div>
      <div className="flex items-center gap-1.5 text-slate-500">
        <Package className="h-3 w-3 text-slate-400" />
        <span className="font-medium">{agent.totalDeliveries} deliveries</span>
      </div>
      <div className="flex items-center gap-1.5 text-slate-500">
        <MapPin className="h-3 w-3 text-slate-400" />
        <span className="font-medium">{agent.location}</span>
      </div>
      <div className="flex items-center gap-1.5 text-slate-500">
        <Bike className="h-3 w-3 text-slate-400" />
        <span className="font-medium">{agent.status === "busy" && agent.currentOrderId ? `Order ${agent.currentOrderId}` : "No order"}</span>
      </div>
    </div>
  );
}
