// upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

// Allowed file types
const allowedTypes = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

// File filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isExtOk = [".pdf", ".jpg", ".jpeg", ".png"].includes(ext);
  const isMimeOk = allowedTypes.includes(file.mimetype);

  if (isExtOk && isMimeOk) {
    cb(null, true);
  } else {
    console.error("❌ Rejected file:", file.originalname, file.mimetype);
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
