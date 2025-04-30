const express = require("express");
const multer = require("multer");
const { uploadPDFAndGenerateQuestions } = require("../controllers/pdfController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("pdf"), uploadPDFAndGenerateQuestions);

module.exports = router;
