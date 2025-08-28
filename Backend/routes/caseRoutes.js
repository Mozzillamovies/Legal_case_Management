  import express from "express";
  import upload from "../middleware/upload.js"; 
  import Case from "../models/Case.js";

  const router = express.Router();

  // ✅ GET all cases
  router.get("/", async (req, res) => {
    try {
      const cases = await Case.find();
      res.status(200).json(cases);
    } catch (err) {
      console.error("❌ Error fetching cases:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });

  // ✅ POST new case
  router.post("/", upload.array("documents"), async (req, res) => {
    try {
      const clientDetails = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        idProofType: req.body.idProofType,
        idProofNumber: req.body.idProofNumber
      };

      let actsSections = [];
      if (req.body.actsSections) {
        actsSections = JSON.parse(req.body.actsSections);
      }

      const documents = (req.files || []).map((file, index) => ({
        type: req.body[`docType_documents_${index}`] || "Other",
        title: req.body[`docTitle_documents_${index}`] || file.originalname,
        description: req.body[`docDesc_documents_${index}`] || "",
        fileName: file.originalname,
        // ✅ FIXED: store relative path for preview/download
        filePath: `/uploads/${file.filename}`
      }));

      const newCase = new Case({
        district: req.body.district,
        taluk: req.body.taluk,
        court: req.body.court,
        caseType: req.body.caseType,
        subject: req.body.subject,
        description: req.body.description,
        clientDetails,
        actsSections,
        documents,
        createdBy: req.user?._id || null
      });

      await newCase.save();
      res.status(201).json({ message: "Case created successfully", case: newCase });
    } catch (err) {
      console.error("❌ Error creating case:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });

  export default router;
