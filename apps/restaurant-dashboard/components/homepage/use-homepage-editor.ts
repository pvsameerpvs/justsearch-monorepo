import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { RestaurantProfile } from "@/lib/hooks/use-restaurant-query";
import { DEFAULT_OPENING_HOURS, type OpeningHourRow } from "./opening-hours-editor";

export const homepageSchema = z.object({
  heroImageUrl: z.string().optional(),
  logoUrl: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  description: z.string().min(1, "Description is required").max(300, "Description must be under 300 characters"),
  category: z.string().min(1, "Category is required"),
  cuisine: z.string().min(1, "At least one cuisine tag is required"),
  openingHours: z.array(
    z.object({
      day: z.string(),
      open: z.string(),
      close: z.string(),
      isOpen: z.boolean(),
    })
  ),
});

export type HomepageFormData = z.infer<typeof homepageSchema>;

function sanitizeCuisineTags(cuisine: unknown): string[] {
  const arr = Array.isArray(cuisine) ? cuisine : String(cuisine ?? "").split(",");
  return arr
    .map((c) => String(c).trim())
    .filter((c) => c.length > 0 && !c.includes("required") && !c.includes("error"))
    .filter((c, i, a) => a.indexOf(c) === i);
}

function migrateOpeningHours(
  existing: Array<{ day: string; hours?: string; open?: string; close?: string; isOpen?: boolean; isToday?: boolean }>
): OpeningHourRow[] {
  if (!existing.length) return DEFAULT_OPENING_HOURS.map((h) => ({ ...h }));

  return existing.map((h) => {
    // Migrate from old format (hours: "09:00 – 18:00") to new format
    if (h.hours && !h.open && !h.close) {
      const parts = h.hours.split(/[–\-]/).map((s) => s.trim());
      return {
        day: h.day,
        open: parts[0] || "09:00",
        close: parts[1] || "22:00",
        isOpen: true,
      };
    }
    return {
      day: h.day,
      open: h.open || "09:00",
      close: h.close || "22:00",
      isOpen: h.isOpen ?? true,
    };
  });
}

export function useHomepageEditor(restaurant: RestaurantProfile) {
  const cleanCuisine = sanitizeCuisineTags(restaurant.cuisine);
  const cuisineString = cleanCuisine.join(", ");
  const migratedHours = migrateOpeningHours(restaurant.openingHours);

  const form = useForm<HomepageFormData>({
    resolver: zodResolver(homepageSchema),
    defaultValues: {
      heroImageUrl: restaurant.heroImageUrl ?? "",
      logoUrl: restaurant.logoUrl ?? "",
      name: restaurant.name,
      tagline: restaurant.tagline,
      description: restaurant.description ?? "",
      category: restaurant.category,
      cuisine: cuisineString,
      openingHours: migratedHours,
    },
  });

  const buildUpdate = (): Partial<RestaurantProfile> => {
    const values = form.getValues();
    return {
      heroImageUrl: values.heroImageUrl || undefined,
      logoUrl: values.logoUrl || undefined,
      name: values.name,
      tagline: values.tagline,
      description: values.description,
      category: values.category,
      cuisine: sanitizeCuisineTags(values.cuisine),
      openingHours: values.openingHours.map((h, i) => ({
        ...h,
        isToday: i === new Date().getDay() - 1 || i === 0,
      })),
    };
  };

  return { ...form, buildUpdate };
}
