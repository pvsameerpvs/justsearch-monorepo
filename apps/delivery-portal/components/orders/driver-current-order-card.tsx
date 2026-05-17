"use client";

import { DriverAnimatedStepper } from "./driver-animated-stepper";
import { DriverOrderCardCustomer } from "./driver-order-card-customer";
import { DriverOrderCardMapSection } from "./driver-order-card-map-section";
import { DriverExpandableItems } from "./driver-expandable-items";
import { DriverOrderNotes } from "./driver-order-notes";
import { DriverOrderMetaCard } from "./driver-order-meta-card";
import { DriverSlideButton } from "./driver-slide-button";
import type { DeliveryOrder, DeliveryOrderStatus } from "@/lib/delivery-types";

type DriverCurrentOrderCardProps = {
  order: DeliveryOrder;
  onUpdateStatus?: (assignmentId: string, status: string) => void;
};

export function DriverCurrentOrderCard({ order, onUpdateStatus }: DriverCurrentOrderCardProps) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white shadow-[0_8px_30px_-12px_rgba(15,23,42,0.2)] overflow-hidden">
      <DriverAnimatedStepper order={order} />
      <DriverOrderCardCustomer name={order.customerName} phone={order.customerPhone} />
      <DriverOrderCardMapSection address={order.dropoffAddress} lat={order.latitude} lng={order.longitude} />
      <DriverExpandableItems order={order} />
      {order.notes && <DriverOrderNotes notes={order.notes} />}
      <DriverOrderMetaCard orderedAtLabel={order.orderedAtLabel} itemCount={order.itemCount} etaMinutes={order.etaMinutes} />
      {onUpdateStatus && <DriverSlideButton order={order} onUpdateStatus={onUpdateStatus} />}
    </div>
  );
}
