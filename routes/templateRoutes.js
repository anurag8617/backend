// D:/project/backend/routes/templateRoutes.js

const express = require("express");
const router = express.Router();
const {
  saveTemplate,
  getTemplates,
  getTemplateById,
  deleteTemplate, // ✅ THIS WAS THE MISSING IMPORT
} = require("../controllers/templateController");

router.post("/save", saveTemplate);
router.get("/", getTemplates);
router.get("/:id", getTemplateById);
router.delete("/:id", deleteTemplate); // This line will now work correctly

module.exports = router;
