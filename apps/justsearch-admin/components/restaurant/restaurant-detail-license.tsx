"use client";

import { useRef } from "react";
import { FileText, Upload } from "lucide-react";
import type { AdminRestaurant } from "@/lib/types/restaurant.types";
import { RestaurantLicenseMeta } from "./restaurant-license-meta";
import { RestaurantLicensePreview } from "./restaurant-license-preview";

interface RestaurantDetailLicenseProps {
  restaurant: AdminRestaurant;
  isEditing: boolean;
  form: Partial<AdminRestaurant>;
  onChange: (field: keyof AdminRestaurant, value: string) => void;
  onUpdate: (updates: Partial<AdminRestaurant>) => void;
}

export function RestaurantDetailLicense({ restaurant, isEditing, form, onChange, onUpdate }: RestaurantDetailLicenseProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const licenseUrl = form.licenseUrl ?? restaurant.licenseUrl;
  const licenseNum = form.businessLicense ?? restaurant.businessLicense;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange("licenseUrl", url);
    }
  };

  const handleRemove = () => {
    onChange("licenseUrl", "");
    onUpdate({ licenseUrl: "" });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
        <FileText className="h-4 w-4 text-amber-600" />
        Business License
      </h3>
      <div className="space-y-3">
        <RestaurantLicenseMeta
          licenseNum={licenseNum}
          isEditing={isEditing}
          onChange={(v) => onChange("businessLicense", v)}
        />
        <RestaurantLicensePreview licenseUrl={licenseUrl} isEditing={isEditing} onRemove={handleRemove} />
        {isEditing && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <Upload className="h-3 w-3" />
            {licenseUrl ? "Replace PDF" : "Upload PDF"}
          </button>
        )}
        <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />
      </div>
    </div>
  );
}
