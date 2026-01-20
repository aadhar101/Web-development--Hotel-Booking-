import { UserService } from "../services/user.service";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { Request, Response } from "express";
import { z } from "zod";

const userService = new UserService();

export class AuthController {
    
    async register(req: Request, res: Response) {
        try {
            // Validate request body
            const parsedData = CreateUserDTO.safeParse(req.body);
            
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: parsedData.error.issues
                });
            }

            const userData: CreateUserDTO = parsedData.data;
            const newUser = await userService.createUser(userData);

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: newUser
            });

        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async login(req: Request, res: Response) {
        try {
            // Validate request body
            const parsedData = LoginUserDTO.safeParse(req.body);
            
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: parsedData.error.issues
                });
            }

            const loginData: LoginUserDTO = parsedData.data;
            const { token, user } = await userService.loginUser(loginData);

            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: user,
                token: token
            });

        } catch (error: any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            // For JWT-based auth, logout is handled client-side by removing the token
            // But we can still provide a logout endpoint for consistency
            return res.status(200).json({
                success: true,
                message: "Logout successful"
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }

    async getProfile(req: Request, res: Response) {
        try {
            // User data is attached by auth middleware
            const user = (req as any).user;
            
            return res.status(200).json({
                success: true,
                data: user
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }
}