import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardNavArrows from "./DashboardNavArrows";
import { useNavigate } from "react-router-dom";

const AddInternPage = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [positionId, setPositionId] = useState("");
  const [positions, setPositions] = useState([]);
  const [popup, setPopup] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/positions`);
        setPositions(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load positions.");
      }
    };
    fetchPositions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPopup(null);
    setError(null);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/candidates/create`, {
        fullName,
        password,
        positionId,
      });

      setPopup({
        message: res.data.message,
        link: res.data.testLink,
        password: res.data.plaintextPassword,
      });

      setFullName("");
      setPassword("");
      setPositionId("");
    } catch (err) {
      const msg = err.response?.data?.message || "Error creating candidate.";
      setError(msg);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-8 border-2 border-blue-200">
        <h2 className="text-3xl font-bold text-blue-800 mb-2 text-center">Add Intern Details</h2>
        <p className="text-blue-600 text-center mb-6">Create new candidate accounts</p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-blue-700 font-medium mb-2">Full Name</label>
            <input
              type="text"
              autoComplete="off"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-blue-50"
            />
          </div>

          <div>
            <label className="block text-blue-700 font-medium mb-2">Password</label>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-blue-50"
            />
          </div>

          <div>
            <label className="block text-blue-700 font-medium mb-2">Select Position</label>
            <select
              value={positionId}
              onChange={(e) => setPositionId(e.target.value)}
              required
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-blue-50"
            >
              <option value="">-- Choose Position --</option>
              {positions.map((pos) => (
                <option key={pos._id} value={pos._id}>
                  {pos.positionName}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Create Candidate
          </button>
        </form>
        
        <DashboardNavArrows backTo="/dashboard" />
      </div>

      {/* Popup Modal */}
      {popup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">{popup.message}</h2>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
              <p className="font-medium text-blue-700 mb-1">Test Link:</p>
              <div className="flex items-center justify-between bg-white p-2 rounded border">
                <span className="text-sm text-gray-700 truncate">{popup.link}</span>
                <button
                  onClick={() => copyToClipboard(popup.link)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  📋
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
              <p className="font-medium text-blue-700 mb-1">Password:</p>
              <div className="flex items-center justify-between bg-white p-2 rounded border">
                <span className="text-gray-700">{popup.password}</span>
                <button
                  onClick={() => copyToClipboard(popup.password)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  📋
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setPopup(null);
                navigate("/dashboard");
              }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow hover:shadow-md transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddInternPage;