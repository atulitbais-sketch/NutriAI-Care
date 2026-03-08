// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { AuthProvider } from './contexts/AuthContext';
// import Layout from './components/Layout/Layout';
// import ProtectedRoute from './components/Auth/ProtectedRoute';
// import Login from './components/Auth/Login';
// import Register from './components/Auth/Register';
// import HomePage from './pages/HomePage';
// import Dashboard from './pages/Dashboard';
// import LabReports from './pages/LabReports';
// import Profile from './pages/Profile';

// function App() {
//   return (
//     <AuthProvider>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/lab-reports"
//             element={
//               <ProtectedRoute>
//                 <LabReports />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/profile"
//             element={
//               <ProtectedRoute>
//                 <Profile />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </Layout>
//       <ToastContainer position="bottom-right" />
//     </AuthProvider>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout/Layout";
import Login from "./components/Auth/Login";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;