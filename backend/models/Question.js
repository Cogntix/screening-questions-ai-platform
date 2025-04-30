const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  positionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Position",
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    enum: ["single", "multi"],
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  correctAnswers: {
    type: [Number],  // index positions
    required: true
  }
});

module.exports = mongoose.model("Question", questionSchema);
