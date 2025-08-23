import mongoose from "mongoose";

const caseSchema = new mongoose.Schema({
  caseTitle: { type: String, required: true },
  caseDescription: { type: String, required: true },
  caseType: { type: String, required: true },
  clientName: { type: String, required: true },
  opponentName: { type: String, required: true },
  courtName: { type: String, required: true },
  caseDate: { type: Date, required: true },
  caseStatus: { type: String, required: true },
  documents: [String] // file paths
}, { timestamps: true });

const Case = mongoose.model("Case", caseSchema);

export default Case;
