import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { RestaurantProfile } from "@/lib/hooks/use-restaurant-query";

export const homepageSchema = z.object({
  heroImageUrl: z.string().optional(),
  logoUrl: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  category: z.string().min(1, "Category is required"),
  cuisine: z.string().min(1, "At least one cuisine tag is required"),
  hours: z.string().min(1, "Hours are required"),
});

export type HomepageFormData = z.infer<typeof homepageSchema>;

export function useHomepageEditor(restaurant: RestaurantProfile) {
  const form = useForm<HomepageFormData>({
    resolver: zodResolver(homepageSchema),
    defaultValues: {
      heroImageUrl: restaurant.heroImageUrl ?? "",
      logoUrl: restaurant.logoUrl ?? "",
      name: restaurant.name,
      tagline: restaurant.tagline,
      category: restaurant.category,
      cuisine: restaurant.cuisine.join(", "),
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
      category: values.category,
      cuisine: values.cuisine.split(",").map((c) => c.trim()).filter(Boolean),
      openingHours: restaurant.openingHours.map((h) => h.isToday ? { ...h, hours: values.hours } : h),
    };
  };

  return { ...form, buildUpdate, hasChanges: form.formState.isDirty };
}
