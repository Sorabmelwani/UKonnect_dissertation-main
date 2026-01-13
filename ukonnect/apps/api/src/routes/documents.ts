import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { upload } from "../middleware/upload.js";
import { listDocuments, createDocument } from "../services/documentService.js";
import { z } from "zod";
import { HttpError } from "../utils/httpError.js";

export const documentsRouter = Router();

documentsRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const docs = await listDocuments(req.user!.id);
    res.json({ ok: true, documents: docs });
  } catch (e) {
    next(e);
  }
});

documentsRouter.post("/upload", requireAuth, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) throw new HttpError(400, "No file uploaded");

    const schema = z.object({
      category: z.enum(["IDENTITY","VISA","FINANCE","HEALTH","EDUCATION","HOUSING","OTHER"]).optional(),
      notes: z.string().max(300).optional()
    });
    const body = schema.parse(req.body);

    const doc = await createDocument(req.user!.id, req.file, body.category as any, body.notes);
    res.status(201).json({ ok: true, document: doc });
  } catch (e) {
    next(e);
  }
});
