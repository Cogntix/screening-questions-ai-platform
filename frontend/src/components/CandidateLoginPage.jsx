import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CandidateLoginPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 🆕

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // 🆕 Disable button

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/test/questions/${token}`,
        {
          params: { fullName, password },
        }
      );

      sessionStorage.setItem("candidateToken", token);
      sessionStorage.setItem("candidateName", res.data.candidateName);
      sessionStorage.setItem("positionName", res.data.positionName);
      sessionStorage.setItem("questions", JSON.stringify(res.data.questions));
      sessionStorage.setItem("startTime", Date.now());

      navigate("/test/start");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please check your details.";
      setError(msg);
      setIsLoading(false); // 🆕 Allow retry if failed
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Candidate Login
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded text-white transition ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Starting..." : "Start Test"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CandidateLoginPage;
