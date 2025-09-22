const express = require("express");
const router = express.Router();
const { uploadImage, getImages } = require("../controllers/imageController");

// POST /api/images/upload
router.post("/upload", uploadImage);

// GET /api/images
router.get("/", getImages);

module.exports = router;
