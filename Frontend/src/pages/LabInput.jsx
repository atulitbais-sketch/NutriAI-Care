import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LabInput.css";

/* ── SVG Icons ── */
const IconUser = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="8" cy="5" r="3" />
    <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" />
  </svg>
);

const IconGender = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="6" cy="10" r="4" />
    <path d="M9.5 6.5L14 2M14 2h-3M14 2v3" />
  </svg>
);

const IconBlood = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M8 2C8 2 3 7.5 3 10.5a5 5 0 0010 0C13 7.5 8 2 8 2z" />
  </svg>
);

const IconSun = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="8" cy="8" r="3" />
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.22 3.22l1.42 1.42M11.36 11.36l1.42 1.42M3.22 12.78l1.42-1.42M11.36 4.64l1.42-1.42" />
  </svg>
);

const IconSugar = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <rect x="2" y="6" width="12" height="8" rx="2" />
    <path d="M5 6V4a3 3 0 016 0v2" />
    <circle cx="8" cy="10" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const IconArrow = () => (
  <svg className="lf-submit-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 8l3 3 7-7" />
  </svg>
);

const IconBack = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M13 8H3M7 4L3 8l4 4" />
  </svg>
);

const IconInfo = () => (
  <svg viewBox="0 0 10 10" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4" strokeLinecap="round">
    <circle cx="5" cy="5" r="4" />
    <path d="M5 4.5v3M5 3v.5" />
  </svg>
);

/* ── Reference ranges data ── */
const RANGES = [
  { metric: "Haemoglobin", normal: "≥ 12.0",   unit: "g/dL"  },
  { metric: "Vitamin D",   normal: "≥ 20.0",   unit: "ng/mL" },
  { metric: "Fasting Sugar", normal: "70 – 125", unit: "mg/dL" },
];

/* ── Dot grid ── */
function DotGrid() {
  return (
    <div className="ll-dots">
      {Array.from({ length: 36 }).map((_, i) => <span key={i} />)}
    </div>
  );
}

function LabInput() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: "",
    gender: "male",
    hemoglobin: "",
    vitamin_d: "",
    fasting_sugar: "",
  });

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Session expired. Please log in again.");
      setLoading(false);
      navigate("/");
      return;
    }

    try {
      const response = await fetch("https://nutriai-care.onrender.com/api/labs/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          age:           Number(formData.age),
          gender:        formData.gender,
          hemoglobin:    Number(formData.hemoglobin),
          vitamin_d:     Number(formData.vitamin_d),
          fasting_sugar: Number(formData.fasting_sugar),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Failed to analyse report. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess("Lab report analysed and saved successfully.");
      setTimeout(() => navigate("/dashboard"), 1100);
    } catch {
      setError("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="lab-shell">

      {/* ── LEFT: BRAND PANEL ── */}
      <div className="lab-left">
        <div className="ll-grid" />
        <div className="ll-ring" />
        <DotGrid />

        {/* Logo */}
        <div className="ll-logo">
          <div className="ll-logo-mark">N</div>
          <div>
            <div className="ll-logo-text">NutriAI Care</div>
            <div className="ll-logo-sub">Health Analytics</div>
          </div>
        </div>

        {/* Body */}
        <div className="ll-body">
          <h2 className="ll-headline">
            Enter your<br />
            lab <em>values</em><br />
            precisely.
          </h2>
          <p className="ll-desc">
            Accurate input leads to accurate insights. Use values directly from your pathology report for the best AI analysis.
          </p>

          {/* Reference ranges */}
          <div className="ll-ranges">
            <div className="ll-range-head">
              <span>Metric</span>
              <span>Normal Range</span>
              <span>Unit</span>
            </div>
            {RANGES.map((r, i) => (
              <div className="ll-range-row" key={i}>
                <span className="ll-range-metric">{r.metric}</span>
                <span className="ll-range-normal">{r.normal}</span>
                <span className="ll-range-unit">{r.unit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="ll-footer">
          <div className="ll-note">
            <div className="ll-note-icon"><IconInfo /></div>
            <p className="ll-note-text">
              Reference ranges shown are general guidelines. Individual thresholds may vary by age, sex, and clinical context.
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT: FORM ── */}
      <div className="lab-right">
        <div className="lab-form-wrap">

          {/* Header */}
          <div className="lf-header">
            <div className="lf-eyebrow">
              <span className="lf-eyebrow-dot" />
              Lab Report Analyser
            </div>
            <h2 className="lf-title">
              New <span>Report</span>
            </h2>
            <p className="lf-subtitle">
              Enter patient health values below for instant AI-powered analysis and dietary recommendations.
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="lf-msg error">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="7.5" cy="7.5" r="6" />
                <path d="M7.5 4.5v3.5M7.5 10.5v.5" />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="lf-msg success">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="7.5" cy="7.5" r="6" />
                <path d="M5 7.5l2 2 3-3" />
              </svg>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Patient section */}
            <div className="lf-section-label">Patient Details</div>
            <div className="lf-row">
              {/* Age */}
              <div className="lf-field">
                <label className="lf-label" htmlFor="lab-age">Age</label>
                <div className="lf-input-wrap has-hint">
                  <span className="lf-input-icon"><IconUser /></span>
                  <input
                    id="lab-age"
                    className="lf-input"
                    name="age"
                    type="number"
                    placeholder="e.g. 34"
                    min="1" max="120"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                  <span className="lf-hint">yrs</span>
                </div>
              </div>

              {/* Gender */}
              <div className="lf-field">
                <label className="lf-label" htmlFor="lab-gender">Biological Sex</label>
                <div className="lf-input-wrap">
                  <span className="lf-input-icon"><IconGender /></span>
                  <select
                    id="lab-gender"
                    className="lf-select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lab values section */}
            <div className="lf-section-label">Lab Values</div>

            {/* Haemoglobin */}
            <div className="lf-field" style={{ marginBottom: 12 }}>
              <label className="lf-label" htmlFor="lab-hgb">Haemoglobin</label>
              <div className="lf-input-wrap has-hint">
                <span className="lf-input-icon"><IconBlood /></span>
                <input
                  id="lab-hgb"
                  className="lf-input"
                  name="hemoglobin"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 13.5"
                  min="1" max="25"
                  value={formData.hemoglobin}
                  onChange={handleChange}
                  required
                />
                <span className="lf-hint">g/dL</span>
              </div>
            </div>

            {/* Vitamin D */}
            <div className="lf-field" style={{ marginBottom: 12 }}>
              <label className="lf-label" htmlFor="lab-vd">Vitamin D</label>
              <div className="lf-input-wrap has-hint">
                <span className="lf-input-icon"><IconSun /></span>
                <input
                  id="lab-vd"
                  className="lf-input"
                  name="vitamin_d"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 28.0"
                  min="1" max="200"
                  value={formData.vitamin_d}
                  onChange={handleChange}
                  required
                />
                <span className="lf-hint">ng/mL</span>
              </div>
            </div>

            {/* Fasting Sugar */}
            <div className="lf-field">
              <label className="lf-label" htmlFor="lab-sugar">Fasting Blood Sugar</label>
              <div className="lf-input-wrap has-hint">
                <span className="lf-input-icon"><IconSugar /></span>
                <input
                  id="lab-sugar"
                  className="lf-input"
                  name="fasting_sugar"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 95"
                  min="30" max="600"
                  value={formData.fasting_sugar}
                  onChange={handleChange}
                  required
                />
                <span className="lf-hint">mg/dL</span>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="lf-submit" disabled={loading || !!success}>
              <div className="lf-submit-inner">
                {loading
                  ? <><div className="lf-spinner" /> Analysing report…</>
                  : success
                  ? <><IconCheck /> Report saved — redirecting</>
                  : <><span>Analyse Report</span><IconArrow /></>
                }
              </div>
            </button>

          </form>

          {/* Back link */}
          <a
            href="#"
            className="lf-back"
            onClick={e => { e.preventDefault(); navigate("/dashboard"); }}
          >
            <IconBack />
            Back to Dashboard
          </a>

          {/* Disclaimer */}
          <div className="lf-disclaimer">
            Results are AI-generated wellness recommendations only and do not constitute medical advice. Always consult a qualified healthcare professional.
          </div>

        </div>
      </div>

    </div>
  );
}

export default LabInput;
