import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardNavArrows from "./DashboardNavArrows";

const ViewResultsPage = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/results`);
        setResults(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch results.");
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 border-2 border-blue-200">
        <h2 className="text-3xl font-bold text-blue-800 mb-2 text-center">Candidate Test Results</h2>
        <p className="text-blue-600 text-center mb-6">View test scores and details</p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center border border-red-300">
            {error}
          </div>
        )}

        {results.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border-2 border-blue-200 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-100 text-left text-blue-800">
                  <th className="p-4 border-b-2 border-blue-200">#</th>
                  <th className="p-4 border-b-2 border-blue-200">Candidate Name</th>
                  <th className="p-4 border-b-2 border-blue-200">Position</th>
                  <th className="p-4 border-b-2 border-blue-200">Score</th>
                  <th className="p-4 border-b-2 border-blue-200">Submitted At</th>
                  <th className="p-4 border-b-2 border-blue-200 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="hover:bg-blue-50 transition-colors">
                    <td className="p-4 border-b border-blue-100">{i + 1}</td>
                    <td className="p-4 border-b border-blue-100 font-medium">{r.candidateName}</td>
                    <td className="p-4 border-b border-blue-100">{r.positionName || "N/A"}</td>
                    <td className="p-4 border-b border-blue-100">
                      <span className="font-semibold">{r.score}</span> / 30
                    </td>
                    <td className="p-4 border-b border-blue-100">
                      {new Date(r.submittedAt).toLocaleString()}
                    </td>
                    <td className="p-4 border-b border-blue-100 text-center">
                      <button
                        onClick={() => navigate(`/admin/results/view/${r._id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 text-center">
            <p className="text-blue-700">No results found. Candidates will appear here after completing their assessments.</p>
          </div>
        )}
        
        <DashboardNavArrows backTo="/dashboard" />
      </div>
    </div>
  );
};

export default ViewResultsPage;