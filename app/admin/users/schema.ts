import { z } from "zod";
export const createUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
  phone: z.string().optional(),
  role: z.enum(["guest", "admin", "super_admin"]),
});
export type CreateUserData = z.infer<typeof createUserSchema>;
export const updateUserRoleSchema = z.object({ role: z.enum(["guest", "admin", "super_admin"]) });
export type UpdateUserRoleData = z.infer<typeof updateUserRoleSchema>;