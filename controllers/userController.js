// const User = require("../models/userModel");

// exports.getUsers = (req, res) => {
//   User.getAll((err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// };

// exports.createUser = (req, res) => {
//   const newUser = {
//     name: req.body.name,
//     email: req.body.email,
//   };
//   User.create(newUser, (err, result) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json({ message: "User created!", id: result.insertId });
//   });
// };

const express = require("express");
const router = express.Router();
const { fetchFromUnsplash } = require("../utils/unsplash");

// Example endpoint to fetch Unsplash images
router.get("/unsplash/:query", async (req, res) => {
  const { query } = req.params;
  try {
    const images = await fetchFromUnsplash(query);
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

module.exports = router;
