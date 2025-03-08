import SearchResult from "../models/Search.model.js";
import VerifiedResult from "../models/Verified.model.js";

export const approveLinks = async (req, res) => {
  try {
    const { searchId, approvedSubIds } = req.body;
    if (!searchId || !Array.isArray(approvedSubIds)) {
      return res.status(400).json({ message: "Invalid data provided" });
    }

    const searchEntry = await SearchResult.findOne({ searchId });
    if (!searchEntry) {
      return res.status(404).json({ message: "Search entry not found" });
    }

    const approvedLinks = searchEntry.links.filter((link) =>
      approvedSubIds.includes(link.subId)
    );

    for (const link of approvedLinks) {
      await new VerifiedResult({
        searchId,
        title: link.title,
        description: link.description,
        url: link.url,
      }).save();
    }

    searchEntry.links.forEach((link) => {
      if (approvedSubIds.includes(link.subId)) {
        link.isApproved = true;
      }
    });

    await searchEntry.save();
    res.status(200).json({ message: "Links approved and saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error approving links" });
  }
};
