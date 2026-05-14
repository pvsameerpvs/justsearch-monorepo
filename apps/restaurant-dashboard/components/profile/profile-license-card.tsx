"use client";

import { FileText, ExternalLink } from "lucide-react";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

interface ProfileLicenseCardProps {
  restaurant: AdminRestaurant;
}

export function ProfileLicenseCard({ restaurant }: ProfileLicenseCardProps) {
  const hasLicense = restaurant.licenseUrl && restaurant.licenseUrl.length > 0;

  return (
    <div className="elegant-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
          <FileText className="h-5 w-5 text-amber-600" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Business License</h3>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl border border-slate-100 bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">License Number</p>
          <p className="text-sm font-medium text-slate-700">{restaurant.businessLicense}</p>
        </div>

        {hasLicense ? (
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
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
    </div>
  );
}
