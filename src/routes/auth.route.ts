import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const authController = new AuthController();
const router = Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Protected routes (require authentication)
router.get("/profile", authenticateToken, authController.getProfile);

export default router;