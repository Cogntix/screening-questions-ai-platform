const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const extractConcepts = async (text) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Extract key concepts from this text:\n\n${text.slice(0, 3000)}`
      },
    ],
  });

  return response.choices[0].message.content.split("\n").filter(Boolean);
};

module.exports = { extractConcepts };
