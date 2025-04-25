import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminUpload from "./pages/AdminUpload";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminUpload />} />
      </Routes>
    </Router>
  );
}

export default App;
