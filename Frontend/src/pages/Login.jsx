import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // This is the "GPS" to move pages

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize the navigator

  const containerStyle = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #4f46e5, #22c55e)",
    position: "fixed",
    top: 0,
    left: 0,
    margin: 0,
    padding: 0,
    zIndex: 9999,
    fontFamily: "sans-serif"
  };

  const cardStyle = {
    background: "white",
    padding: "40px",
    borderRadius: "16px",
    width: "320px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    textAlign: "center"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    fontSize: "16px"
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
    fontSize: "18px"
  };

  // This is the function that runs when you click the button
  const handleLogin = (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    
    // For now, we simulate a successful login
    console.log("Logging in with:", email, password);
    
    // This takes you to the /dashboard route
    navigate("/dashboard"); 
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{color: "#4f46e5", margin: "0 0 10px 0"}}>Login</h2>
        <p style={{color: "#666", marginBottom: "20px"}}>Welcome back!</p>
        
        {/* Added handleLogin to the form's onSubmit */}
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email" 
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>

        <p style={{marginTop: "20px", fontSize: "14px", color: "#555"}}>
          Don't have an account? <a href="/register" style={{color: "#4f46e5", textDecoration: "none", fontWeight: "bold"}}>Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;