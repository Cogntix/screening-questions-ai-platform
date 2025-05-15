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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Add Intern Details
        </h1>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              autoComplete="off"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Select Position</label>
            <select
              value={positionId}
              onChange={(e) => setPositionId(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
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
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Create Candidate
          </button>
        </form>
        <DashboardNavArrows backTo="/dashboard" />
      </div>

      {/* Popup Modal */}
      {popup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-center relative">
            <h2 className="text-xl font-bold text-blue-700 mb-4">{popup.message}</h2>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Test Link:</strong><br />
              <span className="text-gray-600 break-all">{popup.link}</span>
              <button
                onClick={() => copyToClipboard(popup.link)}
                className="ml-2 text-xs text-blue-500 underline"
              >
                Copy
              </button>
            </p>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Password:</strong> {popup.password}
              <button
                onClick={() => copyToClipboard(popup.password)}
                className="ml-2 text-xs text-blue-500 underline"
              >
                Copy
              </button>
            </p>
            <button
  onClick={() => {
    setPopup(null);
    navigate("/dashboard");
  }}
  className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
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
