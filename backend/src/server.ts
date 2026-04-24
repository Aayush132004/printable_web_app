// FILE: services/api/src/server.ts
// HTTP server entry point — connects to MongoDB then starts listening

import app from "./app";
import { connectDB } from "./db";

const PORT = process.env.PORT ?? 4000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✅ SmartPrint API running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});