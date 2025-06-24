const express = require("express");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const app = express();

// MiddleWare
app.use(cors());
app.use(express.json());

// https://api.openai.com/v1/chat/completions

// Routes
const analyzeRouter = require("./routes/analyze");
const grammarCheckRouter = require("./routes/grammarCheck");
const spellCheckRouter = require("./routes/spellCheck");

// use routers
app.use("/api/analyze", analyzeRouter);
app.use("/api/grammarCheck", grammarCheckRouter);
app.use("/api/spellCheck", spellCheckRouter);

// ✅ Basic Test Route
// app.get("/", (req, res) => {
//   res.send("Hello from Express server!");
// });

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
