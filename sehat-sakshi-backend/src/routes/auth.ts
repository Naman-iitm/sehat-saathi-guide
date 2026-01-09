import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { userStore } from "../store/userStore";
import { User, UserResponse, AuthResponse } from "../types/user";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
const SALT_ROUNDS = 12;

// Helper to strip password from user object
const toUserResponse = (user: User): UserResponse => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  profilePic: user.profilePic
});

// Generate JWT token
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as string
  } as jwt.SignOptions);
};

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }

    // Check if user exists
    const existingUser = userStore.findByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      password: hashedPassword,
      createdAt: new Date()
    };

    userStore.create(newUser);

    // Generate token
    const token = generateToken(newUser.id);

    const response: AuthResponse = {
      user: toUserResponse(newUser),
      token
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Find user
    const user = userStore.findByEmail(email);
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Generate token
    const token = generateToken(user.id);

    const response: AuthResponse = {
      user: toUserResponse(user),
      token
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/auth/me - Get current user
router.get("/me", authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const user = userStore.findById(req.userId!);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user: toUserResponse(user) });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/auth/profile - Update profile
router.put("/profile", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, phone, profilePic } = req.body;

    const updated = userStore.update(req.userId!, { name, phone, profilePic });
    if (!updated) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user: toUserResponse(updated) });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/auth/password - Change password
router.put("/password", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "Current and new password are required" });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: "New password must be at least 6 characters" });
      return;
    }

    const user = userStore.findById(req.userId!);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    userStore.update(req.userId!, { password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
