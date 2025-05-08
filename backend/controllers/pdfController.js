const fs = require("fs");
const path = require("path");
const Position = require("../models/Position");
const Question = require("../models/Question");
const { extractTextFromPDF } = require("../utils/pdfParser");
const openai = require("../utils/openai");


exports.uploadPDFAndGenerateQuestions = async (req, res) => {
  try {
    const { position } = req.body;
    if (!req.file || !position) {
      return res.status(400).json({ message: "PDF and position name are required." });
    }

    const filePath = path.join(__dirname, "..", req.file.path);

    // Step 1: Extract text from PDF
    const extractedText = await extractTextFromPDF(filePath);
    if (!extractedText || extractedText.length < 100) {
      return res.status(400).json({ message: "PDF content is empty or unreadable." });
    }

    // Step 2: Create structured OpenAI prompt
// inside uploadPDFAndGenerateQuestions
const questions = [];
const batchSize = 25;
const totalBatches = 4;

for (let i = 0; i < totalBatches; i++) {
  const prompt = `
You are a JSON-only exam question generator.

Generate exactly ${batchSize} domain-relevant assessment questions for the internship position below:

Internship Position: ${position}

Knowledge Extracted from PDF:
${extractedText}

Format your response as a JSON array like:
[
  {
    "questionText": "....",
    "questionType": "single" or "multi",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswers": [0]
  },
  ...
]

Guidelines:
- Each question must have exactly 4 options.
- Do NOT include explanations or extra text.
- Ensure each question is unique.
- Mix of single-select and multi-select.

Return only valid JSON.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  });

  const raw = response.choices[0]?.message?.content;

  try {
    const parsed = JSON.parse(raw);
    const validQuestions = parsed.filter(
      (q) => Array.isArray(q.options) && q.options.length === 4
    );
    
    questions.push(...validQuestions);
    
    if (validQuestions.length < batchSize) {
      console.warn(`Batch ${i + 1} returned only ${validQuestions.length} valid questions`);
    }
    
  } catch (err) {
    return res.status(500).json({
      message: `Failed to parse OpenAI response for batch ${i + 1}`,
      rawResponse: raw
    });
  }
}


    // Step 4: Save Position
    const newPosition = new Position({
      positionName: position,
      pdfContent: extractedText
    });
    const savedPosition = await newPosition.save();

    // Step 5: Save Questions
    const questionDocs = questions.map(q => ({
      positionId: savedPosition._id,
      questionText: q.questionText,
      questionType: q.questionType,
      options: q.options,
      correctAnswers: q.correctAnswers
    }));

    await Question.insertMany(questionDocs);

    // Step 6: Cleanup uploaded file
    fs.unlinkSync(filePath);

    res.status(200).json({
      message: "Questions generated successfully.",
      positionId: savedPosition._id,
      questions: questionDocs
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


