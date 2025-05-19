import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardNavArrows from "./DashboardNavArrows";

const UploadPage = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [position, setPosition] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchAddedPositions = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/added-positions`);
        setOptions(res.data);
      } catch (err) {
        console.error("Failed to load added positions");
      }
    };
    fetchAddedPositions();
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("pdf", pdfFile);
      formData.append("position", position);

      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/pdf/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      setMessage("✅ " + res.data.message);
      setPdfFile(null);
      setPosition("");
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Upload failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-8 border-2 border-blue-200">
        <h2 className="text-3xl font-bold text-blue-800 mb-4 text-center">Upload Internship PDF</h2>
        <p className="text-blue-600 text-center mb-8">Upload pdf to generate questions</p>

        {message && (
          <div className={`mb-6 p-3 rounded-lg text-center font-medium ${
            message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-blue-700 font-medium mb-2">Select Internship Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-blue-50"
            >
              <option value="">-- Choose a Position --</option>
              {options.map((opt) => (
                <option key={opt._id} value={opt.positionName}>{opt.positionName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-blue-700 font-medium mb-2">Select PDF File</label>
            <div className="border-2 border-blue-200 border-dashed rounded-lg p-4 bg-blue-50">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
                className="w-full"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition-all ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
            }`}
          >
            {loading ? "Uploading... Please wait" : "Upload & Generate Questions"}
          </button>
        </form>
        
        <DashboardNavArrows backTo="/dashboard" />
      </div>
    </div>
  );
};

export default UploadPage;