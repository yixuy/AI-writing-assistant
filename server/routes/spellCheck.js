const express = require("express");
const spellCheckRouter = express.Router();
const { default: axios, head } = require("axios");

spellCheckRouter.post("/", async (req, res) => {
  const { text } = req.body;

  //   if (typeof sentence !== "string") {
  //     return res
  //       .status(400)
  //       .json({ error: "Invalid input. 'sentence' must be a string." });
  //   }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that checks and fixes the spelling errors in the following text. Only return the corrected text without any additional text or comments.",
          },
          {
            role: "user",
            content: text,
          },
        ],
        max_tokens: 5,
        n: 1,
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
    // const rephrasedSentences = response.data.choices.map(
    //   (choice) => choice.message.content
    // );
    const correctText = response.data.choices[0].message.content;
    res.status(200).json(correctText || "");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.messages,
    });
  }
});

module.exports = spellCheckRouter;
