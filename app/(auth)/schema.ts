import { z } from "zod";

// Register Schema - matches backend CreateUserDTO
export const RegisterSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phoneNo: z.string().min(10, "Phone number must be at least 10 characters"),
    country: z.string().min(1, "Country is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterData = z.infer<typeof RegisterSchema>;

// Login Schema - matches backend LoginUserDTO
export const LoginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginData = z.infer<typeof LoginSchema>;