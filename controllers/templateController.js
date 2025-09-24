const pool = require("../config/db");
const fetch = require("node-fetch");

// Save template
// const saveTemplate = async (req, res) => {
//   const { name, data } = req.body;
//   try {
//     // ✅ FIX: The backend should always handle stringifying the data for the DB.
//     const jsonData = JSON.stringify(data);

//     const [result] = await pool.query(
//       "INSERT INTO templates (name, data) VALUES (?, ?)",
//       [name, jsonData]
//     );

//     // ✅ FIX: Return the original data object, not a parsed one.
//     res.status(201).json({ id: result.insertId, name, data });
//   } catch (err) {
//     console.error("Failed to save template:", err);
//     res.status(500).send("Server error");
//   }
// };

const saveTemplate = async (req, res) => {
  // ✅ NEW: Get the previewImage from the request body
  const { name, data, previewImage } = req.body;
  try {
    const jsonData = JSON.stringify(data);

    // ✅ FIX: Add the previewImage to the INSERT query
    const [result] = await pool.query(
      "INSERT INTO templates (name, data, previewImage) VALUES (?, ?, ?)",
      [name, jsonData, previewImage] // Add previewImage here
    );

    res.status(201).json({ id: result.insertId, name, data, previewImage });
  } catch (err) {
    console.error("Failed to save template:", err);
    res.status(500).send("Server error");
  }
};

// Get template by ID
const getTemplateById = async (req, res) => {
  try {
    const [templates] = await pool.query(
      "SELECT * FROM templates WHERE id = ?",
      [req.params.id]
    );

    if (templates.length === 0) {
      return res.status(404).send("Template not found");
    }

    let template = templates[0];

    // ✅ FIX: Always parse the JSON string from the DB before sending to client.
    try {
      template.data = JSON.parse(template.data);
    } catch (e) {
      console.error("Failed to parse template JSON:", e);
      return res.status(500).json({ error: "Template data is invalid." });
    }

    res.json(template);
  } catch (err) {
    console.error("Failed to get template by id:", err);
    res.status(500).send("Server error");
  }
};

// Delete template
const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    // ✅ FIX: Check if the template was actually deleted to provide feedback.
    const [result] = await pool.query("DELETE FROM templates WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Template not found or already deleted.");
    }

    res.status(200).send("Template deleted successfully");
  } catch (err) {
    console.error("Failed to delete template:", err);
    res.status(500).send("Server error");
  }
};

const findFirstImageUrl = (pagesData) => {
  if (!Array.isArray(pagesData)) {
    return null;
  }

  for (const page of pagesData) {
    // Check the most recent state in the undoStack
    if (page.undoStack && page.undoStack.length > 0) {
      const latestState = page.undoStack[page.undoStack.length - 1];
      if (latestState && latestState.objects) {
        // Find the first object of type 'image' and return its source URL
        const imageObject = latestState.objects.find(
          (obj) => obj.type === "image" && obj.src
        );
        if (imageObject) {
          return imageObject.src; // Found it!
        }
      }
    }
  }

  return null; // No image was found in any page
};

// Get all templates (list only id, name, and a preview image)
// const getTemplates = async (req, res) => {
//   try {
//     // ✅ FIX: Select the 'data' column so we can search it for an image.
//     const [templatesFromDb] = await pool.query(
//       "SELECT id, name, data FROM templates"
//     );

//     // ✅ NEW: Process each template to add the preview URL.
//     const templates = templatesFromDb.map((template) => {
//       let previewImageUrl = null;
//       try {
//         // Parse the JSON data stored as a string in the database
//         const parsedData = JSON.parse(template.data);
//         previewImageUrl = findFirstImageUrl(parsedData);
//       } catch (e) {
//         console.error(`Failed to parse data for template ID ${template.id}`);
//       }

//       return {
//         id: template.id,
//         name: template.name,
//         previewImageUrl: previewImageUrl, // This will be the URL or null
//       };
//     });

//     res.json(templates);
//   } catch (err) {
//     console.error("Failed to get templates:", err);
//     res.status(500).send("Server error");
//   }
// };
const getTemplates = async (req, res) => {
  try {
    // ✅ FIX: Select the new 'previewImage' column instead of the 'data' column.
    // This is much more efficient.
    const [templates] = await pool.query(
      "SELECT id, name, previewImage FROM templates"
    );
    res.json(templates);
  } catch (err) {
    console.error("Failed to get templates:", err);
    res.status(500).send("Server error");
  }
};

module.exports = {
  saveTemplate,
  getTemplates,
  getTemplateById,
  deleteTemplate,
  getTemplates,
};
