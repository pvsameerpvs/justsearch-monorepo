"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { RestaurantLogoBadge } from "@/components/restaurant/restaurant-logo-badge";
import { ProfileOrderLeaveDialog } from "./profile-order-leave-dialog";
import { getRestaurantUrl } from "@/lib/restaurant-utils";
import type { Restaurant } from "@/lib/restaurant-types";
import type { CrossRestaurantOrder } from "@/lib/api/orders.api";

type Props = {
  currentRestaurant: Restaurant;
  order: CrossRestaurantOrder;
};

export function ProfileOrderRestaurantLogoLink({
  currentRestaurant,
  order,
}: Props) {
  const [showDialog, setShowDialog] = useState(false);

  const isSameRestaurant =
    order.restaurantSubdomain === currentRestaurant.subdomain;

  const handleClick = useCallback(() => {
    if (!isSameRestaurant) {
      setShowDialog(true);
    }
  }, [isSameRestaurant]);

  const handleCancel = useCallback(() => {
    setShowDialog(false);
  }, []);

  const targetUrl = getRestaurantUrl(order.restaurantSubdomain, "/menu");

  const commonClasses =
    "shrink-0 rounded-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand))] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

  const logoBadge = (
    <RestaurantLogoBadge
      restaurant={{
        name: order.restaurantName,
        logoUrl: order.restaurantLogoUrl ?? undefined,
      }}
      size="sm"
      className="h-11"
    />
  );

  return (
    <>
      {isSameRestaurant ? (
        <Link href="/menu" aria-label={`Open ${order.restaurantName} menu`} className={commonClasses}>
          {logoBadge}
        </Link>
      ) : (
        <button type="button" onClick={handleClick} aria-label={`Open ${order.restaurantName} menu`} className={commonClasses}>
          {logoBadge}
        </button>
      )}

      <ProfileOrderLeaveDialog
        open={showDialog}
        currentRestaurantName={currentRestaurant.name}
        targetRestaurantName={order.restaurantName}
        targetUrl={targetUrl}
        onCancel={handleCancel}
      />
    </>
  );
}
