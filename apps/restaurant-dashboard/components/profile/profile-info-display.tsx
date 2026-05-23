"use client";

import { ProfileRow } from "./profile-info-parts";
import { Building2, User, Phone, Mail, MapPin, Tag, Hash, FileText, Lock, Link2, Globe, Briefcase, Calendar } from "lucide-react";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

interface ProfileInfoDisplayProps {
  restaurant: AdminRestaurant;
}

export function ProfileInfoDisplay({ restaurant }: ProfileInfoDisplayProps) {
  return (
    <div className="space-y-3">
      <ProfileRow icon={Building2} label="Restaurant Name" value={restaurant.name} />
      <ProfileRow icon={User} label="Owner" value={restaurant.ownerName} />
      <ProfileRow icon={Phone} label="Phone" value={restaurant.contactPhone} />
      <ProfileRow icon={Mail} label="Email" value={restaurant.contactEmail} />
      <ProfileRow icon={MapPin} label="Address" value={restaurant.address} />
      <ProfileRow icon={MapPin} label="City" value={restaurant.city} />
      <ProfileRow icon={MapPin} label="Area" value={restaurant.area} />
      <ProfileRow icon={Tag} label="Cuisine" value={restaurant.cuisine} />
      <ProfileRow icon={Hash} label="Tax Number" value={restaurant.taxNumber} />
      <ProfileRow icon={FileText} label="Business License" value={restaurant.businessLicense} />
      <ProfileRow icon={Building2} label="Tables" value={`${restaurant.tables} tables`} />
      <ProfileRow icon={Lock} label="Dashboard Username" value={restaurant.dashboardUsername} />
      <ProfileRow icon={Link2} label="Slug" value={restaurant.slug} />
      <ProfileRow icon={Globe} label="Subdomain" value={`${restaurant.subdomain}.${process.env.NEXT_PUBLIC_BASE_DOMAIN || 'eatygo.com'}`} />
      <ProfileRow icon={Briefcase} label="Status" value={restaurant.status} />
      <ProfileRow icon={Calendar} label="Created" value={restaurant.createdAt} />
    </div>
  );
}
