"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Info, MapPin, FileText, ArrowRight, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { generateSlug } from "@/lib/slug-utils";
import { RestaurantBasicFields } from "./restaurant-basic-fields";
import { RestaurantLocationFields } from "./restaurant-location-fields";
import { RestaurantBusinessFields } from "./restaurant-business-fields";
import { RestaurantSlugField } from "./restaurant-slug-field";

export const restaurantSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  ownerName: z.string().min(2, "Owner name is required"),
  contactPhone: z.string().min(5, "Valid phone number required"),
  contactEmail: z.string().email("Valid email required"),
  address: z.string().min(5, "Full address is required"),
  city: z.string().min(2, "City is required"),
  area: z.string().min(2, "Area is required"),
  taxNumber: z.string().min(3, "Tax number is required"),
  businessLicense: z.string().min(3, "Business license is required"),
  licenseUrl: z.string(),
  photos: z.array(z.string()).max(4, "Maximum 4 photos"),
  cuisine: z.string().min(2, "Cuisine type is required"),
  tables: z.coerce.number().min(1).max(500),
  dashboardUsername: z.string().min(3, "Username is required"),
  dashboardPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.dashboardPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RestaurantFormData = z.infer<typeof restaurantSchema>;

type RestaurantCreateFormProps = {
  onSubmit: (data: RestaurantFormData) => void;
  onCancel: () => void;
};

type TabKey = "basic" | "location" | "business";

const TABS: { key: TabKey; label: string; icon: LucideIcon; desc: string }[] = [
  { key: "basic", label: "Basic Info", icon: Info, desc: "Name & contact" },
  { key: "location", label: "Location", icon: MapPin, desc: "Address & cuisine" },
  { key: "business", label: "Business", icon: FileText, desc: "License & tax" },
];

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

  const handleTabClick = (tab: TabKey) => {
    setActiveTab(tab);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      {/* Elegant Step Tabs */}
      <div className="flex gap-2">
        {TABS.map((t, i) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          const isDone = TABS.findIndex((x) => x.key === activeTab) > i;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => handleTabClick(t.key)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-center transition-all ${
                isActive
                  ? "border-amber-300 bg-amber-50 shadow-sm"
                  : isDone
                  ? "border-emerald-200 bg-emerald-50/50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${isActive ? "bg-amber-500 text-white" : isDone ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                {isDone ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
              </div>
              <p className={`text-[10px] font-bold ${isActive ? "text-amber-700" : isDone ? "text-emerald-700" : "text-slate-500"}`}>{t.label}</p>
            </button>
          );
        })}
      </div>

      {/* Tab Content Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {activeTab === "basic" && <RestaurantBasicFields form={form} onNameChange={handleNameChange} />}
        {activeTab === "location" && <RestaurantLocationFields form={form} />}
        {activeTab === "business" && <RestaurantBusinessFields form={form} />}
      </div>

      {/* Subdomain Preview */}
      <RestaurantSlugField slug={form.watch("slug")} onChange={(s) => form.setValue("slug", s)} />

      {/* Actions */}
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
