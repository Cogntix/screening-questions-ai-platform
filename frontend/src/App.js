import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";

import UploadPage from "./pages/dashboard/UploadPage";
import AddInternPage from "./pages/dashboard/AddInternPage";
import ViewInternsPage from "./pages/dashboard/ViewInternsPage";
import ViewPositionPage from "./pages/dashboard/ViewPositionPage";
import ViewResultsPage from "./pages/dashboard/ViewResultsPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login & Dashboard */}
        <Route path="/" element={<AdminLoginPage />} />
        <Route path="/dashboard" element={<AdminDashboard />} />

        {/* Dashboard Functionality Routes */}
        <Route path="/dashboard/upload" element={<UploadPage />} />
        <Route path="/dashboard/add-intern" element={<AddInternPage />} />
        <Route path="/dashboard/view-interns" element={<ViewInternsPage />} />
        <Route path="/dashboard/view-positions" element={<ViewPositionPage />} />
        <Route path="/dashboard/view-results" element={<ViewResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
