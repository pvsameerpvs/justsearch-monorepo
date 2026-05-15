"use client";

import type { UseFormReturn } from "react-hook-form";
import { Building2, User, Phone, Mail, ImagePlus } from "lucide-react";
import { FormInput } from "./restaurant-form-field";
import { RestaurantPhotoUpload } from "./restaurant-photo-upload";
import type { RestaurantFormData } from "./restaurant-create-schema";

interface RestaurantBasicFieldsProps {
  form: UseFormReturn<RestaurantFormData>;
  onNameChange: (value: string) => void;
}

export function RestaurantBasicFields({ form, onNameChange }: RestaurantBasicFieldsProps) {
  const { register, formState: { errors }, watch, setValue } = form;
  const photos = watch("photos") || [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <FormInput
            label="Restaurant Name"
            icon={Building2}
            {...register("name")}
            onChange={(e) => onNameChange(e.target.value)}
            error={errors.name?.message}
            placeholder="e.g., Mosaic Table"
          />
        </div>
        <FormInput label="Owner / Manager Name" icon={User} {...register("ownerName")} error={errors.ownerName?.message} placeholder="Full name of restaurant owner" />
        <FormInput label="Contact Phone" icon={Phone} {...register("contactPhone")} error={errors.contactPhone?.message} placeholder="+971 50 123 4567" />
        <div className="sm:col-span-2">
          <FormInput label="Contact Email" icon={Mail} type="email" {...register("contactEmail")} error={errors.contactEmail?.message} placeholder="owner@restaurant.ae" />
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
          <ImagePlus className="h-3.5 w-3.5 text-slate-400" />
          Restaurant Photos (max 4)
        </label>
        <RestaurantPhotoUpload photos={photos} onChange={(p) => setValue("photos", p)} />
      </div>
    </div>
  );
}
