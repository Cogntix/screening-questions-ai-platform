const express = require("express");
const { createCandidate, getAllCandidates } = require("../controllers/candidateController");

const router = express.Router();

// POST /api/candidates/create
router.post("/create", createCandidate);
router.get("/", getAllCandidates);

module.exports = router;
