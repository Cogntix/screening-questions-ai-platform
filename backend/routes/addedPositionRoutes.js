const express = require("express");
const router = express.Router();
const { createAddedPosition, getAllAddedPositions } = require("../controllers/addedPositionController");

router.post("/added-positions", createAddedPosition);
router.get("/added-positions", getAllAddedPositions);

module.exports = router;
