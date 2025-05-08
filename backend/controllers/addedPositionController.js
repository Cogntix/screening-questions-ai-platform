const AddedPosition = require("../models/AddedPosition");

// POST /api/added-positions
exports.createAddedPosition = async (req, res) => {
  try {
    const { positionName } = req.body;
    if (!positionName) return res.status(400).json({ message: "Position name required." });

    const exists = await AddedPosition.findOne({ positionName });
    if (exists) return res.status(400).json({ message: "Position already exists." });

    const newPos = new AddedPosition({ positionName });
    await newPos.save();
    res.status(201).json({ message: "Added position created.", position: newPos });
  } catch (err) {
    res.status(500).json({ message: "Server error while adding position." });
  }
};

// GET /api/added-positions
exports.getAllAddedPositions = async (req, res) => {
  try {
    const all = await AddedPosition.find();
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: "Error fetching added positions." });
  }
};
