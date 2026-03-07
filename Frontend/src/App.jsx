import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Upload from "./pages/Upload";         

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root URL → shows Upload page directly */}
        <Route path="/" element={<Login />} />

        {/* Other pages */}
        <Route path="/upload" element={<Upload />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Optional: catch-all route for 404 (you can add later) */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;