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
    const prompt = `
You are a a JSON-only exam paper generator.

Generate 100 domain-relevant assessment questions for the following internship position.
Ensure the set includes a mix of:
- Single-select multiple choice questions (MCQs)
- Multi-select questions (where more than one option may be correct)

Internship Position: ${position}
Knowledge Content:
${extractedText}

Format your response as **JSON only**:
[
  {
    "questionText": "...",
    "questionType": "single" or "multi",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswers": [0] //  use indices of correct options, e.g., [1, 2] for multi-select
  },
  ...
]
  Domain Knowledge:
${extractedText}
Do not include any explanation or extra text outside the JSON.
`;

    // Step 3: Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });
    
    // Ensure response is valid
    if (!response || !response.choices || !response.choices[0]?.message?.content) {
      return res.status(500).json({ message: "OpenAI did not return valid question data." });
    }
    
    const raw = response.choices[0].message.content;
    
    console.log("OpenAI raw response:", raw);

    let questions = [];
    try {
      questions = JSON.parse(raw);
    } catch (err) {
      return res.status(500).json({ message: "OpenAI response not parsable. Try again.",
        rawResponse: raw 
       });
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
