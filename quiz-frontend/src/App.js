import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Quiz from "./pages/Quiz";
import AdminPanel from "./pages/AdminPanel";
import { AddQuestion } from "./pages/AddQuestion";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    <Router>
      <div className="container" style={{ marginTop: "80px" }}>
        {/* Add margin-top to prevent content from being hidden */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/dashboard" element={<AdminPanel />} />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/addquestions" element={<AddQuestion />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
