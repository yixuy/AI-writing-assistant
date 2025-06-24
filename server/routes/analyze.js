const { default: axios, head } = require("axios");
const express = require("express");
const analyzeRouter = express.Router();

analyzeRouter.post("/", async (req, res) => {
  const { sentence } = req.body;

  if (typeof sentence !== "string") {
    return res
      .status(400)
      .json({ error: "Invalid input. 'sentence' must be a string." });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that rephrases. Only return the rephrased sentence without any additional text or comments.",
          },
          {
            role: "user",
            content: sentence,
          },
        ],
        max_tokens: 5,
        n: 3,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    console.log(response.data);
    const rephrasedSentences = response.data.choices.map(
      (choice) => choice.message.content
    );
    res.status(200).json(rephrasedSentences || []);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.messages,
    });
  }
  //   Test
  //   res.json({
  //     message: "Analyze route",
  //   });
});

module.exports = analyzeRouter;
