import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";

import UploadPage from "./pages/dashboard/UploadPage";
import AddInternPage from "./pages/dashboard/AddInternPage";
import ViewInternsPage from "./pages/dashboard/ViewInternsPage";
import ViewPositionPage from "./pages/dashboard/ViewPositionPage";
import ViewResultsPage from "./pages/dashboard/ViewResultsPage";
import CandidateLoginPage from "./components/CandidateLoginPage";
import CandidateTestPage from "./components/CandidateTestPage";
import CandidateSubmittedPage from "./components/CandidateSubmittedPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Login & Dashboard */}
        <Route path="/" element={<AdminLoginPage />} />
        <Route path="/dashboard" element={<AdminDashboard />} />

        {/*Admin  Dashboard Functionality Routes */}
        <Route path="/dashboard/upload" element={<UploadPage />} />
        <Route path="/dashboard/add-intern" element={<AddInternPage />} />
        <Route path="/dashboard/view-interns" element={<ViewInternsPage />} />
        <Route path="/dashboard/view-positions" element={<ViewPositionPage />} />
        <Route path="/dashboard/view-results" element={<ViewResultsPage />} />

        {/* Candidate routes */}
        <Route path="/test/:token" element={<CandidateLoginPage />} />
        <Route path="/test/start" element={<CandidateTestPage />} />
        <Route path="/test/submitted" element={<CandidateSubmittedPage />} />
      </Routes>
    </Router>
  );
}

export default App;
