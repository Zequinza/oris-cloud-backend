import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";

const router = Router();

// ============================================
// GET /api/subscriptions
// ============================================
router.get("/", authenticate, async (req: Request, res: Response) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: req.user!.userId,
      },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      subscriptions,
      total: subscriptions.length,
    });
  } catch (error) {
    throw error;
  }
});

// ============================================
// GET /api/subscriptions/:id
// ============================================
router.get("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        plan: true,
      },
    });

    if (!subscription) {
      throw new AppError(404, "Subscription not found");
    }

    // Check if user owns this subscription
    if (subscription.userId !== req.user!.userId) {
      throw new AppError(403, "Unauthorized");
    }

    res.json({ subscription });
  } catch (error) {
    throw error;
  }
});

// ============================================
// POST /api/subscriptions
// ============================================
router.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const { planId, days } = req.body;

    if (!planId || !days) {
      throw new AppError(400, "planId and days are required");
    }

    // Verify plan exists
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new AppError(404, "Plan not found");
    }

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    // Create subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: req.user!.userId,
        planId,
        expiresAt,
        status: "active",
      },
      include: {
        plan: true,
      },
    });

    res.status(201).json({
      message: "Subscription created successfully",
      subscription,
    });
  } catch (error) {
    throw error;
  }
});

// ============================================
// PUT /api/subscriptions/:id
// ============================================
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const subscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      throw new AppError(404, "Subscription not found");
    }

    // Check if user owns this subscription
    if (subscription.userId !== req.user!.userId) {
      throw new AppError(403, "Unauthorized");
    }

    const updated = await prisma.subscription.update({
      where: { id },
      data: {
        ...(status && { status }),
      },
      include: {
        plan: true,
      },
    });

    res.json({
      message: "Subscription updated successfully",
      subscription: updated,
    });
  } catch (error) {
    throw error;
  }
});

// ============================================
// DELETE /api/subscriptions/:id
// ============================================
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const subscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      throw new AppError(404, "Subscription not found");
    }

    // Check if user owns this subscription
    if (subscription.userId !== req.user!.userId) {
      throw new AppError(403, "Unauthorized");
    }

    await prisma.subscription.delete({
      where: { id },
    });

    res.json({
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    throw error;
  }
});

export default router;
