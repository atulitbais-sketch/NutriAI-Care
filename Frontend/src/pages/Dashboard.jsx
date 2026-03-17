import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HealthTrendChart from "./HealthTrendChart";
import "./Dashboard.css";

const IconGrid = () => (
  <svg className="sidebar-icon si-grid" viewBox="0 0 18 18" fill="none">
    <rect x="1" y="1" width="7" height="7" rx="1.5" />
    <rect x="10" y="1" width="7" height="7" rx="1.5" />
    <rect x="1" y="10" width="7" height="7" rx="1.5" />
    <rect x="10" y="10" width="7" height="7" rx="1.5" />
  </svg>
);
const IconChart = () => (
  <svg className="sidebar-icon si-chart" viewBox="0 0 18 18">
    <path d="M2 14 L6 9 L10 11 L16 4" />
  </svg>
);
const IconDoc = () => (
  <svg className="sidebar-icon si-doc" viewBox="0 0 18 18">
    <path d="M4 2h7l3 3v11H4V2z" />
    <path d="M11 2v3h3" />
    <path d="M7 9h4M7 12h4" />
  </svg>
);
const IconAI = () => (
  <svg className="sidebar-icon si-ai" viewBox="0 0 18 18">
    <circle cx="9" cy="9" r="6" />
    <path d="M6 9c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3" />
    <path d="M9 3V1M9 17v-2M3 9H1M17 9h-2" />
  </svg>
);
const IconSettings = () => (
  <svg className="sidebar-icon" viewBox="0 0 18 18" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="9" cy="9" r="2.5" />
    <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.22 3.22l1.42 1.42M13.36 13.36l1.42 1.42M3.22 14.78l1.42-1.42M13.36 4.64l1.42-1.42" />
  </svg>
);
const IconLeaf = () => (
  <svg viewBox="0 0 28 28" fill="none" stroke="var(--forest)" strokeWidth="1.8" strokeLinecap="round">
    <path d="M6 22 C6 22 8 10 20 6 C20 6 22 16 14 20 C10 22 6 22 6 22Z" />
    <path d="M6 22 L14 14" />
  </svg>
);

/* ── Score Arc SVG ── */
function ScoreArc({ score }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  return (
    <div className="score-arc-container">
      <svg className="score-arc-svg" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="#fff" />
          </linearGradient>
        </defs>
        <circle className="score-arc-bg" cx="60" cy="60" r={r} />
        <circle
          className="score-arc-fill"
          cx="60" cy="60" r={r}
          strokeDasharray={`${fill} ${circ}`}
        />
      </svg>
      <div className="score-arc-inner">
        <span className="score-arc-number">{score}</span>
        <span className="score-arc-unit">Score</span>
      </div>
    </div>
  );
}

