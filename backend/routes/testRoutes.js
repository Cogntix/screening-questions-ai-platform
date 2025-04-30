const express = require("express");
const {
  getQuestionsByToken,
  submitTest,
  getResultByToken
} = require("../controllers/testController");

const router = express.Router(); 

// GET /api/test/questions/:token
router.get("/questions/:token", getQuestionsByToken);

// POST /api/test/submit
router.post("/submit", submitTest);

// GET /api/test/result/:token
router.get("/result/:token", getResultByToken);

module.exports = router;
