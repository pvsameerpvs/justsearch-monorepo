"use client";

import { EditField } from "./profile-info-parts";
import { Building2, User, Phone, Mail, MapPin, Tag, FileText } from "lucide-react";

interface ProfileInfoEditProps {
  form: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export function ProfileInfoEdit({ form, onChange }: ProfileInfoEditProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <EditField label="Restaurant Name" value={form.name} onChange={(v) => onChange("name", v)} icon={Building2} />
        <EditField label="Owner Name" value={form.ownerName} onChange={(v) => onChange("ownerName", v)} icon={User} />
        <EditField label="Contact Phone" value={form.contactPhone} onChange={(v) => onChange("contactPhone", v)} icon={Phone} />
        <EditField label="Contact Email" value={form.contactEmail} onChange={(v) => onChange("contactEmail", v)} icon={Mail} />
        <EditField label="Address" value={form.address} onChange={(v) => onChange("address", v)} icon={MapPin} full />
        <EditField label="City" value={form.city} onChange={(v) => onChange("city", v)} icon={MapPin} />
        <EditField label="Area" value={form.area} onChange={(v) => onChange("area", v)} icon={MapPin} />
        <EditField label="Cuisine" value={form.cuisine} onChange={(v) => onChange("cuisine", v)} icon={Tag} />
        <EditField label="Tax Number" value={form.taxNumber} onChange={(v) => onChange("taxNumber", v)} icon={FileText} />
        <EditField label="Business License" value={form.businessLicense} onChange={(v) => onChange("businessLicense", v)} icon={FileText} />
        <EditField label="Tables" value={form.tables} onChange={(v) => onChange("tables", v)} icon={Building2} />
      </div>
    </div>
  );
}
