const db = require("../config/db");

// Save template
const saveTemplate = (req, res) => {
  const { name, data } = req.body;
  if (!name || !data) {
    return res.status(400).json({ error: "Name and data are required" });
  }

  db.query(
    "INSERT INTO templates (name, data) VALUES (?, ?)",
    [name, JSON.stringify(data)],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Template saved successfully", id: result.insertId });
    }
  );
};

// Get all templates
const getTemplates = (req, res) => {
  db.query("SELECT * FROM templates", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Get single template
const getTemplateById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM templates WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length)
      return res.status(404).json({ error: "Template not found" });

    const template = results[0];
    template.data = JSON.parse(template.data);
    res.json(template);
  });
};

module.exports = { saveTemplate, getTemplates, getTemplateById };
