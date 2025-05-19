import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const CandidateTestPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const answersRef = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = JSON.parse(sessionStorage.getItem("questions")) || [];
    const start = parseInt(sessionStorage.getItem("startTime"), 10) || Date.now();
    sessionStorage.setItem("startTime", start);

    const initAnswers = q.map((q) => ({
      questionId: q._id.toString(),
      selected: [],
    }));

    setQuestions(q);
    setAnswers(initAnswers);
    answersRef.current = initAnswers;

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsedSec = Math.floor((now - start) / 1000);
      const remaining = Math.max(900 - elapsedSec, 0);

      if (remaining === 60) {
        toast.warn("⚠️ Only 1 minute left!", { position: "top-center" });
      }
      
      if (remaining <= 0) {
        clearInterval(timer);
        handleSubmit();
      }

      setTimeLeft(remaining);
    }, 1000);

    const autoSave = setInterval(() => {
      sessionStorage.setItem("autosaveAnswers", JSON.stringify(answersRef.current));
    }, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(autoSave);
    };
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
    answersRef.current = updatedAnswers;
  };

  const handleSubmit = async () => {
    const token = sessionStorage.getItem("candidateToken");
    const start = parseInt(sessionStorage.getItem("startTime"), 10);
    const timeTakenSec = Math.floor((Date.now() - start) / 1000);

    const unanswered = answersRef.current.filter((a) => a.selected.length === 0).length;
    if (unanswered > 0) {
      toast.warn(`${unanswered} unanswered questions. Submitting anyway...`, {
        position: "top-center",
        autoClose: 3000,
      });
    }

    setSubmitting(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/test/submit`, {
        token,
        answers: answersRef.current,
        timeTaken: timeTakenSec,
      });

      sessionStorage.removeItem("questions");
      sessionStorage.removeItem("startTime");
      navigate("/test/submitted");
    } catch (err) {
      toast.error("❌ Submission failed. Please try again.", { position: "top-center" });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-blue-200">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-blue-800">
              {sessionStorage.getItem("positionName")} Assessment
            </h1>
            <p className="text-blue-600">
              Candidate: {sessionStorage.getItem("candidateName")}
            </p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-mono text-lg font-bold flex items-center">
            <span className="mr-2">⏱️</span>
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="w-full bg-blue-100 rounded-full h-2.5 mb-6">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-lg text-sm">
              {currentQ?.questionType === "multi" ? "Multiple Select" : "Single Select"}
            </span>
          </div>
          
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            {currentQ?.questionText}
          </h2>

          <div className="space-y-3">
            {currentQ?.options.map((opt, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selected.includes(idx)
                    ? "bg-blue-600 text-white border-blue-700"
                    : "bg-white border-blue-200 hover:bg-blue-100"
                }`}
                onClick={() => handleOptionToggle(idx)}
              >
                <div className="flex items-center">
                  <span className="mr-3 font-medium">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span>{opt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-between gap-4">
          <button
            disabled={currentIndex === 0 || submitting}
            onClick={() => setCurrentIndex((i) => i - 1)}
            className={`px-6 py-3 rounded-lg font-medium ${
              currentIndex === 0 || submitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            ← Previous Question
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`px-6 py-3 rounded-lg font-medium text-white ${
                submitting
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {submitting ? "Submitting..." : "Submit Assessment"}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Next Question →
            </button>
          )}
        </div>
      </div>
      
      <ToastContainer 
        toastClassName="bg-blue-100 border-2 border-blue-200 text-blue-800"
        progressClassName="bg-blue-400"
      />
    </div>
  );
};

export default CandidateTestPage;