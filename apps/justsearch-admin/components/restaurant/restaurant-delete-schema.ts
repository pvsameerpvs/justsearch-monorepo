import { z } from "zod";

export const deleteRestaurantSchema = z.object({
  username: z.string().min(3, "Username is required"),
  password: z.string().min(6, "Password is required"),
  confirmation: z.string().min(1, "Confirmation is required"),
}).refine((data) => data.confirmation === "delete this restaurant", {
  message: 'You must type exactly: "delete this restaurant"',
  path: ["confirmation"],
});

export type DeleteRestaurantFormData = z.infer<typeof deleteRestaurantSchema>;
