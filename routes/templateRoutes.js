const express = require("express");
const router = express.Router();
const {
  saveTemplate,
  getTemplates,
  getTemplateById,
} = require("../controllers/templateController");

router.post("/save", saveTemplate);
router.get("/", getTemplates);
router.get("/:id", getTemplateById);

module.exports = router;
