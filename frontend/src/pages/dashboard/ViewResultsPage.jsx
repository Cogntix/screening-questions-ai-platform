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

  if (error) {
    return <div className="text-red-600 text-center mt-10">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          🧾 All Candidate Test Results
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-blue-100 text-blue-900">
              <tr>
                <th className="border px-4 py-2 text-left"></th>
                <th className="border px-4 py-2 text-left">Candidate Name</th>
                <th className="border px-4 py-2 text-left">Position</th>
                <th className="border px-4 py-2 text-left">Score</th>
                <th className="border px-4 py-2 text-left">Submitted At</th>
                <th className="border px-4 py-2 text-left">View Results</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{i + 1}</td>
                  <td className="border px-4 py-2">{r.candidateName}</td>
                  <td className="border px-4 py-2">{r.positionName || "N/A"}</td>
                  <td className="border px-4 py-2">{r.score} / 30</td>
                  <td className="border px-4 py-2">
                    {new Date(r.submittedAt).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => navigate(`/admin/results/view/${r._id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      View Details →
                    </button>
                  </td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <DashboardNavArrows backTo="/dashboard" />
      </div>
    </div>
  );
};

export default ViewResultsPage;
