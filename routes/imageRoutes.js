// // routes/imageRoutes.js
// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");

// // Setup Multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // save in /uploads folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// // Controller
// const {
//   uploadImage,
//   getImages,
//   preImages,
// } = require("../controllers/imageController");

// Routes
// router.post("/upload", upload.single("image"), uploadImage);
// router.get("/pre-image", preImages);
// router.get("/", getImages);

// module.exports = router;

const express = require("express");
const multer = require("multer");
const {
  uploadImage,
  getImages,
  preImages,
  deleteImage,
} = require("../controllers/imageController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/upload", upload.single("image"), uploadImage);
router.get("/", getImages);
router.get("/pre-image", preImages);
router.delete("/:id", deleteImage);

module.exports = router;
