import mongoose from "mongoose";
import Counter from "./counter.js";

const clientDetailsSchema = new mongoose.Schema({
  clientName: { type: String, required: [true, "Client name is required"] },
  phone: { type: String, required: [true, "Phone number is required"] },
  idProofType: { type: String, required: [true, "ID proof type is required"] },
  idProofNumber: { type: String, required: [true, "ID proof number is required"] },
  address: { type: String, required: [true, "Address is required"] },
  hearingDate: { type: Date, required: [true, "Hearing date is required"] }
});

const caseSchema = new mongoose.Schema(
  {
    // Step 1: Case Details
    district: { type: String, required: true },
    taluk: { type: String, required: true },
    court: { type: String, required: true },
    caseType: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String },

    // Step 2: Client Details
    clientDetails: {
      type: clientDetailsSchema,
      required: true,
    },

    // Case Management Fields
    caseNumber: { type: String, unique: true },
    caseStatus: {
      type: String,
      enum: ["Draft", "Submitted", "Under Review", "Active", "Closed"],
      default: "Submitted",
    },
    filedDate: { type: Date, default: Date.now },
    assignedLawyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Metadata
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-generate case number
caseSchema.pre("save", async function (next) {
  if (!this.caseNumber) {
    const year = new Date().getFullYear();
    const counter = await Counter.findOneAndUpdate(
      { name: `case_${year}` },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.caseNumber = `CASE${year}${String(counter.seq).padStart(4, "0")}`;
  }
  next();
});

// Virtual field for case age in days
caseSchema.virtual("caseAge").get(function () {
  const diffTime = Math.abs(new Date() - this.filedDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const Case = mongoose.model("Case", caseSchema);
export default Case;
