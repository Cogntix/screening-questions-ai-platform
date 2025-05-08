import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CandidateTestPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const answersRef = useRef([]); // ✅ Track answers reliably
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = JSON.parse(sessionStorage.getItem("questions")) || [];
    const start = parseInt(sessionStorage.getItem("startTime"), 10);
    const now = Date.now();
    const elapsedSec = Math.floor((now - start) / 1000);
    const remaining = Math.max(900 - elapsedSec, 0);

    const initAnswers = q.map((q) => ({
      questionId: q._id.toString(),
      selected: [],
    }));

    setQuestions(q);
    setAnswers(initAnswers);
    answersRef.current = initAnswers;

    setTimeLeft(remaining);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOptionToggle = (optionIdx) => {
    const currentQ = questions[currentIndex];
    const qId = currentQ._id.toString();

    const updatedAnswers = answersRef.current.map((a) => {
      if (a.questionId !== qId) return a;

      const isMulti = currentQ.questionType === "multi";
      const alreadySelected = a.selected.includes(optionIdx);

      const newSelected = isMulti
        ? alreadySelected
          ? a.selected.filter((s) => s !== optionIdx)
          : [...a.selected, optionIdx]
        : [optionIdx];

      return { ...a, selected: newSelected };
    });

    setAnswers(updatedAnswers);
    answersRef.current = updatedAnswers; // ✅ Keep ref in sync
  };

  const handleSubmit = async () => {
    const token = sessionStorage.getItem("candidateToken");
    const start = parseInt(sessionStorage.getItem("startTime"), 10);
    const timeTakenSec = Math.floor((Date.now() - start) / 1000);

    const unanswered = answersRef.current.filter((a) => a.selected.length === 0).length;
    if (unanswered > 0) {
      const confirmSubmit = window.confirm(
        `${unanswered} questions are unanswered. Submit anyway?`
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    try {
      console.log("Submitting answers:", answersRef.current); 
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/test/submit`, {
        token,
        answers: answersRef.current,
        timeTaken: timeTakenSec,
      });

      sessionStorage.removeItem("questions");
      sessionStorage.removeItem("startTime");
      navigate("/test/submitted");
    } catch (err) {
      alert("Submission failed. Please try again.");
      setSubmitting(false);
    }
  };

  const currentQ = questions[currentIndex];
  const selected = answers[currentIndex]?.selected || [];

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-blue-700">
            Question {currentIndex + 1} of {questions.length}
          </h2>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded font-mono text-sm">
            ⏳ {formatTime(timeLeft)}
          </span>
        </div>

        <div className="text-gray-800">
          <p className="font-medium">{currentQ?.questionText}</p>
        </div>

        <div className="space-y-2">
          {currentQ?.options.map((opt, idx) => (
            <div
              key={idx}
              className={`border px-4 py-2 rounded cursor-pointer ${
                selected.includes(idx)
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-100"
              }`}
              onClick={() => handleOptionToggle(idx)}
            >
              {opt}
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            ⬅️ Previous
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Test"}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Next ➡️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateTestPage;
