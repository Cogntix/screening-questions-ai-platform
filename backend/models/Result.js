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
      questionText: {
        type: String,
        required: true
      },
      questionType: {
        type: String,
        required: true
      },
      options: {
        type: [String],
        required: true
      },
      selectedAnswers: {
        type: [Number],
        default: []
      },  
      correctAnswers: [Number] ,  
    }
  ],
  score: {
    type: Number,
    required: true
  },
  feedback: {
    type: String
  },
  timeTaken: {
    type: Number, 
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Result", resultSchema);
