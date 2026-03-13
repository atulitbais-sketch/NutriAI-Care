import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HealthTrendChart from "./HealthTrendChart";
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

  const getStructuredAIOutput = (report) => {
    if (!report) {
      return {
        riskLevel: "Unknown",
        explanation: "No report available.",
        dietAdvice: [],
        nextSteps: []
      };
    }

    const explanationPoints = [];
    const dietAdvice = [];
    const nextSteps = [];

    if (report.hemoglobin < 12) {
      explanationPoints.push(
        `Hemoglobin is low at ${report.hemoglobin} g/dL, which may indicate anemia or iron deficiency.`
      );
      dietAdvice.push("Eat iron-rich foods such as spinach, beetroot, lentils, dates, and jaggery.");
      nextSteps.push("Monitor hemoglobin in the next test and consider consulting a doctor if symptoms persist.");
    }

    if (report.vitamin_d < 20) {
      explanationPoints.push(
        `Vitamin D is low at ${report.vitamin_d} ng/mL, suggesting possible vitamin D deficiency.`
      );
      dietAdvice.push("Include milk, eggs, mushrooms, and safe sunlight exposure in your routine.");
      nextSteps.push("Recheck vitamin D after dietary improvement or supplements if advised by a doctor.");
    }

    if (report.fasting_sugar > 125) {
      explanationPoints.push(
        `Fasting sugar is high at ${report.fasting_sugar} mg/dL, which may indicate poor blood sugar control.`
      );
      dietAdvice.push("Avoid excess sugar, soft drinks, and refined carbs. Prefer oats, salads, and whole grains.");
      nextSteps.push("Track sugar regularly and discuss the reading with a healthcare professional.");
    }

    if (explanationPoints.length === 0) {
      explanationPoints.push("Your key lab values are currently within a safer range.");
      dietAdvice.push("Continue a balanced diet with good hydration, fruits, vegetables, and protein.");
      nextSteps.push("Maintain healthy habits and continue routine checkups.");
    }

    return {
      riskLevel: report.risk_level || "Unknown",
      explanation: report.ai_explanation || explanationPoints.join(" "),
      dietAdvice,
      nextSteps
    };
  };

  const getTrend = (current, previous) => {
    if (previous === undefined || previous === null) {
      return { label: "No previous data", direction: "stable" };
    }

    if (current > previous) {
      return { label: "Increased", direction: "up" };
    }

    if (current < previous) {
      return { label: "Decreased", direction: "down" };
    }

    return { label: "Stable", direction: "stable" };
  };

  const formatReportDate = (report, index) => {
    if (report.created_at) {
      const date = new Date(report.created_at);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString();
      }
    }
    return `Report ${index + 1}`;
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
  const structuredAI = getStructuredAIOutput(latestReport);

  const previousReport = reports.length > 1 ? reports[reports.length - 2] : null;

  const hemoglobinTrend = getTrend(
    latestReport.hemoglobin,
    previousReport?.hemoglobin
  );

  const vitaminDTrend = getTrend(
    latestReport.vitamin_d,
    previousReport?.vitamin_d
  );

  const sugarTrend = getTrend(
    latestReport.fasting_sugar,
    previousReport?.fasting_sugar
  );

  const recentReports = [...reports].reverse().slice(0, 5);

  const chartLabels = reports.map((report, index) => formatReportDate(report, index));
  const hemoglobinValues = reports.map((report) => report.hemoglobin);
  const vitaminDValues = reports.map((report) => report.vitamin_d);
  const sugarValues = reports.map((report) => report.fasting_sugar);

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
      </div>

      <div className="card ai-card">
        <div className="card-header">
          <div className="card-icon-wrapper amber">🤖</div>
          <h2>AI Health Interpretation</h2>
        </div>

        <div className="card-content">
          <div style={{ display: "grid", gap: "20px" }}>
            <div>
              <h3 className="section-title">Risk Level</h3>
              <p className="ai-risk-text">{structuredAI.riskLevel}</p>
            </div>

            <div>
              <h3 className="section-title">Explanation</h3>
              <p className="ai-text">{structuredAI.explanation}</p>
            </div>

            <div>
              <h3 className="section-title">Diet Advice</h3>
              <ul className="ai-list">
                {structuredAI.dietAdvice.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="section-title">Next Steps</h3>
              <ul className="ai-list">
                {structuredAI.nextSteps.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="trends-grid">
        <div className="card trend-card">
          <div className="card-header">
            <div className="card-icon-wrapper blue">📈</div>
            <h2>Hemoglobin Trend</h2>
          </div>
          <div className="card-content">
            <p className="trend-value">{latestReport.hemoglobin} g/dL</p>
            <span className={`trend-badge ${hemoglobinTrend.direction}`}>
              {hemoglobinTrend.label}
            </span>
            {previousReport && (
              <p className="trend-subtext">Previous: {previousReport.hemoglobin} g/dL</p>
            )}
          </div>
        </div>

        <div className="card trend-card">
          <div className="card-header">
            <div className="card-icon-wrapper amber">☀️</div>
            <h2>Vitamin D Trend</h2>
          </div>
          <div className="card-content">
            <p className="trend-value">{latestReport.vitamin_d} ng/mL</p>
            <span className={`trend-badge ${vitaminDTrend.direction}`}>
              {vitaminDTrend.label}
            </span>
            {previousReport && (
              <p className="trend-subtext">Previous: {previousReport.vitamin_d} ng/mL</p>
            )}
          </div>
        </div>

        <div className="card trend-card">
          <div className="card-header">
            <div className="card-icon-wrapper red">🍬</div>
            <h2>Fasting Sugar Trend</h2>
          </div>
          <div className="card-content">
            <p className="trend-value">{latestReport.fasting_sugar} mg/dL</p>
            <span className={`trend-badge ${sugarTrend.direction}`}>
              {sugarTrend.label}
            </span>
            {previousReport && (
              <p className="trend-subtext">Previous: {previousReport.fasting_sugar} mg/dL</p>
            )}
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <HealthTrendChart
          title="Hemoglobin Chart"
          labels={chartLabels}
          values={hemoglobinValues}
          unit="g/dL"
        />

        <HealthTrendChart
          title="Vitamin D Chart"
          labels={chartLabels}
          values={vitaminDValues}
          unit="ng/mL"
        />

        <HealthTrendChart
          title="Fasting Sugar Chart"
          labels={chartLabels}
          values={sugarValues}
          unit="mg/dL"
        />
      </div>

      <div className="card history-card">
        <div className="card-header">
          <div className="card-icon-wrapper blue">🕘</div>
          <h2>Recent Report History</h2>
        </div>
        <div className="card-content">
          <div className="history-table">
            <div className="history-head">
              <span>Date</span>
              <span>Hemoglobin</span>
              <span>Vitamin D</span>
              <span>Sugar</span>
              <span>Risk</span>
            </div>

            {recentReports.map((report, index) => (
              <div className="history-row" key={report.id || index}>
                <span>{formatReportDate(report, index)}</span>
                <span>{report.hemoglobin} g/dL</span>
                <span>{report.vitamin_d} ng/mL</span>
                <span>{report.fasting_sugar} mg/dL</span>
                <span>{report.risk_level}</span>
              </div>
            ))}
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