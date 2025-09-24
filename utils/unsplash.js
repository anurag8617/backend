// backend/utils/unsplash.js
const fetch = require("node-fetch");

const fetchFromUnsplash = async (query) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    );
    const data = await response.json();
    return data.results.map((img) => ({
      id: img.id,
      url: img.urls.regular,
      thumb: img.urls.thumb,
      alt: img.alt_description,
    }));
  } catch (error) {
    console.error("Error fetching from Unsplash:", error);
    return [];
  }
};

module.exports = { fetchFromUnsplash };
    