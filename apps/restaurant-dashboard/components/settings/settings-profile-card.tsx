"use client";

import { useState } from "react";
import { Briefcase } from "lucide-react";
import { ProfileRow } from "../profile/profile-info-parts";
import { User, Phone, Mail, MapPin, Tag, FileText, Building2, Lock } from "lucide-react";
import { SettingsProfileEditForm } from "./settings-profile-edit-form";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

interface SettingsProfileCardProps {
  restaurant: AdminRestaurant;
  onUpdate?: (updates: Partial<AdminRestaurant>) => void;
}

export function SettingsProfileCard({ restaurant, onUpdate }: SettingsProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    ownerName: restaurant.ownerName,
    contactPhone: restaurant.contactPhone,
    contactEmail: restaurant.contactEmail,
    address: restaurant.address,
    cuisine: restaurant.cuisine,
    logoUrl: restaurant.logoUrl,
  });

  const handleSave = () => {
    onUpdate?.(form);
    setIsEditing(false);
  };

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="elegant-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Briefcase className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Restaurant Profile</h3>
        </div>
        {isEditing ? (
          <div className="flex gap-1">
            <button onClick={() => setIsEditing(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">Cancel</button>
            <button onClick={handleSave} className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">Save</button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors">Edit</button>
        )}
      </div>
      {isEditing ? (
        <SettingsProfileEditForm form={form} onChange={set} />
      ) : (
        <div className="space-y-3">
          {restaurant.logoUrl && (
            <div className="flex items-center gap-3">
              <img src={restaurant.logoUrl} alt="Logo" className="h-14 w-14 rounded-xl object-cover border border-slate-200" />
              <span className="text-xs font-semibold text-slate-500">Current Logo</span>
            </div>
          )}
          <ProfileRow icon={User} label="Restaurant Name" value={restaurant.name} />
          <ProfileRow icon={User} label="Owner" value={restaurant.ownerName} />
          <ProfileRow icon={Phone} label="Phone" value={restaurant.contactPhone} />
          <ProfileRow icon={Mail} label="Email" value={restaurant.contactEmail} />
          <ProfileRow icon={MapPin} label="Address" value={`${restaurant.address}, ${restaurant.city}, ${restaurant.area}`} />
          <ProfileRow icon={Tag} label="Cuisine" value={restaurant.cuisine} />
          <ProfileRow icon={FileText} label="Tax Number" value={restaurant.taxNumber} />
          <ProfileRow icon={Building2} label="Business License" value={restaurant.businessLicense} />
          <ProfileRow icon={Briefcase} label="Tables" value={`${restaurant.tables} tables`} />
          <ProfileRow icon={Lock} label="Dashboard Username" value={restaurant.dashboardUsername} />
        </div>
      )}
    </div>
  );
}
