const express = require("express");
const { createCandidate } = require("../controllers/candidateController");

const router = express.Router();

// POST /api/candidates/create
router.post("/create", createCandidate);

module.exports = router;
