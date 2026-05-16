"use client";

import { useState, useRef } from "react";
import { FileText } from "lucide-react";
import { LicenseCardDisplay } from "./license-card-display";
import { LicenseCardEdit } from "./license-card-edit";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

interface SettingsLicenseCardProps {
  restaurant: AdminRestaurant;
  onUpdate?: (updates: Partial<AdminRestaurant>) => void;
}

export function SettingsLicenseCard({ restaurant, onUpdate }: SettingsLicenseCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [licenseNum, setLicenseNum] = useState(restaurant.businessLicense);
  const [licenseUrl, setLicenseUrl] = useState(restaurant.licenseUrl);
  const fileInputRef = useRef<HTMLInputElement>(null!) as React.RefObject<HTMLInputElement>;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLicenseUrl(URL.createObjectURL(file));
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
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
          <FileText className="h-5 w-5 text-amber-600" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Business License</h3>
      </div>
      {isEditing ? (
        <LicenseCardEdit
          licenseNum={licenseNum}
          licenseUrl={licenseUrl}
          onLicenseNumChange={setLicenseNum}
          onRemoveUrl={handleRemove}
          onFileSelect={() => fileInputRef.current?.click()}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
        />
      ) : (
        <LicenseCardDisplay restaurant={restaurant} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
}
