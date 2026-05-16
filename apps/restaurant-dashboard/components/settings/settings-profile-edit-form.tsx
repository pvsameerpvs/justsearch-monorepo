import { User, Phone, Mail, MapPin, Tag } from "lucide-react";
import { EditField } from "../profile/profile-info-parts";
import { ImageUpload } from "@/components/ui/image-upload";

interface SettingsProfileEditFormProps {
  form: {
    ownerName: string;
    contactPhone: string;
    contactEmail: string;
    address: string;
    cuisine: string;
    logoUrl: string;
  };
  onChange: (key: keyof SettingsProfileEditFormProps["form"], value: string) => void;
}

export function SettingsProfileEditForm({ form, onChange }: SettingsProfileEditFormProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Logo</label>
        <div className="mt-1">
          <ImageUpload value={form.logoUrl} onChange={(v) => onChange("logoUrl", v)} label="Restaurant Logo" aspect="square" size="compact" folder="restaurants" />
        </div>
      </div>
      <EditField label="Owner Name" value={form.ownerName} onChange={(v) => onChange("ownerName", v)} icon={User} />
      <EditField label="Contact Phone" value={form.contactPhone} onChange={(v) => onChange("contactPhone", v)} icon={Phone} />
      <EditField label="Contact Email" value={form.contactEmail} onChange={(v) => onChange("contactEmail", v)} icon={Mail} />
      <EditField label="Address" value={form.address} onChange={(v) => onChange("address", v)} icon={MapPin} />
      <EditField label="Cuisine" value={form.cuisine} onChange={(v) => onChange("cuisine", v)} icon={Tag} />
    </div>
  );
}
