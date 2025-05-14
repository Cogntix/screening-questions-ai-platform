const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const Candidate = require("../models/Candidate");
const Position = require("../models/Position");

// POST /api/candidates/create
exports.createCandidate = async (req, res) => {
  try {
    const { fullName, password, positionId } = req.body;

    // 1. Validation
    if (!fullName || !password || !positionId) {
      return res.status(400).json({ message: "Full name, password, and positionId are required." });
    }

    // 2. Check if position exists
    const positionExists = await Position.findById(positionId);
    if (!positionExists) {
      return res.status(404).json({ message: "Position not found." });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Generate unique token
    const token = uuidv4();

    // 5. Create and save candidate
    const newCandidate = new Candidate({
      fullName,
      password: hashedPassword,
      positionId,
      token,
      plaintextPassword: password
    });

    await newCandidate.save();

    // 6. Return token (to generate test link)
    res.status(201).json({
      message: "Candidate created successfully.",
      candidateId: newCandidate._id,
      generatedToken: token,
      testLink: `https://screening.cogntix.com/test/${token}`, 
      plaintextPassword: password
    });
  } catch (err) {
    console.error("Candidate creation error:", err);
    res.status(500).json({ message: "Server error while creating candidate." });
  }
};
// controllers/candidateController.js
exports.getAllCandidates = async (req, res) => {
    try {
      const candidates = await Candidate.find().populate("positionId", "positionName");
      res.json(candidates);
    } catch (err) {
      console.error("Error fetching candidates:", err);
      res.status(500).json({ message: "Error fetching candidates" });
    }
  };
  
  exports.deleteCandidate = async (req, res) => {
    try {
      await Candidate.findByIdAndDelete(req.params.id);
      res.json({ message: "Candidate deleted successfully." });
    } catch (err) {
      res.status(500).json({ message: "Error deleting candidate." });
    }
  };
  