"use client";

import { User, Phone, Mail, MapPin, Tag, Building2, Briefcase, Lock, UserCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AdminRestaurant } from "@/lib/stores/restaurant-store";

interface RestaurantDetailFormProps {
  restaurant: AdminRestaurant;
  isEditing: boolean;
  form: Partial<AdminRestaurant>;
  onChange: (field: keyof AdminRestaurant, value: string | number) => void;
}

export function RestaurantDetailForm({ restaurant, isEditing, form, onChange }: RestaurantDetailFormProps) {
  const data = { ...restaurant, ...form };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <Briefcase className="h-4 w-4 text-slate-400" />
        Restaurant Details
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Restaurant Name" value={data.name} isEditing={isEditing} onChange={(v) => onChange("name", v)} icon={Building2} />
        <Field label="Owner Name" value={data.ownerName} isEditing={isEditing} onChange={(v) => onChange("ownerName", v)} icon={User} />
        <Field label="Contact Phone" value={data.contactPhone} isEditing={isEditing} onChange={(v) => onChange("contactPhone", v)} icon={Phone} />
        <Field label="Contact Email" value={data.contactEmail} isEditing={isEditing} onChange={(v) => onChange("contactEmail", v)} icon={Mail} />
        <Field label="Address" value={data.address} isEditing={isEditing} onChange={(v) => onChange("address", v)} icon={MapPin} full />
        <Field label="City" value={data.city} isEditing={isEditing} onChange={(v) => onChange("city", v)} icon={MapPin} />
        <Field label="Area" value={data.area} isEditing={isEditing} onChange={(v) => onChange("area", v)} icon={MapPin} />
        <Field label="Cuisine" value={data.cuisine} isEditing={isEditing} onChange={(v) => onChange("cuisine", v)} icon={Tag} />
        <Field label="Tables" value={String(data.tables)} isEditing={isEditing} onChange={(v) => onChange("tables", Number(v))} icon={Building2} type="number" />
        <Field label="Tax Number" value={data.taxNumber} isEditing={isEditing} onChange={(v) => onChange("taxNumber", v)} icon={Building2} />
        <Field label="Business License" value={data.businessLicense} isEditing={isEditing} onChange={(v) => onChange("businessLicense", v)} icon={Building2} />
        <Field label="Slug" value={data.slug} isEditing={isEditing} onChange={(v) => onChange("slug", v)} icon={Building2} />
        <Field label="Dashboard Username" value={data.dashboardUsername || ""} isEditing={isEditing} onChange={(v) => onChange("dashboardUsername", v)} icon={UserCircle} />
        <Field label="Dashboard Password" value={data.dashboardPassword || ""} isEditing={isEditing} onChange={(v) => onChange("dashboardPassword", v)} icon={Lock} type="password" />
      </div>
    </div>
  );
}

function Field({ label, value, isEditing, onChange, icon: Icon, full, type = "text" }: {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (v: string) => void;
  icon: LucideIcon;
  full?: boolean;
  type?: string;
}) {
  return (
    <div className={`rounded-xl border border-slate-100 bg-white p-3 ${full ? "sm:col-span-2" : ""}`}>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3 w-3 text-slate-400" />
        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</label>
      </div>
      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm focus:border-amber-500 focus:outline-none"
        />
      ) : (
        <p className="text-sm font-medium text-slate-700">{value}</p>
      )}
    </div>
  );
}
