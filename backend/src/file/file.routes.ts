// FILE: services/api/src/file/file.routes.ts
// File-related routes — only one endpoint: GET /upload-signature
// Returns signed Cloudinary credentials so frontend can upload directly

import { Router, Request, Response } from "express";
import { getUploadSignature } from "./cloudinary.service";

export const fileRouter = Router();

// ─── GET /upload-signature ────────────────────────────────────────────────────
// Called by frontend before every upload.
// Returns a short-lived signed URL valid for 1 hour.
fileRouter.get("/upload-signature", (_req: Request, res: Response) => {
  try {
    const signature = getUploadSignature();
    res.json(signature);
  } catch (err) {
    console.error("GET /upload-signature error:", err);
    res.status(500).json({ error: "Failed to generate upload signature" });
  }
});