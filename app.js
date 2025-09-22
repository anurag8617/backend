const express = require("express");
const cors = require("cors");
require("dotenv").config();
const imageRoutes = require("./routes/imageRoutes");
const templateRoutes = require("./routes/templateRoutes");

const app = express();

app.use(cors());
app.use(express.json());
// routes
app.use("/uploads", express.static("uploads"));
app.use("/api/images", imageRoutes);
app.use("/api/templates", templateRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
