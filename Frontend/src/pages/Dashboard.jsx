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

  const getWellnessScore = (report) => {
    if (!report) return 0;

    let score = 100;

    if (report.hemoglobin < 12) score -= 15;
    if (report.vitamin_d < 20) score -= 20;
    if (report.fasting_sugar > 125) score -= 20;

    return Math.max(score, 40);
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

  const getStructuredAIOutput = (report, previousReport) => {
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

    const hasLowHemoglobin = report.hemoglobin < 12;
    const hasLowVitaminD = report.vitamin_d < 20;
    const hasHighSugar = report.fasting_sugar > 125;

    const hemoglobinTrend = previousReport
      ? getTrend(report.hemoglobin, previousReport.hemoglobin)
      : { label: "No previous data" };

    const vitaminDTrend = previousReport
      ? getTrend(report.vitamin_d, previousReport.vitamin_d)
      : { label: "No previous data" };

    const sugarTrend = previousReport
      ? getTrend(report.fasting_sugar, previousReport.fasting_sugar)
      : { label: "No previous data" };

    if (hasLowHemoglobin) {
      explanationPoints.push(
        `Hemoglobin is low at ${report.hemoglobin} g/dL, which may suggest anemia or low iron levels.`
      );

      if (hemoglobinTrend.label === "Decreased") {
        explanationPoints.push(
          "Compared to the previous report, hemoglobin has decreased, so extra attention is needed."
        );
      } else if (hemoglobinTrend.label === "Increased") {
        explanationPoints.push(
          "Compared to the previous report, hemoglobin has improved, which is a positive sign."
        );
      }

      dietAdvice.push(
        "Eat iron-rich foods such as spinach, lentils, beans, chickpeas, pumpkin seeds, and beetroot."
      );
      dietAdvice.push(
        "Pair iron-rich foods with vitamin C sources like lemon, orange, or amla to improve absorption."
      );

      nextSteps.push(
        "Monitor hemoglobin in the next test and consider consulting a doctor if fatigue, weakness, or dizziness continue."
      );
    }

    if (hasLowVitaminD) {
      explanationPoints.push(
        `Vitamin D is low at ${report.vitamin_d} ng/mL, suggesting possible vitamin D deficiency.`
      );

      if (vitaminDTrend.label === "Decreased") {
        explanationPoints.push(
          "Vitamin D has decreased compared to the previous report."
        );
      } else if (vitaminDTrend.label === "Increased") {
        explanationPoints.push(
          "Vitamin D has improved compared to the previous report."
        );
      }

      dietAdvice.push(
        "Include milk, eggs, mushrooms, fortified foods, and safe morning sunlight exposure in your routine."
      );

      nextSteps.push(
        "Recheck vitamin D after dietary improvement and sunlight exposure, or after supplements if prescribed."
      );
    }

    if (hasHighSugar) {
      explanationPoints.push(
        `Fasting sugar is high at ${report.fasting_sugar} mg/dL, which may indicate poor blood sugar control.`
      );

      if (sugarTrend.label === "Increased") {
        explanationPoints.push(
          "Fasting sugar has increased compared to the previous report, showing a worsening trend."
        );
      } else if (sugarTrend.label === "Decreased") {
        explanationPoints.push(
          "Fasting sugar has decreased compared to the previous report, which is a good sign."
        );
      }

      dietAdvice.push(
        "Avoid excess sugar, sweet drinks, bakery items, and refined carbs. Prefer oats, vegetables, pulses, salads, and whole grains."
      );
      dietAdvice.push(
        "Choose balanced meals with more fiber and protein to help manage blood sugar."
      );

      nextSteps.push(
        "Track sugar regularly and discuss these readings with a healthcare professional."
      );
    }

    if (hasLowHemoglobin && hasHighSugar) {
      explanationPoints.push(
        "Because hemoglobin is low and fasting sugar is high together, diet should improve iron intake without adding too much sugar."
      );

      dietAdvice.push(
        "Prefer iron-rich but diabetes-friendly foods like spinach, lentils, tofu, roasted chana, beans, and seeds instead of sugary iron sources."
      );
    }

    if (!hasLowHemoglobin && !hasLowVitaminD && !hasHighSugar) {
      explanationPoints.push(
        "Your key lab values are currently within a safer range based on this report."
      );

      dietAdvice.push(
        "Continue a balanced diet with fruits, vegetables, protein, whole grains, and proper hydration."
      );

      nextSteps.push(
        "Maintain healthy habits and continue routine checkups to track long-term wellness."
      );
    }

    nextSteps.push(
      "These suggestions are supportive wellness recommendations and not a medical diagnosis."
    );

    return {
      riskLevel: report.risk_level || "Unknown",
      explanation: report.ai_explanation || explanationPoints.join(" "),
      dietAdvice: [...new Set(dietAdvice)],
      nextSteps: [...new Set(nextSteps)]
    };
  };

  if (loading) {
    return (
      <div className="dashboard-shell">
        <div className="dashboard-container">
          <div className="dashboard-empty-state">
            <h1 className="dashboard-title">NutriAI Dashboard</h1>
            <p className="dashboard-subtitle">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!latestReport) {
    return (
      <div className="dashboard-shell">
        <div className="dashboard-container">
          <div className="dashboard-empty-state">
            <h1 className="dashboard-title">NutriAI Dashboard</h1>
            <p className="dashboard-subtitle">No lab reports found yet.</p>
            <button
              onClick={() => navigate("/lab-input")}
              className="dashboard-btn primary"
            >
              Add First Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  const previousReport = reports.length > 1 ? reports[reports.length - 2] : null;

  const warnings = getWarnings(latestReport);
  const wellnessScore = getWellnessScore(latestReport);
  const structuredAI = getStructuredAIOutput(latestReport, previousReport);

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
    <div className="dashboard-shell">
      <div className="dashboard-container">
        <div className="dashboard-topbar">
          <div>
            <div className="dashboard-badge">Health Analytics Platform</div>
            <h1 className="dashboard-title">NutriAI Dashboard</h1>
            <p className="dashboard-subtitle">
              Monitor patient wellness, lab trends, and AI-powered nutrition insights
            </p>
          </div>

          <div className="dashboard-actions">
            <button
              onClick={() => navigate("/lab-input")}
              className="dashboard-btn primary"
            >
              Add Lab Report
            </button>

            <button
              onClick={handleLogout}
              className="dashboard-btn secondary danger"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="hero-grid">
          <div className="hero-card hero-main">
            <div className="hero-main-top">
              <div>
                <p className="hero-label">Overall Wellness Score</p>
                <h2 className="hero-score">{wellnessScore}%</h2>
                <p className="hero-caption">Calculated from the latest report values</p>
              </div>
              <div className="hero-ring">
                <span>{wellnessScore}</span>
              </div>
            </div>

            <div className="hero-stats">
              <div className="mini-stat">
                <span className="mini-stat-label">Risk Level</span>
                <strong>{structuredAI.riskLevel}</strong>
              </div>
              <div className="mini-stat">
                <span className="mini-stat-label">Reports Saved</span>
                <strong>{reports.length}</strong>
              </div>
              <div className="mini-stat">
                <span className="mini-stat-label">Latest Report ID</span>
                <strong>#{latestReport.id}</strong>
              </div>
            </div>
          </div>

          <div className="hero-card hero-side">
            <p className="hero-label">Quick Warnings</p>
            <div className="warning-list compact">
              {warnings.map((warning, index) => (
                <div key={index} className="warning-item">
                  <span className="warning-dot"></span>
                  <span>{warning}</span>
                </div>
              ))}
            </div>
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
                  <span className={`lab-value ${latestReport.hemoglobin < 12 ? "low" : "normal"}`}>
                    {latestReport.hemoglobin} g/dL
                  </span>
                </div>

                <div className="lab-item">
                  <div className="lab-left">
                    <span className="lab-icon">☀️</span>
                    <span>Vitamin D</span>
                  </div>
                  <span className={`lab-value ${latestReport.vitamin_d < 20 ? "low" : "normal"}`}>
                    {latestReport.vitamin_d} ng/mL
                  </span>
                </div>

                <div className="lab-item">
                  <div className="lab-left">
                    <span className="lab-icon">🍬</span>
                    <span>Fasting Sugar</span>
                  </div>
                  <span className={`lab-value ${latestReport.fasting_sugar > 125 ? "high" : "normal"}`}>
                    {latestReport.fasting_sugar} mg/dL
                  </span>
                </div>

                <div className="lab-item">
                  <div className="lab-left">
                    <span className="lab-icon">📊</span>
                    <span>Risk Level</span>
                  </div>
                  <span className="lab-value normal">{latestReport.risk_level}</span>
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
                    <span className="warning-dot"></span>
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-icon-wrapper green">💙</div>
              <h2>Snapshot</h2>
            </div>
            <div className="card-content">
              <div className="snapshot-stack">
                <div className="snapshot-item">
                  <span>Latest Hemoglobin</span>
                  <strong>{latestReport.hemoglobin} g/dL</strong>
                </div>
                <div className="snapshot-item">
                  <span>Latest Vitamin D</span>
                  <strong>{latestReport.vitamin_d} ng/mL</strong>
                </div>
                <div className="snapshot-item">
                  <span>Latest Sugar</span>
                  <strong>{latestReport.fasting_sugar} mg/dL</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card ai-card">
          <div className="card-header">
            <div className="card-icon-wrapper amber">🤖</div>
            <h2>AI Health & Diet Insights</h2>
          </div>

          <div className="card-content">
            <div className="ai-grid">
              <div className="ai-panel">
                <h3 className="section-title">Risk Level</h3>
                <p className="ai-risk-text">{structuredAI.riskLevel}</p>
              </div>

              <div className="ai-panel ai-panel-wide">
                <h3 className="section-title">Explanation</h3>
                <p className="ai-text">{structuredAI.explanation}</p>
              </div>

              <div className="ai-panel">
                <h3 className="section-title">Diet Advice</h3>
                <ul className="ai-list">
                  {structuredAI.dietAdvice.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="ai-panel">
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

        <div className="section-block">
          <div className="section-heading-row">
            <div>
              <h2 className="section-heading">Metric Trends</h2>
              <p className="section-subheading">Compare latest readings with the previous saved report</p>
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
        </div>

        <div className="section-block">
          <div className="section-heading-row">
            <div>
              <h2 className="section-heading">Health Charts</h2>
              <p className="section-subheading">Visual history of saved reports</p>
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
    </div>
  );
}

export default Dashboard;