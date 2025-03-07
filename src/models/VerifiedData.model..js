import mongoose from "mongoose";

const VerifiedDataSchema = new mongoose.Schema({
  keyword: String,
  title: String,
  description: String,
  url: String,
  source: String,
  verifiedAt: { type: Date, default: Date.now },
});

export default mongoose.model("VerifiedData", VerifiedDataSchema);
