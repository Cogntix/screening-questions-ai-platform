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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.route)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-xl text-lg font-semibold shadow-md transition-all"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-full text-sm font-medium shadow-md transition-all"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
