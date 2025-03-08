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
    let searchResults = await fetchSearchResults(keywords, 150); // Try fetching up to 150 links

    // Ensure minimum 10 results
    if (searchResults.length < 10) {
      const additionalResults = await fetchAdditionalResults(keywords, 10 - searchResults.length);
      searchResults.push(...additionalResults);
    }

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

const fetchSearchResults = async (keywords, maxResults = 150) => {
  try {
    const searchQuery = keywords.join(" ");
    let searchResults = [];
    let resultsFetched = 0;

    while (resultsFetched < maxResults) {
      const remainingResults = Math.min(10, maxResults - resultsFetched); // Fetch only what's needed
      const response = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
        params: {
          key: process.env.GOOGLE_API_KEY,
          cx: process.env.GOOGLE_CX_ID,
          q: searchQuery,
          num: remainingResults, // Get up to 10 results at a time
          start: resultsFetched + 1, // Adjust start index dynamically
        },
      });

      if (!response.data.items) break; // Stop if no more results are available

      response.data.items.forEach((item) => {
        searchResults.push({
          title: item.title,
          description: item.snippet,
          url: item.link,
          isApproved: false,
          subId: searchResults.length + 1,
        });
      });

      resultsFetched = searchResults.length; // Update fetched count
      if (response.data.items.length < remainingResults) break; // Stop if fewer results returned
    }

    return searchResults;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
};


// **Fallback: Search each keyword separately if results are less than 10**
const fetchAdditionalResults = async (keywords, requiredResults) => {
  let additionalResults = [];
  for (const keyword of keywords) {
    if (additionalResults.length >= requiredResults) break;

    try {
      const response = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
        params: {
          key: process.env.GOOGLE_API_KEY,
          cx: process.env.GOOGLE_CX_ID,
          q: keyword,
          num: 10, // Fetch 10 results per request
        },
      });

      if (!response.data.items) continue;

      response.data.items.forEach((item) => {
        if (additionalResults.length >= requiredResults) return;
        additionalResults.push({
          title: item.title,
          description: item.snippet,
          url: item.link,
          isApproved: false,
          subId: additionalResults.length + 1,
        });
      });
    } catch (error) {
      console.error(`Error fetching results for keyword "${keyword}":`, error);
    }
  }
  return additionalResults;
};
