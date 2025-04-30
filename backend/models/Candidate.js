const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  positionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Position",
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  hasSubmitted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Candidate", candidateSchema);
