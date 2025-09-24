const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
// Load env vars
dotenv.config();

// ✅ Create app FIRST
const app = express();
// Import routes

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const imageRoutes = require("./routes/imageRoutes");
const templateRoutes = require("./routes/templateRoutes");
const userRoutes = require("./routes/userRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/images", imageRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/users", userRoutes);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
