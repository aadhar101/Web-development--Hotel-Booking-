import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { UserRepository } from "../repositories/user.repository";
import bcryptjs from "bcryptjs";
import { HttpError } from "../errors/http-error";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

const userRepository = new UserRepository();

export class UserService {
    
    async createUser(data: CreateUserDTO) {
        // Check if email already exists
        const emailCheck = await userRepository.getUserByEmail(data.email);
        if (emailCheck) {
            throw new HttpError(400, "Email already in use");
        }

        // Check if username already exists
        const usernameCheck = await userRepository.getUserByUsername(data.username);
        if (usernameCheck) {
            throw new HttpError(400, "Username already in use");
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(data.password, 10);
        
        // Create user with hashed password
        const newUser = await userRepository.createUser({
            ...data,
            password: hashedPassword
        });

        // Remove password from response
        const userResponse = {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phoneNo: newUser.phoneNo,
            country: newUser.country,
            username: newUser.username,
            role: newUser.role,
            createdAt: newUser.createdAt,
        };

        return userResponse;
    }

    async loginUser(data: LoginUserDTO) {
        // Find user by username
        const user = await userRepository.getUserByUsername(data.username);
        if (!user) {
            throw new HttpError(401, "Invalid credentials");
        }

        // Compare password
        const validPassword = await bcryptjs.compare(data.password, user.password);
        if (!validPassword) {
            throw new HttpError(401, "Invalid credentials");
        }

        // Generate JWT token
        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });

        // Return user data without password
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            phoneNo: user.phoneNo,
            country: user.country,
            username: user.username,
            role: user.role,
        };

        return { token, user: userResponse };
    }

    async verifyToken(token: string) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            return decoded;
        } catch (error) {
            throw new HttpError(401, "Invalid or expired token");
        }
    }
}