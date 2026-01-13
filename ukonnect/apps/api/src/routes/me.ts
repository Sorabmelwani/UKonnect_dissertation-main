import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { HttpError } from "../utils/httpError.js";

export const meRouter = Router();

const visaVerificationSchema = z.object({
  visaShareCode: z.string().min(1, "Visa share code is required"),
  visaExpiryDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
});

/**
 * GET /me/profile
 */
meRouter.get("/profile", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      email: true,
      profile: true,
    },
  });

  if (!user?.profile) {
    return res.json({ email: user?.email, profile: null });
  }

  res.json({ email: user.email, profile: user.profile });
});

/**
 * PUT /me/profile
 */
meRouter.put("/profile", requireAuth, async (req, res) => {
  const { fullName, nationality, city, visaType } = req.body;

  const profile = await prisma.profile.upsert({
    where: { userId: req.user!.id },
    update: {
      fullName,
      nationality,
      city,
      visaType,
    },
    create: {
      userId: req.user!.id,
      fullName,
      nationality,
      city,
      visaType,
    },
  });

  res.json(profile);
});

/**
 * POST /me/verify-visa
 * Store visa share code and expiry date
 */
meRouter.post("/verify-visa", requireAuth, async (req, res, next) => {
  try {
    const { visaShareCode, visaExpiryDate } = visaVerificationSchema.parse(req.body);

    const profile = await prisma.profile.upsert({
      where: { userId: req.user!.id },
      update: {
        visaShareCode,
        visaExpiryDate: new Date(visaExpiryDate),
      },
      create: {
        userId: req.user!.id,
        visaShareCode,
        visaExpiryDate: new Date(visaExpiryDate),
      },
    });

    res.json({ ok: true, message: "Visa information stored successfully", profile });
  } catch (err) {
    next(err);
  }
});
