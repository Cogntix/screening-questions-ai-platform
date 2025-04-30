const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    required: true
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
      },
      selectedOptions: [Number]  // indexes chosen by the candidate
    }
  ],
  score: {
    type: Number,
    required: true
  },
  feedback: {
    type: String
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Result", resultSchema);
