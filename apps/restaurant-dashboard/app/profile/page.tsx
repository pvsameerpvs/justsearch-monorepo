"use client";

import { PageHeader } from "@justsearch/ui";
import { useRestaurantProfile } from "@/lib/hooks/use-restaurant-profile";
import { ProfileContainer } from "@/components/profile/profile-container";

export default function ProfilePage() {
  const { restaurant, updateRestaurant } = useRestaurantProfile();

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Your restaurant details and credentials" />
      {restaurant && <ProfileContainer restaurant={restaurant} onUpdate={updateRestaurant} />}
    </div>
  );
}
