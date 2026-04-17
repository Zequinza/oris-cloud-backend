import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";

const router = Router();

// ============================================
// GET /api/disks
// ============================================
router.get("/", authenticate, async (req: Request, res: Response) => {
  try {
    const disks = await prisma.disk.findMany({
      where: {
        userId: req.user!.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      disks,
      total: disks.length,
    });
  } catch (error) {
    throw error;
  }
});

// ============================================
// GET /api/disks/:id
// ============================================
router.get("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const disk = await prisma.disk.findUnique({
      where: { id },
    });

    if (!disk) {
      throw new AppError(404, "Disk not found");
    }

    // Check if user owns this disk
    if (disk.userId !== req.user!.userId) {
      throw new AppError(403, "Unauthorized");
    }

    res.json({ disk });
  } catch (error) {
    throw error;
  }
});

// ============================================
// POST /api/disks
// ============================================
router.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const { name, vCpus, ramGB, sizeGB } = req.body;

    if (!name) {
      throw new AppError(400, "name is required");
    }

    // Calculate expiration date (30 days from now)
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);

    const disk = await prisma.disk.create({
      data: {
        userId: req.user!.userId,
        name,
        vCpus: vCpus || 4,
        ramGB: ramGB || 16,
        sizeGB: sizeGB || 256,
        validUntil,
        isActive: true,
      },
    });

    res.status(201).json({
      message: "Disk created successfully",
      disk,
    });
  } catch (error) {
    throw error;
  }
});

// ============================================
// PUT /api/disks/:id
// ============================================
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const disk = await prisma.disk.findUnique({
      where: { id },
    });

    if (!disk) {
      throw new AppError(404, "Disk not found");
    }

    // Check if user owns this disk
    if (disk.userId !== req.user!.userId) {
      throw new AppError(403, "Unauthorized");
    }

    const updated = await prisma.disk.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(typeof isActive !== "undefined" && { isActive }),
      },
    });

    res.json({
      message: "Disk updated successfully",
      disk: updated,
    });
  } catch (error) {
    throw error;
  }
});

// ============================================
// DELETE /api/disks/:id
// ============================================
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const disk = await prisma.disk.findUnique({
      where: { id },
    });

    if (!disk) {
      throw new AppError(404, "Disk not found");
    }

    // Check if user owns this disk
    if (disk.userId !== req.user!.userId) {
      throw new AppError(403, "Unauthorized");
    }

    await prisma.disk.delete({
      where: { id },
    });

    res.json({
      message: "Disk deleted successfully",
    });
  } catch (error) {
    throw error;
  }
});

export default router;
