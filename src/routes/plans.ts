import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { optional } from "../middleware/auth.js";

const router = Router();

// ============================================
// GET /api/plans
// ============================================
router.get("/", optional, async (req: Request, res: Response) => {
  try {
    const plans = await prisma.plan.findMany({
      where: {
        active: true,
      },
      orderBy: {
        price: "asc",
      },
    });

    res.json({
      plans,
      total: plans.length,
    });
  } catch (error) {
    throw error;
  }
});

// ============================================
// GET /api/plans/:id
// ============================================
router.get("/:id", optional, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const plan = await prisma.plan.findUnique({
      where: { id },
    });

    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    res.json({ plan });
  } catch (error) {
    throw error;
  }
});

export default router;
