import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import helmet from "helmet";
import fs from "fs";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import caseRoutes from "./routes/caseRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- MIDDLEWARE ----------
app.use(cors()); // Allow cross-origin requests
app.use(express.json({ limit: "10mb" })); // Parse JSON with size limit
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(helmet()); // Add security headers
app.use(morgan("dev")); // Logging requests

// ✅ Serve uploaded files for preview in browser
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Force download route (works with nested folders too)
app.get("/download/*", (req, res) => {
  // Remove '/download/' prefix and join with /uploads
  const relativePath = req.params[0]; // everything after /download/
  const file = path.join(__dirname, "uploads", relativePath);

  if (fs.existsSync(file)) {
    res.download(file, path.basename(file)); // force download
  } else {
    res.status(404).json({ message: "❌ File not found" });
  }
});


// ---------- API ROUTES ----------
app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);

// ---------- HEALTH CHECK ----------
app.get("/", (req, res) => {
  res.status(200).json({ status: "✅ API is running..." });
});

// ---------- 404 HANDLER ----------
app.use((req, res, next) => {
  res.status(404).json({ message: "❌ Route not found" });
});

// ---------- GLOBAL ERROR HANDLER ----------
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    message: "Server error",
    error: err.message,
  });
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
