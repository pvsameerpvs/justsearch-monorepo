"use client";

import { useState, useRef } from "react";
import { FileText, ExternalLink, Trash2, Upload, Pencil, Check, X } from "lucide-react";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

interface SettingsLicenseCardProps {
  restaurant: AdminRestaurant;
  onUpdate?: (updates: Partial<AdminRestaurant>) => void;
}

export function SettingsLicenseCard({ restaurant, onUpdate }: SettingsLicenseCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [licenseNum, setLicenseNum] = useState(restaurant.businessLicense);
  const [licenseUrl, setLicenseUrl] = useState(restaurant.licenseUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLicenseUrl(url);
    }
  };

  const handleSave = () => {
    onUpdate?.({ businessLicense: licenseNum, licenseUrl });
    setIsEditing(false);
  };

  const handleRemove = () => {
    setLicenseUrl("");
    onUpdate?.({ licenseUrl: "" });
  };

  return (
    <div className="elegant-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
            <FileText className="h-5 w-5 text-amber-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Business License</h3>
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
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">License Number</label>
            <input value={licenseNum} onChange={(e) => setLicenseNum(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-amber-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">License Document</label>
            {licenseUrl ? (
              <div className="flex items-center gap-2 mt-1">
                <a href={licenseUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-xs text-amber-600 underline">View current document</a>
                <button onClick={handleRemove} className="flex h-7 w-7 items-center justify-center rounded-lg text-red-400 hover:bg-red-50" title="Remove">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-1">No document uploaded</p>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <Upload className="h-3 w-3" /> Upload PDF
            </button>
            <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-100 bg-white p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">License Number</p>
            <p className="text-sm font-medium text-slate-700">{restaurant.businessLicense}</p>
          </div>
          {restaurant.licenseUrl ? (
            <div className="flex items-center gap-3 rounded-xl bg-white border border-slate-200 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                <FileText className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900">License Document</p>
                <p className="text-xs text-slate-500 truncate">{restaurant.licenseUrl}</p>
              </div>
              <a
                href={restaurant.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600 transition-colors"
              >
                <ExternalLink className="h-3 w-3" /> View
              </a>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
              <p className="text-xs text-slate-500">No business license document uploaded</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
