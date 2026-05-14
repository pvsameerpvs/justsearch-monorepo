"use client";

import type { UseFormReturn } from "react-hook-form";
import { MapPin, UtensilsCrossed } from "lucide-react";
import { FormInput, FormSelect } from "./restaurant-form-field";
import type { RestaurantFormData } from "./restaurant-create-form";

interface RestaurantLocationFieldsProps {
  form: UseFormReturn<RestaurantFormData>;
}

const CUISINES = ["Mediterranean", "Italian", "Indian", "Arabic", "Chinese", "Japanese", "Mexican", "American", "French", "Thai", "Korean", "Other"];

export function RestaurantLocationFields({ form }: RestaurantLocationFieldsProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <FormInput label="Full Address" icon={MapPin} {...register("address")} error={errors.address?.message} placeholder="Street, Building, Floor, Shop number" />
      </div>
      <FormInput label="City" icon={MapPin} {...register("city")} error={errors.city?.message} placeholder="e.g., Dubai" />
      <FormInput label="Area / Neighborhood" icon={MapPin} {...register("area")} error={errors.area?.message} placeholder="e.g., Marina" />
      <div className="sm:col-span-2">
        <FormSelect label="Cuisine Type" icon={UtensilsCrossed} {...register("cuisine")} error={errors.cuisine?.message}>
          <option value="">Select cuisine type</option>
          {CUISINES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </FormSelect>
      </div>
    </div>
  );
}
