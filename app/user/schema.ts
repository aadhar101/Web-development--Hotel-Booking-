
import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  avatar: z.string().url("Avatar must be a valid image URL").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional(),
  }).optional(),
  preferences: z.object({
    currency: z.string().optional(),
    language: z.string().optional(),
    notifications: z.boolean().optional(),
  }).optional(),
});
export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
