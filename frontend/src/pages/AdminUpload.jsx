import React, { useState } from "react";
import API from "../api/api";

export default function AdminUpload() {
  const [position, setPosition] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!position || !pdfFile) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", pdfFile);
    formData.append("position", position);

    try {
      setLoading(true);
      const res = await API.post("/pdf/upload", formData);
      alert("Concepts extracted and saved!");
      console.log(res.data);
      setPosition("");
      setPdfFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to upload or extract concepts.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">📄 Admin - Upload Internship PDF</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Internship Position</label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="e.g. Frontend Developer Intern"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Upload PDF File</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
              className="w-full px-3 py-2 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-pink-300 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-white transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-pink-500 hover:opacity-90"
            }`}
          >
            {loading ? "Uploading..." : "Upload & Extract Concepts"}
          </button>
        </form>
      </div>
    </div>
  );
}
