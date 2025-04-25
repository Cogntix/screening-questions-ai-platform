const mongoose = require("mongoose");

const KnowledgeBaseSchema = new mongoose.Schema({
  position: String,
  concepts: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("KnowledgeBase", KnowledgeBaseSchema);
