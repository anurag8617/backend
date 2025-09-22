const db = require("../config/db");
const fetch = require("node-fetch"); // 👈 add this line
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY; // 👈 read from .env

// Upload image
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filename = req.file.filename;

  db.query(
    "INSERT INTO images (filename) VALUES (?)",
    [filename],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Image uploaded successfully", filename });
    }
  );
};

// Get all images
const getImages = (req, res) => {
  db.query("SELECT * FROM images", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const preImages = async (req, res) => {
  try {
    const query = req.query.query || "nature"; // default search
    const page = req.query.page || 1;

    const url = `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=3  0&client_id=${UNSPLASH_ACCESS_KEY}`;

    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Unsplash API error: ${response.statusText}`);

    const data = await response.json();

    // send only what frontend needs (URLs)
    const images = data.results.map((img) => ({
      id: img.id,
      thumb: img.urls.thumb, // use small for preview
      url: img.urls.regular, // full size if needed
      alt: img.alt_description || "Unsplash image",
    }));
    // console.log("Results:", data.results);

    res.json(images);
  } catch (err) {
    console.error("❌ Unsplash fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch from Unsplash" });
  }
};

module.exports = { uploadImage, getImages, preImages };
