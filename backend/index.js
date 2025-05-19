const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors({
  origin: "https://screening.cogntix.com",
  credentials: true
}));
app.use(express.json());

const pdfRoutes = require("./routes/pdfRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const testRoutes = require("./routes/testRoutes");
const adminRoutes = require("./routes/adminRoutes");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("DB Error", err));

  app.use("/api/pdf", pdfRoutes);
  app.use("/api/candidates", candidateRoutes);
  app.use("/api/test", testRoutes);
  app.use("/api", adminRoutes);
  app.use("/api", require("./routes/addedPositionRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
