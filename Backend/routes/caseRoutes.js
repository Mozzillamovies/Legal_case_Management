import multer from "multer";
import express from "express";
import path from "path";
import Case from "../models/Case.js";

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // store in uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});

const upload = multer({ storage });

// POST /api/cases/add

router.post("/add", upload.array("documents"), async (req, res) => {
  try {
      const caseData = {
        caseTitle: req.body.caseTitle,
        caseDescription: req.body.caseDescription,
        caseType: req.body.caseType,
        clientName: req.body.clientName,
        opponentName: req.body.opponentName,
        courtName: req.body.courtName,
        caseDate: req.body.caseDate,
        caseStatus: req.body.caseStatus,
        documents: req.files && req.files.length > 0
          ? req.files.map(file => `/uploads/${file.filename}`)
          : []
      };


    const newCase = new Case(caseData);
    await newCase.save();

    res.status(201).json({ message: "Case created successfully", case: newCase });
  } catch (error) {
    console.error("Error creating case:", error);
    res.status(500).json({ message: "Error creating case", error: error.message });
  }
});
      // GET /api/cases - Fetch all cases
    router.get("/", async (req, res) => {
      try {
        const cases = await Case.find().sort({ createdAt: -1 }); // latest first
        res.json(cases);
      } catch (error) {
        console.error("Error fetching cases:", error);
        res.status(500).json({ message: "Error fetching cases", error: error.message });
      }
    });


export default router;
