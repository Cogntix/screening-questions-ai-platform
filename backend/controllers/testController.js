const Candidate = require("../models/Candidate");
const Question = require("../models/Question");
const Result = require("../models/Result");
const Position = require("../models/Position");
const bcrypt = require("bcryptjs");
const openai = require("../utils/openai");


// 1. GET /api/test/questions/:token
exports.getQuestionsByToken = async (req, res) => {
  try {
    const { token } = req.params;
    const { fullName, password } = req.query;

    if (!token || !fullName || !password) {
      return res.status(400).json({ message: "Token, fullName, and password are required." });
    }

    const candidate = await Candidate.findOne({ token }).populate("positionId");
    if (!candidate) return res.status(401).json({ message: "Invalid token." });
    if (candidate.hasSubmitted) return res.status(409).json({ message: "Test already submitted." });

    const passwordMatch = await bcrypt.compare(password, candidate.password);
    if (!passwordMatch || candidate.fullName !== fullName) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const allQuestions = await Question.find({ positionId: candidate.positionId._id });
    if (allQuestions.length < 30) {
      return res.status(500).json({ message: "Not enough questions available." });
    }

    // Shuffle and pick 30 questions
    const selectedQuestions = allQuestions
      .sort(() => 0.5 - Math.random())
      .slice(0, 30)
      .map(q => ({
        _id: q._id,
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options
      }));

    res.json({
      candidateName: candidate.fullName,
      positionName: candidate.positionId.positionName,
      questions: selectedQuestions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching questions." });
  }
};

// 2. POST /api/test/submit
exports.submitTest = async (req, res) => {
  try {
    const { token, answers } = req.body;

    if (!token || !Array.isArray(answers) || answers.length !== 30) {
      return res.status(400).json({ message: "Token and 30 answers are required." });
    }

    const candidate = await Candidate.findOne({ token });
    if (!candidate) return res.status(401).json({ message: "Invalid token." });
    if (candidate.hasSubmitted) return res.status(409).json({ message: "Test already submitted." });

    // Fetch questions for scoring
    const questionMap = await Question.find({ positionId: candidate.positionId });
    const questionById = {};
    questionMap.forEach(q => (questionById[q._id.toString()] = q));

    // Calculate score
    
    const detailedAnswers = []; // new detailed answer array
// new detailed answer array
    let score = 0;
    
    for (let ans of req.body.answers) {
      const q = questionById[ans.questionId];
      if (!q) continue;
    
      const correct = q.correctAnswers.sort().toString();
      const submitted = ans.selected.sort().toString();
      const isCorrect = correct === submitted;
      if (isCorrect) score++;
    
      detailedAnswers.push({
        questionId: q._id,
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options,
        selectedAnswers: ans.selected,
        correctAnswers: q.correctAnswers
      });
    }
    

    // Optional: Generate feedback via OpenAI
    const prompt = `Evaluate this intern's knowledge based on a score of ${score}/30. Provide short, professional feedback.`;
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const feedback = response.choices[0].message.content;

    const result = new Result({
      candidateId: candidate._id,
      answers: detailedAnswers,
      score,
      feedback,
      submittedAt: new Date()
    });
    await result.save();
    candidate.hasSubmitted = true;
    await candidate.save();

    res.json({ message: "Test submitted successfully.", score, feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while submitting test." });
  }
};

// 3. GET /api/test/result/:token
exports.getResultByToken = async (req, res) => {
  try {
    const { token } = req.params;
    const candidate = await Candidate.findOne({ token });
    if (!candidate) return res.status(401).json({ message: "Invalid token." });

    const result = await Result.findOne({ candidateId: candidate._id });
    if (!result) return res.status(404).json({ message: "Result not found." });

    res.json({
      candidateName: candidate.fullName,
      positionId: candidate.positionId,
      score: result.score,
      feedback: result.feedback,
      submittedAt: result.submittedAt,
      answers: result.answers.map(entry => ({
        questionText: entry.questionText,
        questionType: entry.questionType,
        options: entry.options,
        correctAnswers: entry.correctAnswers,
        selectedOptions: entry.selectedAnswers
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching result." });
  }
};
