const { parsePDFWithPDFJS } = require("../utils/pdfParser");
const { extractConcepts } = require("../utils/openai");
const KnowledgeBase = require("../models/KnowledgeBase");

const parseAndExtract = async (req, res) => {
  try {
    const pdfPath = req.file.path;
    const text = await parsePDFWithPDFJS(pdfPath);
    const concepts = await extractConcepts(text);

    const saved = await KnowledgeBase.create({
      position: req.body.position,
      concepts,
    });

    res.status(200).json({ success: true, data: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to parse/extract" });
  }
};

module.exports = { parseAndExtract };
