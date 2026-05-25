"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ProfileOrderDetailsRestaurantCard } from "./profile-order-details-restaurant-card";
import { ProfileOrderLeaveDialog } from "./profile-order-leave-dialog";
import { getRestaurantUrl } from "@/lib/restaurant-utils";
import type { Restaurant } from "@/lib/restaurant-types";
import type { Order } from "@justsearch/types";

type Props = {
  sourceOrder: Order;
  currentRestaurant: Restaurant;
};

export function ProfileOrderDetailsRestaurantLink({
  sourceOrder,
  currentRestaurant,
}: Props) {
  const [showDialog, setShowDialog] = useState(false);

  const isSameRestaurant =
    sourceOrder.restaurantSubdomain === currentRestaurant.subdomain;

  const handleClick = useCallback(() => {
    if (!isSameRestaurant) setShowDialog(true);
  }, [isSameRestaurant]);

  const handleCancel = useCallback(() => setShowDialog(false), []);

  const restaurantName =
    sourceOrder.restaurantName || currentRestaurant.name;
  const logoUrl = sourceOrder.restaurantLogoUrl ?? undefined;
  const targetUrl = getRestaurantUrl(
    sourceOrder.restaurantSubdomain || currentRestaurant.subdomain,
    "/menu"
  );

  return (
    <>
      {isSameRestaurant ? (
        <Link
          href="/menu"
          className="block rounded-[24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand))] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          <ProfileOrderDetailsRestaurantCard name={restaurantName} logoUrl={logoUrl} />
        </Link>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="block w-full rounded-[24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand))] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          <ProfileOrderDetailsRestaurantCard name={restaurantName} logoUrl={logoUrl} />
        </button>
      )}

      <ProfileOrderLeaveDialog
        open={showDialog}
        currentRestaurantName={currentRestaurant.name}
        targetRestaurantName={restaurantName}
        targetUrl={targetUrl}
        onCancel={handleCancel}
      />
    </>
  );
}
