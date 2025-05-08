// src/pages/dashboard/DashboardNavArrows.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardNavArrows = ({ backTo = "/dashboard" }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full mt-8 flex justify-start">
      <button
        onClick={() => navigate(backTo)}
        className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </button>
    </div>
  );
};

export default DashboardNavArrows;
