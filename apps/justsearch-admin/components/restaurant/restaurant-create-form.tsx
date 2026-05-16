"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, AlertCircle } from "lucide-react";
import { generateSlug } from "@/lib/slug-utils";
import { RestaurantBasicFields } from "./restaurant-basic-fields";
import { RestaurantLocationFields } from "./restaurant-location-fields";
import { RestaurantBusinessFields } from "./restaurant-business-fields";
import { RestaurantSlugField } from "./restaurant-slug-field";
import { RestaurantCreateTabs, type TabKey } from "./restaurant-create-tabs";
import { restaurantSchema } from "./restaurant-create-schema";
import type { RestaurantFormData } from "./restaurant-create-schema";

type RestaurantCreateFormProps = {
  onSubmit: (data: RestaurantFormData) => void;
  onCancel: () => void;
};

const TAB_FIELDS: Record<TabKey, (keyof RestaurantFormData)[]> = {
  basic: ["name", "ownerName", "contactPhone", "contactEmail", "photos"],
  location: ["address", "city", "area", "cuisine"],
  business: ["taxNumber", "businessLicense", "licenseUrl", "tables", "dashboardUsername", "dashboardPassword", "confirmPassword"],
};

function getTabWithError(errors: Record<string, unknown>): TabKey | null {
  const errorFields = Object.keys(errors);
  for (const tab of ["basic", "location", "business"] as TabKey[]) {
    if (TAB_FIELDS[tab].some((f) => errorFields.includes(f))) return tab;
  }
  return null;
}

export function RestaurantCreateForm({ onSubmit, onCancel }: RestaurantCreateFormProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      ownerName: "",
      contactPhone: "",
      contactEmail: "",
      address: "",
      city: "",
      area: "",
      taxNumber: "",
      businessLicense: "",
      licenseUrl: "",
      photos: [],
      cuisine: "",
      tables: 10,
      dashboardUsername: "",
      dashboardPassword: "",
      confirmPassword: "",
    },
  });

  const handleNameChange = (value: string) => {
    form.setValue("name", value, { shouldValidate: true });
    if (!form.getValues("slug")) {
      form.setValue("slug", generateSlug(value), { shouldValidate: true });
    }
  };

  const errors = form.formState.errors;
  const tabErrors: Record<TabKey, boolean> = {
    basic: TAB_FIELDS.basic.some((f) => !!errors[f]),
    location: TAB_FIELDS.location.some((f) => !!errors[f]),
    business: TAB_FIELDS.business.some((f) => !!errors[f]),
  };

  const handleInvalid = () => {
    const tab = getTabWithError(errors);
    if (tab) setActiveTab(tab);
    setSubmitError("Please fix the highlighted errors before submitting.");
  };

  const handleFormSubmit = async (data: RestaurantFormData) => {
    setSubmitError(null);
    try {
      await onSubmit(data);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to create restaurant. Please try again.");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit, handleInvalid)} className="space-y-5">
      {submitError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {submitError}
        </div>
      )}

      <RestaurantCreateTabs activeTab={activeTab} onTabClick={setActiveTab} tabErrors={tabErrors} />

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {activeTab === "basic" && <RestaurantBasicFields form={form} onNameChange={handleNameChange} />}
        {activeTab === "location" && <RestaurantLocationFields form={form} />}
        {activeTab === "business" && <RestaurantBusinessFields form={form} />}
      </div>

      <RestaurantSlugField slug={form.watch("slug")} onChange={(s) => form.setValue("slug", s, { shouldValidate: true })} error={errors.slug?.message} />

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel} className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={form.formState.isSubmitting} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-amber-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          {form.formState.isSubmitting ? "Creating..." : <>Create Restaurant <ArrowRight className="h-4 w-4" /></>}
        </button>
      </div>
    </form>
  );
}
