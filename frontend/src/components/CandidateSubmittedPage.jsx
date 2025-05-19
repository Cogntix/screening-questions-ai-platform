import React, { useEffect, useState } from "react";
import axios from "axios";

const CandidateSubmittedPage = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("candidateToken");
    const startTime = sessionStorage.getItem("startTime");

    if (!token) {
      setError("No token found.");
      return;
    }

    const fetchResult = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/test/result/${token}`
        );
        setResult(res.data);

        if (startTime) {
          const endTime = new Date(res.data.submittedAt).getTime();
          const duration = Math.round((endTime - parseInt(startTime)) / 60000);
          setDurationMinutes(duration);
          sessionStorage.removeItem("startTime"); 
        }
        else if (res.data.timeTaken) {
          setDurationMinutes(Math.round(res.data.timeTaken / 60));
        }
      } catch (err) {
        setError("Failed to fetch result.");
      }
    };

    fetchResult();
  }, []);

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
          <p className="text-blue-700">Loading your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-blue-200 space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Assessment Completed!
          </h1>
          <p className="text-blue-600">
            Thank you for completing the {result.positionName} assessment
          </p>
        </div>

        {/* Result Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
            <p className="text-sm text-blue-600">Candidate</p>
            <p className="font-medium">{result.candidateName}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
            <p className="text-sm text-blue-600">Score</p>
            <p className="font-medium">{result.score} / 30</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
            <p className="text-sm text-blue-600">Time Taken</p>
            <p className="font-medium">
              {durationMinutes !== null ? `${durationMinutes} minute(s)` : "N/A"}
            </p>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-5 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">📘 Feedback</h3>
          <p className="text-blue-700 whitespace-pre-line">{result.feedback}</p>
        </div>

        {/* Answer Breakdown */}
        {Array.isArray(result.answers) && result.answers.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-blue-800">Detailed Results</h3>
            <div className="space-y-4">
              {result.answers.map((q, i) => {
                const correctIndexes = (q.correctAnswers || []).map(Number).sort();
                const selectedIndexes = (q.selectedOptions || []).map(Number).sort();
                const isCorrect = JSON.stringify(correctIndexes) === JSON.stringify(selectedIndexes);

                return (
                  <div key={i} className="border-2 border-blue-200 p-5 rounded-xl bg-white">
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
                        const isSelected = selectedIndexes.includes(idx);
                        const isCorrectOpt = correctIndexes.includes(idx);

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
        )}

        <div className="text-center mt-8">
          <p className="text-blue-600">Your results have been recorded.</p>
        </div>
      </div>
    </div>
  );
};

export default CandidateSubmittedPage;