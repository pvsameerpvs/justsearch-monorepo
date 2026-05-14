"use client";

import { ProfileInfoCard } from "./profile-info-card";
import { ProfileCredentialsCard } from "./profile-credentials-card";
import { ProfileLicenseCard } from "./profile-license-card";
import { ProfilePhotosCard } from "./profile-photos-card";
import { ProfileLinksCard } from "./profile-links-card";
import { ProfileQrCard } from "./profile-qr-card";
import { ProfileDriversCard } from "./profile-drivers-card";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

interface ProfileContainerProps {
  restaurant: AdminRestaurant;
  onUpdate?: (updates: Partial<AdminRestaurant>) => void;
}

export function ProfileContainer({ restaurant, onUpdate }: ProfileContainerProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileInfoCard restaurant={restaurant} onUpdate={onUpdate} />
        <div className="space-y-6">
          <ProfileCredentialsCard restaurant={restaurant} />
          <ProfileLicenseCard restaurant={restaurant} />
          <ProfileLinksCard subdomain={restaurant.subdomain} />
          <ProfileDriversCard subdomain={restaurant.subdomain} />
        </div>
      </div>
      <ProfilePhotosCard restaurant={restaurant} onUpdate={onUpdate} />
      <ProfileQrCard subdomain={restaurant.subdomain} />
    </div>
  );
}
