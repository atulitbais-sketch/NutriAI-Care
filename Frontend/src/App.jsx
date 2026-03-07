import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import LabInput from "./pages/LabInput";   

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login page */}
        <Route path="/" element={<LabInput />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />

        {/* Lab report input page */}
        <Route path="/lab-input" element={<LabInput />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;