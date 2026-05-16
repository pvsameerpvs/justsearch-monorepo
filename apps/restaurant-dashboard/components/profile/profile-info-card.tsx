"use client";

import { useState } from "react";
import { Building2, Pencil, Check, X } from "lucide-react";
import { ProfileInfoEdit } from "./profile-info-edit";
import { ProfileInfoDisplay } from "./profile-info-display";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

interface ProfileInfoCardProps {
  restaurant: AdminRestaurant;
  onUpdate?: (updates: Partial<AdminRestaurant>) => void;
}

export function ProfileInfoCard({ restaurant, onUpdate }: ProfileInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(() => ({
    name: restaurant.name,
    ownerName: restaurant.ownerName,
    contactPhone: restaurant.contactPhone,
    contactEmail: restaurant.contactEmail,
    address: restaurant.address,
    city: restaurant.city,
    area: restaurant.area,
    cuisine: restaurant.cuisine,
    taxNumber: restaurant.taxNumber,
    businessLicense: restaurant.businessLicense,
    tables: String(restaurant.tables),
  }));

  const handleChange = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    onUpdate?.({ ...form, tables: Number(form.tables) });
    setIsEditing(false);
  };

  return (
    <div className="elegant-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Restaurant Details</h3>
        </div>
        {isEditing ? (
          <div className="flex gap-1">
            <button onClick={() => setIsEditing(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            <button onClick={handleSave} className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"><Check className="h-4 w-4" /></button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors">
            <Pencil className="h-3 w-3" /> Edit
          </button>
        )}
      </div>
      {isEditing ? <ProfileInfoEdit form={form} onChange={handleChange} /> : <ProfileInfoDisplay restaurant={restaurant} />}
    </div>
  );
}
