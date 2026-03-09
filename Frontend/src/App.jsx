import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Import your new Login page (Make sure the path matches your folder!)
// If your Login.jsx is in 'pages', use "./pages/Login"
// If it is in 'components/Auth', use "./components/Auth/Login"
import Login from "./pages/Login"; 
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* We removed <Layout> temporarily so your styles can breathe! */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;