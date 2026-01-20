import z from "zod";
import { UserSchema } from "../types/user.type";

// Register DTO - matches your registration form
export const CreateUserDTO = UserSchema.pick({
    name: true,
    email: true,
    phoneNo: true,
    country: true,
    username: true,
    password: true
});

export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

// Login DTO - matches your login form
export const LoginUserDTO = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

export type LoginUserDTO = z.infer<typeof LoginUserDTO>;