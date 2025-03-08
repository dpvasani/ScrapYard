import mongoose from "mongoose";

const SearchResultSchema = new mongoose.Schema({
  searchId: { type: Number, required: true },
  keyword: { type: String, required: true },
  priorityKeywords: [{ type: String }],
  links: [
    {
      title: String,
      description: String,
      url: String,
      isApproved: { type: Boolean, default: false },
      subId: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("SearchResult", SearchResultSchema);
