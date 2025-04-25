const express = require("express");
const multer = require("multer");
const { parseAndExtract } = require("../controllers/pdfController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("pdf"), parseAndExtract);

module.exports = router;
