import axios from "axios";
import * as cheerio from "cheerio";


export const scrapeGoogleSearch = async (query) => {
  try {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      query
    )}`;
    const { data } = await axios.get(searchUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $ = cheerio.load(data);
    const results = [];

    $("a").each((i, element) => {
      const title = $(element).text();
      const url = $(element).attr("href");
      if (title && url && url.startsWith("http")) {
        results.push({ title, url });
      }
    });

    return results.slice(0, 10); // Get top 10 results
  } catch (error) {
    console.error("Error in scraping:", error);
    return [];
  }
};
