"use client";

import { useRef } from "react";
import { FileText, ExternalLink, Trash2, Upload } from "lucide-react";
import type { AdminRestaurant } from "@/lib/stores/restaurant-store";

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
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">License Number</p>
          {isEditing ? (
            <input
              value={licenseNum}
              onChange={(e) => onChange("businessLicense", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm focus:border-amber-500 focus:outline-none"
            />
          ) : (
            <p className="text-sm font-medium text-slate-700">{licenseNum}</p>
          )}
        </div>

        {licenseUrl ? (
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <FileText className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900">License Document</p>
              <p className="text-xs text-slate-500 truncate">{licenseUrl}</p>
            </div>
            <a
              href={licenseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600"
            >
              <ExternalLink className="h-3 w-3" /> View
            </a>
            {isEditing && (
              <button onClick={handleRemove} className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
            <p className="text-xs text-slate-500">No business license document uploaded</p>
          </div>
        )}

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
