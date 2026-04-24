// FILE: services/api/src/app.ts
// Express app — registers middleware and all route groups

import express from "express";
import cors from "cors";
import { orderRouter } from "./order/order.routes";
import { fileRouter } from "./file/file.routes";
import { paymentRouter } from "./payment/payment.routes";

const app = express();

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

export default app;