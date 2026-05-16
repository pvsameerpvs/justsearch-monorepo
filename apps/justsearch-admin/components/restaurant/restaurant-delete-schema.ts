import { z } from "zod";

export function buildDeleteRestaurantSchema(expectedName: string) {
  return z.object({
    username: z.string().min(3, "Username is required"),
    password: z.string().min(6, "Password is required"),
    confirmation: z.string().min(1, "Confirmation is required"),
  }).refine((data) => data.confirmation === expectedName, {
    message: `You must type exactly: "${expectedName}"`,
    path: ["confirmation"],
  });
}

export type DeleteRestaurantFormData = {
  username: string;
  password: string;
  confirmation: string;
};
