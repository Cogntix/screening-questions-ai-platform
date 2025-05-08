const mongoose = require("mongoose");

const addedPositionSchema = new mongoose.Schema({
  positionName: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model("AddedPosition", addedPositionSchema);
