import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      label: "📤 Upload Internship PDF",
      route: "/dashboard/upload"
    },
    {
      label: "➕ Add Intern Details",
      route: "/dashboard/add-intern"
    },
    {
      label: "📄 View Internship Positions",
      route: "/dashboard/view-positions"
    },
    {
      label: "🧑‍💻 View Interns",
      route: "/dashboard/view-interns"
    },
    {
      label: "📊 View Intern Results",
      route: "/dashboard/view-results"
    }
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 mb-3">Admin Dashboard</h1>
          <p className="text-blue-600 text-lg">Manage your internship assessments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            onClick={() => navigate("/dashboard/upload")}
            className="bg-blue-100 border-2 border-blue-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:bg-blue-50"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3 text-blue-600">📤</span>
              <span className="text-blue-800 font-medium">Upload Internship PDF</span>
            </div>
          </div>

          <div 
            onClick={() => navigate("/dashboard/add-intern")}
            className="bg-blue-100 border-2 border-blue-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:bg-blue-50"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3 text-blue-600">➕</span>
              <span className="text-blue-800 font-medium">Add Intern Details</span>
            </div>
          </div>

          <div 
            onClick={() => navigate("/dashboard/view-positions")}
            className="bg-blue-100 border-2 border-blue-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:bg-blue-50"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3 text-blue-600">📄</span>
              <span className="text-blue-800 font-medium">View Internship Positions</span>
            </div>
          </div>

          <div 
            onClick={() => navigate("/dashboard/view-interns")}
            className="bg-blue-100 border-2 border-blue-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:bg-blue-50"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3 text-blue-600">🧑‍💻</span>
              <span className="text-blue-800 font-medium">View Interns</span>
            </div>
          </div>

          <div 
            onClick={() => navigate("/dashboard/view-results")}
            className="bg-blue-100 border-2 border-blue-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:bg-blue-50"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3 text-blue-600">📊</span>
              <span className="text-blue-800 font-medium">View Intern Results</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <button
            onClick={handleLogout}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-8 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;