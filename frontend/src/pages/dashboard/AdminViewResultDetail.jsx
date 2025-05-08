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
    return <div className="text-red-600 text-center mt-10">{error}</div>;
  }

  if (!result) {
    return <div className="text-center mt-10 text-gray-500">Loading detailed result...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded shadow p-6 space-y-6">
        <button
          onClick={() => navigate("/dashboard/view-results")}  
          className="text-blue-600 hover:underline mb-2"
        >
          ← Back to Results
        </button>

        <h2 className="text-2xl font-bold text-center text-blue-700">
          Detailed Result for {result.candidateName}
        </h2>

        <div className="text-center space-y-1 text-gray-700">
          <p><strong>Position:</strong> {result.positionName}</p>
          <p><strong>Score:</strong> {result.score} / 30</p>

          <p><strong>Submitted:</strong> {new Date(result.submittedAt).toLocaleString()}</p>
        </div>
        <p><strong>Time Taken:</strong>{result.timeTaken ? Math.round(result.timeTaken / 60) + " minute(s)" : "N/A"}
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-800 whitespace-pre-line">
          <strong>📘 Feedback:</strong><br />
          {result.feedback}
        </div>

        <div className="space-y-4">
          {result.answers.map((q, i) => {
            const correct = q.correctAnswers?.sort().toString();
            const selected = q.selectedAnswers?.sort().toString();
            const isCorrect = correct === selected;

            return (
              <div key={i} className="border p-4 rounded bg-white shadow">
                <p className="font-medium mb-2">{i + 1}. {q.questionText}</p>
                <div className="space-y-1 text-sm">
                  {q.options?.map((opt, idx) => {
                    const isSelected = q.selectedAnswers?.includes(idx);
                    const isCorrectOpt = q.correctAnswers?.includes(idx);

                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded ${
                          isCorrectOpt && isSelected
                            ? "bg-green-100 text-green-800 font-semibold"
                            : isCorrectOpt
                            ? "bg-gray-100 text-green-700"
                            : isSelected
                            ? "bg-red-100 text-red-700"
                            : ""
                        }`}
                      >
                        {opt}{" "}
                        {isCorrectOpt && isSelected
                          ? "✅ (Correct & Selected)"
                          : isCorrectOpt
                          ? "✅ (Correct)"
                          : isSelected
                          ? "❌ (Your Answer)"
                          : ""}
                      </div>
                    );
                  })}
                </div>

                <p className="text-sm mt-2">
                  {isCorrect ? (
                    <span className="text-green-600 font-semibold">✅ Answered Correctly</span>
                  ) : (
                    <span className="text-red-600 font-semibold">❌ Incorrect Answer</span>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminViewResultDetail;
