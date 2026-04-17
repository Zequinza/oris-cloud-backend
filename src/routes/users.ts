import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";

const router = Router();

// ============================================
// GET /api/users/:id
// ============================================
router.get("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        subscriptions: {
          select: {
            id: true,
            status: true,
            expiresAt: true,
            plan: {
              select: {
                id: true,
                name: true,
                vCpus: true,
                ramGB: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    res.json({ user });
  } catch (error) {
    throw error;
  }
});

// ============================================
// PUT /api/users/:id
// ============================================
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;

    // Check if user is updating their own profile
    if (id !== req.user!.userId) {
      throw new AppError(403, "Unauthorized");
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(image && { image }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    });

    res.json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    throw error;
  }
});

// ============================================
// DELETE /api/users/:id
// ============================================
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if user is deleting their own account
    if (id !== req.user!.userId) {
      throw new AppError(403, "Unauthorized");
    }

    await prisma.user.delete({
      where: { id },
    });

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    throw error;
  }
});

export default router;
