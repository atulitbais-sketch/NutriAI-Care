import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Login failed");
        return;
      }

      localStorage.setItem("token", data.access_token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: "#4f46e5", margin: "0 0 10px 0" }}>Login</h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>Welcome back!</p>

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

        <p style={{ marginTop: "20px", fontSize: "14px", color: "#555" }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ color: "#4f46e5", textDecoration: "none", fontWeight: "bold" }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;