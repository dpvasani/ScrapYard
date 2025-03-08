import mongoose from "mongoose";

const VerifiedResultSchema = new mongoose.Schema({
  searchId: { type: Number, required: true },
  title: String,
  description: String,
  url: String,
  approvedAt: { type: Date, default: Date.now },
});

export default mongoose.model("VerifiedResult", VerifiedResultSchema);
