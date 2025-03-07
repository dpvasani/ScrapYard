import mongoose from "mongoose";

const SearchResultSchema = new mongoose.Schema({
  keyword: { type: String, required: true },
  links: [
    {
      title: String,
      description: String,
      url: String,
      source: String,
      approved: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("SearchResult", SearchResultSchema);
