const express = require("express");
const {
  adminLogin,
  getAllPositions,
  getQuestionsByPosition,
  regenerateQuestions,
  getAllResults,
  getResultById,
  createPosition
} = require("../controllers/adminController");

const router = express.Router();

// POST /api/login
router.post("/login", adminLogin);

// GET /api/positions
router.get("/positions", getAllPositions);


// GET /api/positions/:positionId/questions
router.get("/positions/:positionId/questions", getQuestionsByPosition);

// POST /api/positions/:positionId/regenerate
router.post("/positions/:positionId/regenerate", regenerateQuestions);

// GET /api/results
router.get("/results", getAllResults);

// GET /api/results/:resultId
router.get("/results/:resultId", getResultById);

module.exports = router;
