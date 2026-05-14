"use client";

import { useState } from "react";
import { User, Phone, Mail, MapPin, Tag, FileText, Building2, Briefcase, Pencil, Check, X, Lock } from "lucide-react";
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
  });

  const handleSave = () => {
    onUpdate?.(form);
    setIsEditing(false);
  };

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
            <button onClick={() => setIsEditing(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            <button onClick={handleSave} className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"><Check className="h-4 w-4" /></button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors">
            <Pencil className="h-3 w-3" /> Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <EditField label="Owner Name" value={form.ownerName} onChange={(v) => setForm({ ...form, ownerName: v })} icon={User} />
          <EditField label="Contact Phone" value={form.contactPhone} onChange={(v) => setForm({ ...form, contactPhone: v })} icon={Phone} />
          <EditField label="Contact Email" value={form.contactEmail} onChange={(v) => setForm({ ...form, contactEmail: v })} icon={Mail} />
          <EditField label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} icon={MapPin} />
          <EditField label="Cuisine" value={form.cuisine} onChange={(v) => setForm({ ...form, cuisine: v })} icon={Tag} />
        </div>
      ) : (
        <div className="space-y-3">
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

function ProfileRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3">
      <Icon className="mt-0.5 h-4 w-4 text-slate-400 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function EditField({ label, value, onChange, icon: Icon }: { label: string; value: string; onChange: (v: string) => void; icon: any }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-slate-400 shrink-0" />
      <div className="flex-1">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</label>
        <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-amber-500 focus:outline-none" />
      </div>
    </div>
  );
}
