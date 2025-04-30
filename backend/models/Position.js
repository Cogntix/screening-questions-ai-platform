const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema({
  positionName: {
    type: String,
    required: true,
    unique: true
  },
  pdfContent: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Position", positionSchema);
