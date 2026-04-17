import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { generateToken } from "../lib/jwt.js";
import { authenticate } from "../middleware/auth.js";
import { RegisterSchema, LoginSchema } from "../schemas/auth.js";
import { AppError } from "../middleware/errorHandler.js";

const router = Router();

// ============================================
// POST /api/auth/register
// ============================================
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, name, password } = RegisterSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError(400, "User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        emailVerified: false, // In production, send verification email
      },
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    throw error;
  }
});

// ============================================
// POST /api/auth/login
// ============================================
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(401, "Invalid credentials");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(401, "Invalid credentials");
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    throw error;
  }
});

// ============================================
// POST /api/auth/logout
// ============================================
router.post("/logout", authenticate, async (req: Request, res: Response) => {
  // In a real app, you might invalidate the token in a blacklist
  res.json({
    message: "Logout successful",
  });
});

// ============================================
// GET /api/auth/me
// ============================================
router.get("/me", authenticate, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    res.json({
      user,
    });
  } catch (error) {
    throw error;
  }
});

export default router;
