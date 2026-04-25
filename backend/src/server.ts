import "dotenv/config";
import app from "./app";
import { connectDB } from "./db";
import { cleanupR2Files } from "./file/r2.service";

const PORT = process.env.PORT ?? 4000;
const CLEANUP_INTERVAL = 4 * 60 * 60 * 1000; // 4 hours in ms

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✅ SmartPrint API running on http://localhost:${PORT}`);

    // Run R2 cleanup on startup, then every 4 hours
    cleanupR2Files();
    setInterval(() => cleanupR2Files(), CLEANUP_INTERVAL);
    console.log(`🧹 R2 cleanup scheduled every 4 hours`);
  });
}

start().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});