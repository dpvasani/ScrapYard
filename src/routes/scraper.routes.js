import express from "express";
import { scrapeGoogleSearch } from "../services/scraperService.js";
import SearchResult from "../models/SearchResult.model.js";
import VerifiedData from "../models/VerifiedData.model..js";

const router = express.Router();

// 🔹 Search and Save Results
router.post("/search", async (req, res) => {
  try {
    const { keyword } = req.body;
    const links = await scrapeGoogleSearch(keyword);

    const newSearch = await SearchResult.create({ keyword, links });
    res.status(200).json(newSearch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Approve a Link
router.post("/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { keyword, title, description, url } = req.body;

    await SearchResult.updateOne(
      { "links._id": id },
      { $set: { "links.$.approved": true } }
    );

    await VerifiedData.create({ keyword, title, description, url, source: "Web" });

    res.status(200).json({ message: "Link approved and moved to verified collection" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Get Verified Results
router.get("/verified", async (req, res) => {
  try {
    const verified = await VerifiedData.find();
    res.status(200).json(verified);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
