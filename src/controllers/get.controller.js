import SearchResult from "../models/Search.model.js";
import VerifiedResult from "../models/Verified.model.js";

export const getSearchResults = async (req, res) => {
  try {
    const searchEntry = await SearchResult.findOne({ searchId: req.params.id });
    if (!searchEntry) return res.status(404).json({ message: "Search not found" });

    res.json(searchEntry);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving search results" });
  }
};

export const getVerifiedResults = async (req, res) => {
  try {
    const verifiedEntries = await VerifiedResult.find();
    res.json(verifiedEntries);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving verified results" });
  }
};
