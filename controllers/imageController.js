const db = require("../config/db");
const fetch = require("node-fetch"); // 👈 add this line
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY; // 👈 read from .env

// To delete an image
const deleteImage = async (req, res) => {
  const { id } = req.params; // Get the image ID from the URL

  try {
    // 1. Find the image in the database to get its filename
    const [images] = await db.query(
      "SELECT filename FROM images WHERE id = ?",
      [id]
    );

    if (images.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    const filename = images[0].filename;

    // 2. Delete the physical file from the 'uploads' folder
    const filePath = path.join(__dirname, "..", "uploads", filename);
    await fs.unlink(filePath);

    // 3. Delete the record from the database
    await db.query("DELETE FROM images WHERE id = ?", [id]);

    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("❌ Failed to delete image:", err);
    res.status(500).json({ error: "Failed to delete image" });
  }
};

// Upload image
// const uploadImage = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   const filename = req.file.filename;

//   try {
//     // Use await and a try...catch block for errors
//     await db.query("INSERT INTO images (filename) VALUES (?)", [filename]);

//     // Construct the full URL to send back to the frontend upon successful upload
//     const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${filename}`;

//     res.json({ message: "Image uploaded successfully", url: imageUrl });
//   } catch (err) {
//     console.error("❌ Database insert failed:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filename = req.file.filename;

  try {
    const [result] = await db.query(
      "INSERT INTO images (filename) VALUES (?)",
      [filename]
    );
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${filename}`;

    // Return the full new image object so the frontend can add it to its state
    const newImage = { id: result.insertId, url: imageUrl, filename };

    res.json({ message: "Image uploaded successfully", newImage });
  } catch (err) {
    console.error("❌ Database insert failed:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all images
const getImages = async (req, res) => {
  try {
    // Use await to get the results from the query
    const [results] = await db.query("SELECT * FROM images");

    const imagesWithUrls = results.map((image) => {
      return {
        ...image,
        url: `${req.protocol}://${req.get("host")}/uploads/${image.filename}`,
      };
    });

    res.json(imagesWithUrls);
  } catch (err) {
    console.error("❌ Database query failed:", err);
    res.status(500).json({ error: "Failed to retrieve images." });
  }
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

module.exports = { uploadImage, getImages, preImages, deleteImage };
