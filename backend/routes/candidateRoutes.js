const express = require("express");
const { createCandidate, getAllCandidates, deleteCandidate } = require("../controllers/candidateController");

const router = express.Router();

// POST /api/candidates/create
router.post("/create", createCandidate);
router.get("/", getAllCandidates);
router.delete("/:id", deleteCandidate);

module.exports = router;
