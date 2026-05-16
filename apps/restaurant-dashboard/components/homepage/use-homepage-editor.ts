import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { RestaurantProfile } from "@/lib/hooks/use-restaurant-query";

export const homepageSchema = z.object({
  heroImageUrl: z.string().optional(),
  logoUrl: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  description: z.string().min(1, "Description is required").max(300, "Description must be under 300 characters"),
  category: z.string().min(1, "Category is required"),
  cuisine: z.string().min(1, "At least one cuisine tag is required"),
  hours: z.string().min(1, "Hours are required"),
});

export type HomepageFormData = z.infer<typeof homepageSchema>;

function sanitizeCuisineTags(cuisine: unknown): string[] {
  const arr = Array.isArray(cuisine) ? cuisine : String(cuisine ?? "").split(",");
  return arr
    .map((c) => String(c).trim())
    .filter((c) => c.length > 0 && !c.includes("required") && !c.includes("error"))
    .filter((c, i, a) => a.indexOf(c) === i);
}

export function useHomepageEditor(restaurant: RestaurantProfile) {
  const cleanCuisine = sanitizeCuisineTags(restaurant.cuisine);
  const cuisineString = cleanCuisine.join(", ");

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
      hours: restaurant.openingHours.find((h) => h.isToday)?.hours ?? restaurant.openingHours[0]?.hours ?? "",
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
      openingHours: restaurant.openingHours.map((h) => h.isToday ? { ...h, hours: values.hours } : h),
    };
  };

  return { ...form, buildUpdate };
}
