import express from "express";
import Case from "../models/Case.js";

const router = express.Router();

// ------------------- CASE ROUTES -------------------

// ✅ Get all cases
router.get("/", async (req, res) => {
  try {
    const cases = await Case.find();
    res.status(200).json(cases);
  } catch (err) {
    console.error("❌ Error fetching cases:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Get a case by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const foundCase = await Case.findById(id);

    if (!foundCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.status(200).json(foundCase);
  } catch (err) {
    console.error("❌ Error fetching case:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Create new case
router.post("/", async (req, res) => {
  try {
    console.log("📩 Incoming payload:", JSON.stringify(req.body, null, 2));

    const newCase = new Case(req.body);
    await newCase.save();

    res.status(201).json({ message: "Case created successfully", case: newCase });
  } catch (err) {
    console.error("❌ Error creating case:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors,
      });
    }

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Duplicate caseNumber detected",
        keyValue: err.keyValue,
      });
    }

    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Update entire case (used by EditCaseModal)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCase = await Case.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.status(200).json(updatedCase);
  } catch (err) {
    console.error("❌ Error updating case:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Update ONLY hearingDate + caseStatus (used by HearingUpdateModal)
router.patch("/:id/hearing", async (req, res) => {
  try {
    const { id } = req.params;
    const { hearingDate, caseStatus } = req.body;

    const updatedCase = await Case.findByIdAndUpdate(
      id,
      {
        caseStatus,
        "clientDetails.hearingDate": hearingDate || null,
      },
      { new: true, runValidators: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.status(200).json(updatedCase);
  } catch (err) {
    console.error("❌ Error updating hearing date:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Delete case by ID
router.delete("/:id", async (req, res) => {
  try {
    console.log("DELETE request for case:", req.params.id);
    const deletedCase = await Case.findByIdAndDelete(req.params.id);

    if (!deletedCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.status(200).json({ message: "Case deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting case:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
