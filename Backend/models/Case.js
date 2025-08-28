// models/case.js
import mongoose from "mongoose";
import Counter from "./counter.js";


const actSectionSchema = new mongoose.Schema({
  act: { type: String, required: true },
  section: { type: String, required: true }
});

const documentSchema = new mongoose.Schema({
  type: { type: String, required: true },        // e.g. "Evidence", "Petition"
  title: { type: String, required: true },       // e.g. "FIR Copy"
  description: { type: String },
  fileName: { type: String, required: true },    // original file name
  filePath: { type: String, required: true },    // server upload path
  uploadDate: { type: Date, default: Date.now }
});

const clientDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  idProofType: { type: String, required: true },
  idProofNumber: { type: String, required: true }
});

const caseSchema = new mongoose.Schema({
  // Step 1: Case Details
  district: { type: String, required: true },
  taluk: { type: String, required: true },
  court: { type: String, required: true },
  caseType: { 
    type: String, 
    required: true,
    enum: ['Civil', 'Criminal', 'Family', 'Commercial', 'Constitutional', 'Tax']
  },
  subject: { type: String, required: true },
  description: { type: String },
  
  // Step 2: Client Details
  clientDetails: {
    type: clientDetailsSchema,
    required: true
  },
  
  // Step 3: Acts & Sections
  actsSections: [actSectionSchema],
  
  // Step 4: Documents
  documents: {
    type: [documentSchema],
    default: []   // ✅ prevents empty upload from breaking
  },
  
  // Case Management Fields
  caseNumber: { type: String, unique: true },
  caseStatus: { 
    type: String, 
    enum: ['Draft', 'Submitted', 'Under Review', 'Active', 'Closed'],
    default: 'Submitted'
  },
  filedDate: { type: Date, default: Date.now },
  assignedLawyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastUpdated: { type: Date, default: Date.now }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate case number before saving
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
// Virtual for case age in days
caseSchema.virtual('caseAge').get(function() {
  const diffTime = Math.abs(new Date() - this.filedDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const Case = mongoose.model("Case", caseSchema);

export default Case;