/* ── decorative dot grid for banner ── */
function DotGrid() {
  const dots = Array.from({ length: 25 });
  return (
    <div className="banner-deco-dots">
      {dots.map((_, i) => <span key={i} />)}
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [latestReport, setLatestReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("overview");

  // Scroll spy — update active nav as user scrolls
  useEffect(() => {
    const sections = [
      { id: "overview",  anchor: "section-overview"  },
      { id: "insights",  anchor: "section-insights"  },
      { id: "trends",    anchor: "section-trends"    },
      { id: "reports",   anchor: "section-reports"   },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const matched = sections.find(s => s.anchor === entry.target.id);
            if (matched) setActiveNav(matched.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );

    sections.forEach(s => {
      const el = document.getElementById(s.anchor);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [latestReport]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    if (!token || !userId) { navigate("/"); return; }

    fetch(`https://nutriai-care.onrender.com/api/labs/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReports(data);
          if (data.length > 0) setLatestReport(data[data.length - 1]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const getWarnings = (r) => {
    if (!r) return [];
    const w = [];
    if (r.hemoglobin < 12)    w.push("Low hemoglobin detected");
    if (r.vitamin_d < 20)     w.push("Vitamin D deficiency risk");
    if (r.fasting_sugar > 125) w.push("High fasting sugar detected");
    if (w.length === 0)        w.push("No major warning signs detected");
    return w;
  };

  const getWellnessScore = (r) => {
    if (!r) return 0;
    let s = 100;
    if (r.hemoglobin < 12)     s -= 15;
    if (r.vitamin_d < 20)      s -= 20;
    if (r.fasting_sugar > 125)  s -= 20;
    return Math.max(s, 40);
  };

  const getTrend = (cur, prev) => {
    if (prev === undefined || prev === null) return { label: "No prior data", dir: "stable" };
    if (cur > prev) return { label: "Increased", dir: "up" };
    if (cur < prev) return { label: "Decreased", dir: "down" };
    return { label: "Stable", dir: "stable" };
  };

  const fmtDate = (r, i) => {
    if (r.created_at) {
      const d = new Date(r.created_at);
      if (!isNaN(d)) return d.toLocaleDateString();
    }
    return `Report ${i + 1}`;
  };

  const getAI = (r, prev) => {
    if (!r) return { riskLevel: "Unknown", explanation: "", dietAdvice: [], nextSteps: [] };
    const ep = [], da = [], ns = [];
    const low_hgb = r.hemoglobin < 12;
    const low_vd  = r.vitamin_d < 20;
    const hi_sug  = r.fasting_sugar > 125;
    const hT = prev ? getTrend(r.hemoglobin,    prev.hemoglobin)    : { label: "" };
    const vT = prev ? getTrend(r.vitamin_d,     prev.vitamin_d)     : { label: "" };
    const sT = prev ? getTrend(r.fasting_sugar, prev.fasting_sugar) : { label: "" };

    if (low_hgb) {
      ep.push(`Hemoglobin is low at ${r.hemoglobin} g/dL — may suggest anemia or iron deficiency.`);
      if (hT.label === "Decreased") ep.push("Hemoglobin has dropped since the previous report; close monitoring advised.");
      else if (hT.label === "Increased") ep.push("Hemoglobin has improved from the previous report — a positive sign.");
      da.push("Eat iron-rich foods: spinach, lentils, beans, chickpeas, pumpkin seeds, beetroot.");
      da.push("Pair iron sources with vitamin C (lemon, orange, amla) to boost absorption.");
      ns.push("Monitor hemoglobin in the next test; see a doctor if fatigue, weakness, or dizziness persist.");
    }
    if (low_vd) {
      ep.push(`Vitamin D is low at ${r.vitamin_d} ng/mL — possible deficiency.`);
      if (vT.label === "Decreased") ep.push("Vitamin D has declined since the previous report.");
      else if (vT.label === "Increased") ep.push("Vitamin D has improved — continue current routine.");
      da.push("Include milk, eggs, mushrooms, fortified foods, and safe morning sunlight daily.");
      ns.push("Recheck Vitamin D after dietary changes; consider supplements if prescribed.");
    }
    if (hi_sug) {
      ep.push(`Fasting sugar is high at ${r.fasting_sugar} mg/dL — may indicate poor glycaemic control.`);
      if (sT.label === "Increased") ep.push("Fasting sugar has risen since the previous report — worsening trend.");
      else if (sT.label === "Decreased") ep.push("Fasting sugar has improved from the previous report.");
      da.push("Avoid sugary drinks, bakery items, and refined carbs. Prefer oats, vegetables, pulses, and whole grains.");
      da.push("Choose fibre- and protein-rich balanced meals to stabilise blood sugar.");
      ns.push("Track fasting sugar regularly and discuss readings with a healthcare professional.");
    }
    if (low_hgb && hi_sug) {
      ep.push("Combined low haemoglobin and high sugar requires care — boost iron without spiking glucose.");
      da.push("Prefer diabetes-friendly iron sources: spinach, lentils, tofu, roasted chana, seeds.");
    }
    if (!low_hgb && !low_vd && !hi_sug) {
      ep.push("All key lab values are within safer ranges for this report.");
      da.push("Continue a balanced diet with fruits, vegetables, protein, whole grains, and adequate hydration.");
      ns.push("Maintain healthy habits and keep up routine checkups.");
    }
    ns.push("These are supportive wellness recommendations — not a medical diagnosis.");
    return {
      riskLevel: r.risk_level || "Unknown",
      explanation: r.ai_explanation || ep.join(" "),
      dietAdvice: [...new Set(da)],
      nextSteps:  [...new Set(ns)],
    };
  };

  /* ── LOADING / EMPTY ── */
  if (loading || !latestReport) {
    return (
      <div style={{ display:"flex", minHeight:"100vh" }}>
        <div className="db-bg">
          <div className="db-bg-blob db-bg-blob-1" />
          <div className="db-bg-blob db-bg-blob-2" />
          <div className="db-bg-blob db-bg-blob-3" />
        </div>
        <Sidebar active={activeNav} onNav={setActiveNav} />
        <div className="db-main" style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div className="empty-card" style={{ textAlign:"center" }}>
            <div className="empty-icon"><IconLeaf /></div>
            <h2 className="empty-title">{loading ? "Loading…" : "No Reports Yet"}</h2>
            <p className="empty-sub">
              {loading
                ? "Fetching your health data, please wait."
                : "Add your first lab report to begin tracking your wellness journey."}
            </p>
            {!loading && (
              <button
                onClick={() => navigate("/lab-input")}
                className="topbar-btn primary"
                style={{ padding:"12px 28px", fontSize:"0.9rem" }}
              >
                Add First Report
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const prev  = reports.length > 1 ? reports[reports.length - 2] : null;
  const score = getWellnessScore(latestReport);
  const warnings = getWarnings(latestReport);
  const ai    = getAI(latestReport, prev);
  const hT    = getTrend(latestReport.hemoglobin,    prev?.hemoglobin);
  const vT    = getTrend(latestReport.vitamin_d,     prev?.vitamin_d);
  const sT    = getTrend(latestReport.fasting_sugar, prev?.fasting_sugar);
  const recent = [...reports].reverse().slice(0, 5);

  const chartLabels = reports.map(fmtDate);
  const hgbVals  = reports.map(r => r.hemoglobin);
  const vdVals   = reports.map(r => r.vitamin_d);
  const sugVals  = reports.map(r => r.fasting_sugar);

  /* lab bar fill % (rough normalised) */
  const hgbPct  = Math.min(100, (latestReport.hemoglobin / 17)  * 100);
  const vdPct   = Math.min(100, (latestReport.vitamin_d  / 60)  * 100);
  const sugPct  = Math.min(100, (latestReport.fasting_sugar / 200) * 100);

  const hgbStatus  = latestReport.hemoglobin < 12 ? "caution" : "ok";
  const vdStatus   = latestReport.vitamin_d  < 20 ? "caution" : "ok";
  const sugStatus  = latestReport.fasting_sugar > 125 ? "danger" : "ok";

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>
      {/* ambient bg */}
      <div className="db-bg">
        <div className="db-bg-blob db-bg-blob-1" />
        <div className="db-bg-blob db-bg-blob-2" />
        <div className="db-bg-blob db-bg-blob-3" />
      </div>

      <Sidebar active={activeNav} onNav={setActiveNav} />

      <div className="db-main">
        {/* ── TOPBAR ── */}
        <div className="db-topbar">
          <div className="topbar-left">
            <span className="topbar-breadcrumb">NutriAI Care &nbsp;/&nbsp; <span>Dashboard</span></span>
            <div className="topbar-divider" />
            <span className="topbar-title">Health Overview</span>
          </div>
          <div className="topbar-right">
            <div className="topbar-pill">
              <span className="live-dot" />
              Live Data
            </div>
            <button onClick={() => navigate("/lab-input")} className="topbar-btn primary">
              Add Report
            </button>
            <button onClick={handleLogout} className="topbar-btn ghost">
              Logout
            </button>
          </div>
        </div>

        <div className="db-content">

          {/* ── HERO BANNER ── */}
          <div id="section-overview" className="db-banner mb-section">
            <div className="banner-deco-ring" />
            <DotGrid />
            <div className="banner-inner">
              <div className="banner-text">
                <div className="banner-label">
                  <span className="live-dot" style={{ background: "rgba(255,255,255,0.6)", boxShadow: "none" }} />
                  Health Analytics Platform
                </div>
                <h1 className="banner-title">NutriAI Dashboard</h1>
                <p className="banner-subtitle">
                  Monitor patient wellness, lab trends, and AI-powered nutrition insights — all in one place.
                </p>
              </div>
              <div className="banner-score-wrap">
                <ScoreArc score={score} />
                <div className="banner-kpis">
                  <div className="banner-kpi">
                    <span className="banner-kpi-label">Risk Level</span>
                    <span className="banner-kpi-value">{ai.riskLevel}</span>
                  </div>
                  <div className="banner-kpi">
                    <span className="banner-kpi-label">Total Reports</span>
                    <span className="banner-kpi-value">{reports.length}</span>
                  </div>
                  <div className="banner-kpi">
                    <span className="banner-kpi-label">Latest ID</span>
                    <span className="banner-kpi-value">#{latestReport.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── STAT BAR ── */}
          <div className="stat-bar mb-section">
            <StatTile
              label="Hemoglobin"
              value={latestReport.hemoglobin}
              unit="g/dL"
              sub="Normal ≥ 12 g/dL"
              status={hgbStatus === "caution" ? "caution" : "ok"}
              badge={hgbStatus === "caution" ? "Low" : "Normal"}
              color="t-green"
            />
            <StatTile
              label="Vitamin D"
              value={latestReport.vitamin_d}
              unit="ng/mL"
              sub="Normal ≥ 20 ng/mL"
              status={vdStatus === "caution" ? "caution" : "ok"}
              badge={vdStatus === "caution" ? "Low" : "Normal"}
              color="t-brown"
            />
            <StatTile
              label="Fasting Sugar"
              value={latestReport.fasting_sugar}
              unit="mg/dL"
              sub="Normal ≤ 125 mg/dL"
              status={sugStatus === "danger" ? "danger" : "ok"}
              badge={sugStatus === "danger" ? "High" : "Normal"}
              color="t-caution"
            />
            <StatTile
              label="Wellness Score"
              value={`${score}%`}
              unit=""
              sub={`${reports.length} reports on record`}
              status="neutral"
              badge={ai.riskLevel}
              color="t-stone"
            />
          </div>

          {/* ── TWO COL: Lab Results + Side panels ── */}
          <div className="db-two-col mb-section">
            {/* LEFT: Labs + Warnings */}
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {/* Lab Results */}
              <div className="card">
                <div className="card-head">
                  <div className="chip chip-brown">LAB</div>
                  <h2>Lab Results</h2>
                  <span className="card-tag">Latest Report</span>
                </div>
                <div className="card-body">
                  <div className="lab-list">
                    <LabRow
                      name="Haemoglobin"
                      value={`${latestReport.hemoglobin} g/dL`}
                      status={hgbStatus}
                      pct={hgbPct}
                    />
                    <LabRow
                      name="Vitamin D"
                      value={`${latestReport.vitamin_d} ng/mL`}
                      status={vdStatus}
                      pct={vdPct}
                    />
                    <LabRow
                      name="Fasting Sugar"
                      value={`${latestReport.fasting_sugar} mg/dL`}
                      status={sugStatus}
                      pct={sugPct}
                    />
                    <LabRow
                      name="Risk Classification"
                      value={latestReport.risk_level}
                      status="ok"
                      pct={60}
                    />
                  </div>
                </div>
              </div>

              {/* Warnings */}
              <div className="card">
                <div className="card-head">
                  <div className="chip chip-caution">ALT</div>
                  <h2>Health Alerts</h2>
                </div>
                <div className="card-body">
                  <div className="warning-stack">
                    {warnings.map((w, i) => (
                      <div key={i} className={`warning-row ${w.includes("No major") ? "safe" : ""}`}>
                        <div className={`warn-icon ${w.includes("No major") ? "safe-icon" : ""}`} />
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Patient Info + Snapshot */}
            <div className="panel-stack">
              <div className="card">
                <div className="card-head">
                  <div className="chip chip-green">PT</div>
                  <h2>Patient Info</h2>
                </div>
                <div className="card-body">
                  <div className="row"><span className="row-label">User ID</span><span className="row-val">{latestReport.user_id}</span></div>
                  <div className="row"><span className="row-label">Age</span><span className="row-val">{latestReport.age}</span></div>
                  <div className="row"><span className="row-label">Gender</span><span className="row-val">{latestReport.gender}</span></div>
                  <div className="row"><span className="row-label">Total Reports</span><span className="row-val">{reports.length}</span></div>
                  <div className="row"><span className="row-label">Latest Report ID</span><span className="row-val">#{latestReport.id}</span></div>
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <div className="chip chip-stone">SUM</div>
                  <h2>Quick Snapshot</h2>
                </div>
                <div className="card-body">
                  <div className="snap-grid">
                    <div className="snap-cell">
                      <div className="snap-label">Haemoglobin</div>
                      <div className="snap-val">{latestReport.hemoglobin}<span style={{fontSize:"0.75rem",color:"var(--ink-muted)",marginLeft:3}}>g/dL</span></div>
                    </div>
                    <div className="snap-cell">
                      <div className="snap-label">Vitamin D</div>
                      <div className="snap-val">{latestReport.vitamin_d}<span style={{fontSize:"0.75rem",color:"var(--ink-muted)",marginLeft:3}}>ng/mL</span></div>
                    </div>
                    <div className="snap-cell">
                      <div className="snap-label">Fasting Sugar</div>
                      <div className="snap-val">{latestReport.fasting_sugar}<span style={{fontSize:"0.75rem",color:"var(--ink-muted)",marginLeft:3}}>mg/dL</span></div>
                    </div>
                    <div className="snap-cell">
                      <div className="snap-label">Risk Level</div>
                      <div className="snap-val" style={{fontSize:"1.1rem"}}>{latestReport.risk_level}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── AI INSIGHTS ── */}
          <div id="section-insights" className="card mb-section">
            <div className="card-head">
              <div className="chip chip-green">AI</div>
              <h2>AI Health &amp; Diet Insights</h2>
              <span className="card-tag">Personalised</span>
            </div>
            <div className="card-body">
              <div className="ai-grid">
                <div className="ai-panel">
                  <div className="ai-panel-label">Risk Classification</div>
                  <div className="ai-risk">{ai.riskLevel}</div>
                </div>
                <div className="ai-panel">
                  <div className="ai-panel-label">Clinical Explanation</div>
                  <p className="ai-text">{ai.explanation}</p>
                </div>
                <div className="ai-panel">
                  <div className="ai-panel-label">Dietary Recommendations</div>
                  <ul className="ai-list">
                    {ai.dietAdvice.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div className="ai-panel">
                  <div className="ai-panel-label">Suggested Next Steps</div>
                  <ul className="ai-list">
                    {ai.nextSteps.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ── METRIC TRENDS ── */}
          <div id="section-trends" className="mb-section">
            <div className="section-title-row">
              <div>
                <h2 className="section-h">Metric Trends</h2>
                <p className="section-sub">Latest vs. previous saved report</p>
              </div>
            </div>
            <div className="trend-grid">
              <TrendCard label="Haemoglobin" value={latestReport.hemoglobin} unit="g/dL" trend={hT} prev={prev?.hemoglobin} pct={hgbPct} />
              <TrendCard label="Vitamin D"   value={latestReport.vitamin_d}  unit="ng/mL" trend={vT} prev={prev?.vitamin_d}  pct={vdPct} />
              <TrendCard label="Fasting Sugar" value={latestReport.fasting_sugar} unit="mg/dL" trend={sT} prev={prev?.fasting_sugar} pct={sugPct} />
            </div>
          </div>

          {/* ── CHARTS ── */}
          <div className="mb-section">
            <div className="section-title-row">
              <div>
                <h2 className="section-h">Health Charts</h2>
                <p className="section-sub">Visual history across all saved reports</p>
              </div>
            </div>
            <div className="charts-grid">
              <HealthTrendChart title="Haemoglobin" labels={chartLabels} values={hgbVals} unit="g/dL" />
              <HealthTrendChart title="Vitamin D"   labels={chartLabels} values={vdVals}  unit="ng/mL" />
              <HealthTrendChart title="Fasting Sugar" labels={chartLabels} values={sugVals} unit="mg/dL" />
            </div>
          </div>

          {/* ── HISTORY ── */}
          <div id="section-reports" className="card mb-section">
            <div className="card-head">
              <div className="chip chip-stone">LOG</div>
              <h2>Report History</h2>
              <span className="card-tag">Last 5</span>
            </div>
            <div className="card-body">
              <div className="history-wrap">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Haemoglobin</th>
                      <th>Vitamin D</th>
                      <th>Fasting Sugar</th>
                      <th>Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((r, i) => (
                      <tr key={r.id || i}>
                        <td>{fmtDate(r, i)}</td>
                        <td>{r.hemoglobin} g/dL</td>
                        <td>{r.vitamin_d} ng/mL</td>
                        <td>{r.fasting_sugar} mg/dL</td>
                        <td>
                          <span
                            className="history-risk"
                            style={{
                              background: "var(--forest-pale)",
                              color: "var(--forest)",
                              border: "1px solid rgba(45,90,61,0.15)"
                            }}
                          >
                            {r.risk_level}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>{/* db-content */}

        {/* ── FOOTER ── */}
        <div className="db-footer">
          <span className="db-footer-brand">NutriAI Care</span>
          <span>Report #{latestReport.id} &nbsp;·&nbsp; {reports.length} total records</span>
          <span>Supportive wellness platform — not a substitute for medical advice</span>
        </div>
      </div>{/* db-main */}
    </div>
  );
}

/* ── SUB-COMPONENTS ── */

function Sidebar({ active, onNav }) {
  const items = [
    { id: "overview", icon: <IconGrid />,  label: "Overview",  anchor: "section-overview" },
    { id: "trends",   icon: <IconChart />, label: "Trends",    anchor: "section-trends"   },
    { id: "reports",  icon: <IconDoc />,   label: "Reports",   anchor: "section-reports"  },
    { id: "insights", icon: <IconAI />,    label: "Insights",  anchor: "section-insights" },
  ];

  const handleNav = (item) => {
    onNav(item.id);
    const el = document.getElementById(item.anchor);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <aside className="db-sidebar">
      <div className="sidebar-logo">N</div>
      <nav className="sidebar-nav">
        {items.map(it => (
          <div
            key={it.id}
            className={`sidebar-item ${active === it.id ? "active" : ""}`}
            onClick={() => handleNav(it)}
            title={it.label}
          >
            {it.icon}
            <span className="sidebar-label">{it.label}</span>
          </div>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-item" title="Settings" onClick={() => navigate("/settings")}><IconSettings /></div>
        <div className="sidebar-avatar" title="Profile" onClick={() => navigate("/settings")}>U</div>
      </div>
    </aside>
  );
}

function StatTile({ label, value, unit, sub, status, badge, color }) {
  const badgeClass = { ok:"badge-ok", caution:"badge-caution", danger:"badge-alert", neutral:"badge-neutral" }[status] || "badge-neutral";
  return (
    <div className={`stat-tile ${color}`}>
      <div className="stat-tile-label">{label}</div>
      <div className="stat-tile-value">
        {value}<span style={{fontSize:"0.95rem",color:"var(--ink-muted)",marginLeft:4,fontFamily:"DM Sans",fontWeight:400}}>{unit}</span>
      </div>
      <div className="stat-tile-sub">{sub}</div>
      <span className={`stat-tile-badge ${badgeClass}`}>{badge}</span>
    </div>
  );
}

function LabRow({ name, value, status, pct }) {
  return (
    <div className="lab-row">
      <div className="lab-row-left">
        <span className={`lab-dot ${status}`} />
        <span className="lab-name">{name}</span>
      </div>
      <div className="lab-row-right">
        <div className="lab-bar-wrap">
          <div className={`lab-bar ${status}`} style={{ width: `${pct}%` }} />
        </div>
        <span className={`lab-chip ${status}`}>{value}</span>
      </div>
    </div>
  );
}

function TrendCard({ label, value, unit, trend, prev, pct }) {
  return (
    <div className="trend-card">
      <div className="trend-card-top">
        <span className="trend-card-label">{label}</span>
        <span className={`trend-card-badge ${trend.dir}`}>{trend.label}</span>
      </div>
      <div className="trend-card-body">
        <div className="trend-card-num">
          {value}<span className="trend-card-unit">{unit}</span>
        </div>
        {prev !== undefined && prev !== null && (
          <div className="trend-card-prev">Previous: {prev} {unit}</div>
        )}
      </div>
      <div className="trend-sparkline">
        <div className={`trend-sparkline-fill ${trend.dir}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default Dashboard;
