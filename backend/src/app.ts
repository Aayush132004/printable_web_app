// FILE: services/api/src/app.ts
// Express app — registers middleware and all route groups

import express from "express";
import cors from "cors";
import { orderRouter } from "./order/order.routes";
import { fileRouter } from "./file/file.routes";
import { paymentRouter } from "./payment/payment.routes";

import { connectDB } from "./db";
import { cleanupR2Files } from "./file/r2.service";

const app = express();

// Ensure DB is connected for every request (crucial for serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Allow requests from Next.js frontend and Electron desktop
app.use(cors());

// Parse JSON bodies — except for Razorpay webhook (needs raw body for signature verification)
app.use((req, res, next) => {
  if (req.originalUrl === "/payment/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Route groups
app.use("/orders", orderRouter);
app.use("/", fileRouter);       // GET /upload-signature
app.use("/payment", paymentRouter); // POST /payment/webhook

// Cleanup route for Vercel Cron
app.get("/cleanup-files", async (req, res) => {
  try {
    await cleanupR2Files();
    res.json({ success: true, message: "R2 Cleanup completed" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Cleanup failed" });
  }
});

export default app;