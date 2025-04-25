const fs = require("fs");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

const parsePDFWithPDFJS = async (filePath) => {
  const pdfBuffer = fs.readFileSync(filePath);
  const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
  const pdfDocument = await loadingTask.promise;

  let fullText = "";
  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = await pdfDocument.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str).join(" ");
    fullText += strings + "\n";
  }

  return fullText;
};

module.exports = { parsePDFWithPDFJS };
