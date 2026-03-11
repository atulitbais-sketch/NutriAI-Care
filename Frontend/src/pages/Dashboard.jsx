import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [latestReport, setLatestReport] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  if (!token || !userId) {
    navigate("/");
    return;
  }

  fetch(`http://127.0.0.1:8000/api/labs/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setReports(data);
        if (data.length > 0) {
          setLatestReport(data[data.length - 1]);
        }
      } else {
        console.error("Unexpected response:", data);
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching reports:", error);
      setLoading(false);
    });
}, [navigate]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const getWarnings = (report) => {
    if (!report) return [];

    const warnings = [];

    if (report.hemoglobin < 12) warnings.push("Low hemoglobin detected");
    if (report.vitamin_d < 20) warnings.push("Vitamin D deficiency risk");
    if (report.fasting_sugar > 125) warnings.push("High fasting sugar detected");

    if (warnings.length === 0) {
      warnings.push("No major warning signs detected");
    }

    return warnings;
  };

  const getDietRecommendations = (report) => {
    if (!report) return [];

    const recommendations = [];

    if (report.hemoglobin < 12) {
      recommendations.push("Add iron-rich foods like spinach, lentils, and dates");
    }

    if (report.vitamin_d < 20) {
      recommendations.push("Increase sunlight exposure and vitamin D-rich foods");
    }

    if (report.fasting_sugar > 125) {
      recommendations.push("Reduce sugar intake and eat more fiber-rich foods");
    }

    if (recommendations.length === 0) {
      recommendations.push("Maintain a balanced diet and hydration");
    }

    return recommendations;
  };

  const getWellnessScore = (report) => {
    if (!report) return 0;

    let score = 100;
    if (report.hemoglobin < 12) score -= 15;
    if (report.vitamin_d < 20) score -= 20;
    if (report.fasting_sugar > 125) score -= 20;

    return Math.max(score, 40);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">NutriAI Dashboard</h1>
          <p className="dashboard-subtitle">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (!latestReport) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">NutriAI Dashboard</h1>
          <p className="dashboard-subtitle">No lab reports found yet.</p>
          <button
            onClick={() => navigate("/lab-input")}
            style={{
              marginTop: "20px",
              padding: "12px 18px",
              border: "none",
              borderRadius: "10px",
              background: "#2563eb",
              color: "white",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Add First Report
          </button>
        </div>
      </div>
    );
  }

  const warnings = getWarnings(latestReport);
  const dietRecommendations = getDietRecommendations(latestReport);
  const wellnessScore = getWellnessScore(latestReport);

  return (
    <div className="dashboard-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        <div>
          <h1 className="dashboard-title">NutriAI Dashboard</h1>
          <p className="dashboard-subtitle">Showing latest saved patient report</p>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/lab-input")}
            style={{
              padding: "10px 16px",
              border: "none",
              borderRadius: "10px",
              background: "#2563eb",
              color: "white",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Add Lab Report
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: "10px 16px",
              border: "none",
              borderRadius: "10px",
              background: "#dc2626",
              color: "white",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="card-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-icon-wrapper blue">👤</div>
            <h2>Patient Info</h2>
          </div>
          <div className="card-content">
            <div className="info-row">
              <span className="info-label">User ID</span>
              <span className="info-value">{latestReport.user_id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Age</span>
              <span className="info-value">{latestReport.age}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Gender</span>
              <span className="info-value">{latestReport.gender}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Reports Saved</span>
              <span className="info-value">{reports.length}</span>
            </div>
          </div>
        </div>

        <div className="card card-labs">
          <div className="card-header">
            <div className="card-icon-wrapper amber">🧪</div>
            <h2>Lab Results</h2>
          </div>
          <div className="card-content">
            <div className="lab-list">
              <div className="lab-item">
                <div className="lab-left">
                  <span className="lab-icon">🩸</span>
                  <span>Hemoglobin</span>
                </div>
                <span className={`lab-value ${latestReport.hemoglobin < 12 ? "low" : ""}`}>
                  {latestReport.hemoglobin} g/dL
                </span>
              </div>

              <div className="lab-item">
                <div className="lab-left">
                  <span className="lab-icon">☀️</span>
                  <span>Vitamin D</span>
                </div>
                <span className={`lab-value ${latestReport.vitamin_d < 20 ? "low" : ""}`}>
                  {latestReport.vitamin_d} ng/mL
                </span>
              </div>

              <div className="lab-item">
                <div className="lab-left">
                  <span className="lab-icon">🍬</span>
                  <span>Fasting Sugar</span>
                </div>
                <span className={`lab-value ${latestReport.fasting_sugar > 125 ? "high" : ""}`}>
                  {latestReport.fasting_sugar} mg/dL
                </span>
              </div>

              <div className="lab-item">
                <div className="lab-left">
                  <span className="lab-icon">📊</span>
                  <span>Risk Level</span>
                </div>
                <span className="lab-value">{latestReport.risk_level}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-icon-wrapper red">⚠️</div>
            <h2>Warnings</h2>
          </div>
          <div className="card-content">
            <div className="warning-list">
              {warnings.map((warning, index) => (
                <div key={index} className="warning-item">
                  <span className="warning-icon">•</span>
                  <span>{warning}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-icon-wrapper green">🥗</div>
            <h2>Diet Recommendation</h2>
          </div>
          <div className="card-content">
            <ul className="diet-list">
              {dietRecommendations.map((item, index) => (
                <li key={index}>
                  <span className="diet-icon green">✔</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-icon-wrapper blue">💙</div>
            <h2>Overall Wellness</h2>
          </div>
          <div className="card-content">
            <h2 style={{ margin: 0, color: "#2563eb", fontSize: "2rem" }}>
              {wellnessScore}%
            </h2>
            <p style={{ marginTop: "10px", color: "#64748b" }}>
              Based on latest saved report
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-icon-wrapper amber">🤖</div>
            <h2>AI Interpretation</h2>
          </div>
          <div className="card-content">
            <p style={{ margin: 0, color: "#334155", lineHeight: "1.7" }}>
              {latestReport.ai_explanation || "No AI explanation available."}
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-footer">
        Latest report ID: {latestReport.id} | Total saved reports: {reports.length}
      </div>
    </div>
  );
}

export default Dashboard;