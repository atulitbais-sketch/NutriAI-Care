import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Login.css";

/* ── SVG Icons ── */
const IconEmail = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <rect x="1" y="3" width="14" height="10" rx="2" />
    <path d="M1 5l7 5 7-5" />
  </svg>
);

const IconLock = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <rect x="3" y="7" width="10" height="8" rx="2" />
    <path d="M5 7V5a3 3 0 016 0v2" />
  </svg>
);

const IconEye = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
    <circle cx="8" cy="8" r="2" />
  </svg>
);

const IconEyeOff = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M2 2l12 12M6.5 6.6A2 2 0 0010 10.5" />
    <path d="M4.2 4.3C2.5 5.4 1 8 1 8s2.5 5 7 5c1.4 0 2.7-.4 3.8-1M7 3.1C7.3 3 7.6 3 8 3c4.5 0 7 5 7 5s-.7 1.4-1.9 2.7" />
  </svg>
);

const IconArrow = () => (
  <svg className="lf-submit-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

const IconShield = () => (
  <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M6.5 1L2 3v4c0 2.8 2 4.5 4.5 5C9 11.5 11 9.8 11 7V3L6.5 1z" />
    <path d="M4.5 6.5l1.5 1.5 2.5-2.5" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M2 6.5l3 3 6-6" />
  </svg>
);

const IconLeaf = () => (
  <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M2 11C2 11 3 5 9 3c0 0 1 5-3 7-2 1-4 1-4 1z" />
    <path d="M2 11l4-4" />
  </svg>
);

/* ── Feature list data ── */
const FEATURES = [
  {
    title: "AI-Powered Insights",
    desc: "Personalised nutrition and health recommendations from your lab data.",
  },
  {
    title: "Lab Trend Tracking",
    desc: "Visualise haemoglobin, Vitamin D, and sugar trends over time.",
  },
  {
    title: "Clinical Wellness Score",
    desc: "A single score summarising your current health status at a glance.",
  },
];

/* ── Dot grid ornament ── */
function DotGrid() {
  return (
    <div className="ll-dots">
      {Array.from({ length: 36 }).map((_, i) => <span key={i} />)}
    </div>
  );
}

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://nutriai-care.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.access_token);
      const decoded = jwtDecode(data.access_token);
      localStorage.setItem("user_id", decoded.sub);
      navigate("/dashboard");
    } catch {
      setError("Unable to connect to server. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">

      {/* ── LEFT PANEL ── */}
      <div className="login-left">
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
          <h1 className="ll-headline">
            Your health,<br />
            <em>understood</em><br />
            clearly.
          </h1>
          <p className="ll-desc">
            Evidence-based nutrition insights and lab trend analysis — built for patients and clinicians who want to see the full picture.
          </p>

          <div className="ll-features">
            {FEATURES.map((f, i) => (
              <div className="ll-feat" key={i}>
                <div className="ll-feat-icon">
                  {i === 0 && <IconLeaf />}
                  {i === 1 && (
                    <svg viewBox="0 0 15 15" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M2 12L5 7l3 3 3-5 2 5" />
                    </svg>
                  )}
                  {i === 2 && <IconCheck />}
                </div>
                <div className="ll-feat-text">
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer quote */}
        <div className="ll-footer">
          <div className="ll-quote">
            <p>"Good health is not something we can buy. However, it can be an extremely valuable savings account."</p>
            <cite>— Anne Wilson Schaef</cite>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="login-right">
        <div className="login-form-wrap">

          {/* Header */}
          <div className="lf-header">
            <div className="lf-eyebrow">
              <span className="lf-eyebrow-dot" />
              Secure Sign In
            </div>
            <h2 className="lf-title">
              Welcome <span>back</span>
            </h2>
            <p className="lf-subtitle">
              Sign in to access your health dashboard and AI-powered insights.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="lf-error">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="#7a2828" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="7.5" cy="7.5" r="6" />
                <path d="M7.5 4.5v3.5M7.5 10.5v.5" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div className="lf-fields">

              {/* Email */}
              <div className="lf-field">
                <label className="lf-label" htmlFor="login-email">Email Address</label>
                <div className="lf-input-wrap">
                  <span className="lf-input-icon"><IconEmail /></span>
                  <input
                    id="login-email"
                    className="lf-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="lf-field">
                <label className="lf-label" htmlFor="login-password">Password</label>
                <div className="lf-input-wrap">
                  <span className="lf-input-icon"><IconLock /></span>
                  <input
                    id="login-password"
                    className="lf-input"
                    type={showPw ? "text" : "password"}
                    placeholder="Your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="lf-pw-toggle"
                    onClick={() => setShowPw(v => !v)}
                    tabIndex={-1}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>
              </div>
            </div>

            {/* Extras */}
            <div className="lf-extras">
              <label className="lf-remember">
                <input
                  className="lf-checkbox"
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                <span className="lf-remember-label">Remember me</span>
              </label>
              <a href="#" className="lf-forgot">Forgot password?</a>
            </div>

            {/* Submit */}
            <button type="submit" className="lf-submit" disabled={loading}>
              <div className="lf-submit-inner">
                {loading
                  ? <><div className="lf-spinner" /> Signing in…</>
                  : <><span>Sign In to Dashboard</span><IconArrow /></>
                }
              </div>
            </button>
          </form>

          {/* Divider */}
          <div className="lf-divider">
            <div className="lf-divider-line" />
            <span className="lf-divider-text">New to NutriAI?</span>
            <div className="lf-divider-line" />
          </div>

          {/* Register */}
          <p className="lf-register">
            Create your free account &nbsp;<Link to="/register">Register here</Link>
          </p>

          {/* Trust */}
          <div className="lf-trust">
            <div className="lf-trust-item">
              <IconShield />
              <span>Encrypted</span>
            </div>
            <div className="lf-trust-item">
              <IconCheck />
              <span>HIPAA Aligned</span>
            </div>
            <div className="lf-trust-item">
              <IconLeaf />
              <span>No ads, ever</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Login;
