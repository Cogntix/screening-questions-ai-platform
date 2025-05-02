const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const Position = require("../models/Position");
const Question = require("../models/Question");
const Result = require("../models/Result");
const Candidate = require("../models/Candidate");
const openai = require("../utils/openai");

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found." });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

    return res.json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Get All Positions
exports.getAllPositions = async (req, res) => {
  try {
    const positions = await Position.find({}, "_id positionName createdAt");
    res.json(positions);
  } catch (err) {
    res.status(500).json({ message: "Database error" });
  }
};

// 3. Get Questions By Position
exports.getQuestionsByPosition = async (req, res) => {
  try {
    const { positionId } = req.params;
    const questions = await Question.find({ positionId });
    if (!questions.length) return res.status(404).json({ message: "No questions found." });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Database error" });
  }
};
// 4. Regenerate 100 Questions for a Position
exports.regenerateQuestions = async (req, res) => {
  try {
    const { positionId } = req.params;
    const position = await Position.findById(positionId);
    if (!position) return res.status(404).json({ message: "Position not found" });

    const prompt = `
You are an exam paper generator. Based on the knowledge below for the internship position "${position.positionName}", generate 100 questions.Ensure the set includes a mix of:
- Single-select multiple choice questions (MCQs)
- Multi-select questions (where more than one option may be correct)

Content:
${position.pdfContent}

Format:
[
  {
    "questionText": "...",
    "questionType": "single" or "multi",
    "options": ["A", "B", "C", "D"],
    "correctAnswers": [0] // use indices of correct options, e.g., [1, 2] for multi-select
  }
]
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const raw = response.choices[0].message.content;
    let questions = [];
    try {
      questions = JSON.parse(raw);
    } catch (err) {
      return res.status(500).json({ message: "OpenAI response not in valid format." });
    }

    // Clear old questions
    await Question.deleteMany({ positionId });

    // Save new questions
    const questionDocs = questions.map(q => ({
      positionId: position._id,
      questionText: q.questionText,
      questionType: q.questionType,
      options: q.options,
      correctAnswers: q.correctAnswers
    }));

    await Question.insertMany(questionDocs);

    res.json({ message: "100 questions regenerated successfully", questions: questionDocs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error regenerating questions" });
  }
};

// 5. Get All Results
exports.getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate("candidateId", "fullName positionId")
      .populate({ path: "candidateId", populate: { path: "positionId", select: "positionName" } });

    const formatted = results.map(r => ({
      candidateName: r.candidateId.fullName,
      positionName: r.candidateId.positionId?.positionName,
      score: r.score,
      submittedAt: r.submittedAt
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch results" });
  }
};

// 6. Get One Result by ID
exports.getResultById = async (req, res) => {
  try {
    const { resultId } = req.params;
    const result = await Result.findById(resultId)
      .populate("candidateId")
      .populate({ path: "candidateId", populate: { path: "positionId", select: "positionName" } });

    if (!result) return res.status(404).json({ message: "Result not found" });

    res.json({
      candidateName: result.candidateId.fullName,
      positionName: result.candidateId.positionId?.positionName,
      score: result.score,
      feedback: result.feedback,
      answers: result.answers,
      submittedAt: result.submittedAt
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch detailed result" });
  }
};
