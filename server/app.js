const express = require("express");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const app = express();

// MiddleWare
app.use(cors());
app.use(express.json());

// ✅ Basic Test Route
app.get("/", (req, res) => {
  res.send("Hello from Express server!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});