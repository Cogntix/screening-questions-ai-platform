import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CandidateLoginPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

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
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md border-2 border-blue-200">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Welcome to Your Assessment</h1>
          <p className="text-blue-600">Please login to begin your test</p>
        </div>

        {/* Test Rules Box */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-700 mb-2">Test Guidelines:</h3>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>You will have <strong>15 minutes</strong> to complete the test</li>
            <li>The test contains <strong>30 questions</strong></li>
            <li>Questions will be a mix of multiple-choice and multi-select</li>
            <li>Test will automatically submit when time expires</li>
            <li>Do not refresh the page during the test</li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-blue-700 font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-blue-50"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-blue-700 font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-blue-50"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition-all ${
              isLoading 
                ? "bg-blue-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Starting Test..." : "Begin Assessment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CandidateLoginPage;