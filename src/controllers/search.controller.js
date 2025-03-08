import axios from "axios";
import SearchResult from "../models/Search.model.js";

export const searchAndSaveResults = async (req, res) => {
  try {
    const { keywords } = req.body;

    if (!Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ message: "Invalid keywords provided" });
    }

    // Get last searchId and increment
    const lastEntry = await SearchResult.findOne().sort({ searchId: -1 });
    const searchId = lastEntry ? lastEntry.searchId + 1 : 1;

    // Fetch search results
    const searchResults = await fetchSearchResults(keywords);

    // Create new search entry
    const searchEntry = new SearchResult({
      searchId,
      keyword: keywords.join(", "), // Store all keywords as a string
      priorityKeywords: keywords,
      links: searchResults,
    });

    await searchEntry.save();
    res.status(201).json({ message: "Search results saved", searchId });
  } catch (error) {
    console.error("Error in searchAndSaveResults:", error);
    res.status(500).json({ message: "Error processing search" });
  }
};

const fetchSearchResults = async (keywords) => {
  try {
    const searchQuery = keywords.join(" ");
    const searchResults = [];

    const response = await axios.get(
      `https://www.googleapis.com/customsearch/v1`, // Example: Google Custom Search API
      {
        params: {
          key: process.env.GOOGLE_API_KEY, // Ensure API key is stored in .env
          cx: process.env.GOOGLE_CX_ID, // Custom Search Engine ID
          q: searchQuery,
          num: 10, // Fetch 10 results per request, loop if needed
        },
      }
    );

    if (!response.data.items) return [];

    response.data.items.forEach((item, index) => {
      searchResults.push({
        title: item.title,
        description: item.snippet,
        url: item.link,
        isApproved: false,
        subId: index + 1,
      });
    });

    return searchResults;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
};
