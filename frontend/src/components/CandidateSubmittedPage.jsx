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
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading result...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-green-600 text-center">
           Test Submitted Successfully!
        </h1>

        <div className="text-gray-700 space-y-1 text-center">
          <p><strong>Name:</strong> {result.candidateName}</p>
          <p><strong>Score:</strong> {result.score}/30</p>
          <p><strong>Submitted At:</strong> {new Date(result.submittedAt).toLocaleString()}</p>
          {durationMinutes !== null && (
            <p><strong>Time Taken:</strong> {durationMinutes} minute(s)</p>
          )}
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <p className="text-blue-800 whitespace-pre-line">
            <strong>📘 Feedback:</strong>
            <br />
            {result.feedback}
          </p>
        </div>

        {Array.isArray(result.answers) && result.answers.length > 0 && (
          <>
            <h3 className="text-xl font-semibold text-blue-700">📝 Answer Breakdown</h3>
            <div className="space-y-6">
              {result.answers.map((q, i) => {
                const correctIndexes = (q.correctAnswers || []).map(Number).sort();
                const selectedIndexes = (q.selectedOptions || []).map(Number).sort();
                const isCorrect = JSON.stringify(correctIndexes) === JSON.stringify(selectedIndexes);

                return (
                  <div key={i} className="p-4 border rounded bg-white shadow-sm">
                    <p className="text-base font-semibold text-blue-800 bg-blue-50 px-3 py-2 rounded">
                      {i + 1}. {q.questionText}
                    </p>

                    <div className="space-y-1 text-sm">
                      {q.options?.map((opt, idx) => {
                        const isSelected = selectedIndexes.includes(idx);
                        const isCorrectOpt = correctIndexes.includes(idx);

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
                        <span className="text-green-600 font-semibold">
                          ✅ Answered Correctly
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          ❌ Incorrect Answer
                        </span>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="text-center mt-6">
        </div>
      </div>
    </div>
  );
};

export default CandidateSubmittedPage;
