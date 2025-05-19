import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed.";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4 py-12">
      {/* Project Header Section */}
      <div className="text-center mb-10 w-full max-w-4xl px-4">
        <h1 className="text-4xl font-bold text-blue-800 mb-3">
          ScreeningQuestionAI
        </h1>
        <h2 className="text-2xl font-semibold text-blue-700 mb-6">
          AI-Powered Intern Assessment Platform
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white/90 p-5 rounded-xl shadow-md border border-blue-200/50">
            <h3 className="font-bold text-blue-700 mb-2 text-lg">Knowledge Base</h3>
            <p className="text-sm text-blue-600">Upload PDFs to create question banks</p>
          </div>
          <div className="bg-white/90 p-5 rounded-xl shadow-md border border-blue-200/50">
            <h3 className="font-bold text-blue-700 mb-2 text-lg">Question Generation</h3>
            <p className="text-sm text-blue-600">30 unique questions per candidate</p>
          </div>
          <div className="bg-white/90 p-5 rounded-xl shadow-md border border-blue-200/50">
            <h3 className="font-bold text-blue-700 mb-2 text-lg">Timed Assessments</h3>
            <p className="text-sm text-blue-600">Auto-scoring with 15-minute timer</p>
          </div>
        </div>
      </div>

      {/* Login Box - Updated to match header styling */}
      <div className="bg-white/90 p-8 rounded-xl shadow-lg w-full max-w-md border border-blue-200/50">
        <div className="text-center mb-7">
          <h3 className="text-2xl font-bold text-blue-700 mb-2">
            Admin Portal
          </h3>
          <p className="text-blue-600 text-sm">Sign in to access the dashboard</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-md mb-4 border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@cogntix.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all shadow hover:shadow-md"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;