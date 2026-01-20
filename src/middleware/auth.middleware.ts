import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { HttpError } from "../errors/http-error";

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticateToken = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // Get token from header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token is required"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export const isAdmin = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};