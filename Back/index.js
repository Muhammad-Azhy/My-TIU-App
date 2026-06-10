import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import authRoutes from "./routes/authRoutes.js";
import guestRoutes from "./routes/guestRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import lecturerRoutes from "./routes/lecturerRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.set("etag", false); // Disable ETags so API never returns 304 stale data
const PORT = Number(process.env.PORT || 3000);

const missingDbEnv = ["DB_HOST", "DB_USER", "DB_NAME"].filter(
  (k) => !process.env[k] || String(process.env[k]).trim() === "",
);
if (missingDbEnv.length) {
  console.warn(
    "[MyTIU] Warning: missing database env vars:",
    missingDbEnv.join(", "),
    "— login and data routes will fail until .env is configured. See Back/.env.example",
  );
}

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "MyTIU API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/guest", guestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/lecturer", lecturerRoutes);
app.use("/api/student", studentRoutes);

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal server error",
  });
});

const HOST = process.env.HOST || "0.0.0.0";

function logLanAddresses() {
  const urls = [];
  for (const iface of Object.values(os.networkInterfaces())) {
    if (!iface) continue;
    for (const addr of iface) {
      if (addr.family === "IPv4" && !addr.internal) {
        urls.push(`http://${addr.address}:${PORT}/api`);
      }
    }
  }
  if (urls.length) {
    console.log("[MyTIU] Mobile API base URLs (set EXPO_PUBLIC_API_BASE_URL_DEVICE):");
    urls.forEach((u) => console.log(`  ${u}`));
  }
}

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
  console.log(`API health: http://localhost:${PORT}/api/health`);
  logLanAddresses();
});
