"use client";

import type { UseFormReturn } from "react-hook-form";
import { FileText, Hash, Armchair, Lock, UserCircle, KeyRound } from "lucide-react";
import { FormInput } from "./restaurant-form-field";
import { RestaurantLicenseUpload } from "./restaurant-license-upload";
import type { RestaurantFormData } from "./restaurant-create-schema";

interface RestaurantBusinessFieldsProps {
  form: UseFormReturn<RestaurantFormData>;
}

export function RestaurantBusinessFields({ form }: RestaurantBusinessFieldsProps) {
  const { register, formState: { errors }, setValue, watch } = form;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput label="Tax Number (TRN)" icon={Hash} {...register("taxNumber")} error={errors.taxNumber?.message} placeholder="TRN-123456789" />
        <FormInput label="Business License Number" icon={FileText} {...register("businessLicense")} error={errors.businessLicense?.message} placeholder="BL-987654321" />
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
          <FileText className="h-3.5 w-3.5 text-slate-400" />
          Business License Document
        </label>
        <RestaurantLicenseUpload licenseUrl={watch("licenseUrl")} onChange={(url) => setValue("licenseUrl", url, { shouldValidate: true })} />
        {errors.licenseUrl && <p className="text-xs font-medium text-red-500">{errors.licenseUrl.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput label="Number of Tables" icon={Armchair} type="number" {...register("tables")} error={errors.tables?.message} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Dashboard Login</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormInput label="Dashboard Username" icon={UserCircle} {...register("dashboardUsername")} error={errors.dashboardUsername?.message} placeholder="e.g., admin_mosaic" />
          <FormInput label="Dashboard Password" icon={Lock} type="password" {...register("dashboardPassword")} error={errors.dashboardPassword?.message} placeholder="Min 6 characters" />
        </div>
        <div className="grid grid-cols-1 gap-3">
          <FormInput label="Confirm Password" icon={KeyRound} type="password" {...register("confirmPassword")} error={errors.confirmPassword?.message} placeholder="Re-enter password" />
        </div>
        <p className="text-[10px] text-slate-400">The restaurant owner will use these credentials to log in to their dashboard at admin-{watch("slug") || "slug"}.mydomain.com</p>
      </div>
    </div>
  );
}
