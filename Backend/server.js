import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import helmet from "helmet";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import caseRoutes from "./routes/caseRoutes.js";

dotenv.config();

// ---------- CONNECT DATABASE ----------
connectDB();

const app = express();

// ---------- FIX __dirname FOR ES MODULES ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- MIDDLEWARE ----------
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // allow frontend domain
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ---------- API ROUTES ----------
app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);

// ---------- HEALTH CHECK ----------
app.get("/", (req, res) => {
  res.status(200).json({ status: "✅ API is running..." });
});

// ---------- 404 HANDLER ----------
app.use((req, res) => {
  res.status(404).json({ message: "❌ Route not found" });
});

// ---------- GLOBAL ERROR HANDLER ----------
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    message: "Server error",
    error: process.env.NODE_ENV === "production" ? undefined : err.message,
  });
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`
  );
});
