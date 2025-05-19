import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminViewResultDetail = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/results/${resultId}`);
        setResult(res.data);
      } catch (err) {
        setError("Failed to load detailed result.");
      }
    };

    fetchResult();
  }, [resultId]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-200 max-w-md text-center">
          <div className="text-red-600 bg-red-100 p-4 rounded-lg border border-red-300">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-200 max-w-md text-center">
          <p className="text-blue-700">Loading detailed result...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 border-2 border-blue-200 space-y-6">
        <button
          onClick={() => navigate("/dashboard/view-results")}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          ← Back to Results
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-2">
            Detailed Result for {result.candidateName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600">Position</p>
              <p className="font-medium">{result.positionName}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600">Score</p>
              <p className="font-medium">{result.score} / 30</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600">Time Taken</p>
              <p className="font-medium">
                {result.timeTaken ? Math.round(result.timeTaken / 60) + " minute(s)" : "N/A"}
              </p>
            </div>
          </div>
          <p className="text-blue-600 mb-4">
            Submitted: {new Date(result.submittedAt).toLocaleString()}
          </p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">📘 Feedback</h3>
          <p className="text-blue-700 whitespace-pre-line">{result.feedback}</p>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-blue-800">Question Breakdown</h3>
          {result.answers.map((q, i) => {
            const correct = q.correctAnswers?.sort().toString();
            const selected = q.selectedAnswers?.sort().toString();
            const isCorrect = correct === selected;

            return (
              <div key={i} className="border-2 border-blue-200 p-4 rounded-xl bg-white">
                <div className={`p-3 rounded-lg mb-3 ${isCorrect ? "bg-green-50" : "bg-red-50"}`}>
                  <p className="font-semibold text-blue-800">
                    Q{i + 1}. {q.questionText}
                  </p>
                  <p className={`text-sm font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                    {isCorrect ? "✅ Correct Answer" : "❌ Incorrect Answer"}
                  </p>
                </div>

                <div className="space-y-2">
                  {q.options?.map((opt, idx) => {
                    const isSelected = q.selectedAnswers?.includes(idx);
                    const isCorrectOpt = q.correctAnswers?.includes(idx);

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${
                          isCorrectOpt && isSelected
                            ? "bg-green-100 border-green-300 text-green-800"
                            : isCorrectOpt
                            ? "bg-gray-50 border-gray-200 text-green-700"
                            : isSelected
                            ? "bg-red-100 border-red-200 text-red-700"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-start">
                          <span className="mr-2">
                            {isCorrectOpt && isSelected
                              ? "✅"
                              : isCorrectOpt
                              ? "✓"
                              : isSelected
                              ? "✗"
                              : "•"}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isCorrectOpt && isSelected && (
                          <p className="text-xs text-green-600 mt-1">(Correct & Selected)</p>
                        )}
                        {isCorrectOpt && !isSelected && (
                          <p className="text-xs text-green-600 mt-1">(Correct Answer)</p>
                        )}
                        {!isCorrectOpt && isSelected && (
                          <p className="text-xs text-red-600 mt-1">(Selected Answer)</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminViewResultDetail;