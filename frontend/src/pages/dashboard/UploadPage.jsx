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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Upload Internship PDF</h2>

        {message && <div className="mb-4 text-center font-medium text-sm text-gray-800">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Select Internship Position</label>
            <select
  value={position}
  onChange={(e) => setPosition(e.target.value)}
  required
  className="w-full border p-2 rounded"
>
  <option value="">-- Choose a Position --</option>
  {options.map((opt) => (
    <option key={opt._id} value={opt.positionName}>{opt.positionName}</option>
  ))}
</select>

          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Select PDF File</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
              className="w-full border border-gray-300 p-2 rounded-md bg-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-semibold transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Uploading..." : "Upload PDF & Generate Questions"}
          </button>
        </form>
        <DashboardNavArrows backTo="/dashboard" />
      </div>
    </div>
  );
};

export default UploadPage;
