"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
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

export function RestaurantCreateForm({ onSubmit, onCancel }: RestaurantCreateFormProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("basic");

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
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
    form.setValue("name", value);
    if (!form.getValues("slug")) {
      form.setValue("slug", generateSlug(value));
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <RestaurantCreateTabs activeTab={activeTab} onTabClick={setActiveTab} />

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {activeTab === "basic" && <RestaurantBasicFields form={form} onNameChange={handleNameChange} />}
        {activeTab === "location" && <RestaurantLocationFields form={form} />}
        {activeTab === "business" && <RestaurantBusinessFields form={form} />}
      </div>

      <RestaurantSlugField slug={form.watch("slug")} onChange={(s) => form.setValue("slug", s)} />

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel} className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
          Cancel
        </button>
        <button type="submit" className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-amber-600 transition-colors">
          Create Restaurant <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
