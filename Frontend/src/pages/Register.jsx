import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

/* ── SVG Icons ── */
const IconUser = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="8" cy="5" r="3" />
    <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" />
  </svg>
);

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
  <svg className="rf-submit-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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

/* ── Password strength ── */
function getStrength(pw) {
  if (!pw) return { score: 0, label: "" };
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const keys   = ["", "weak", "fair", "good", "strong"];
  return { score, label: labels[score], key: keys[score] };
}

/* ── Dot grid ── */
function DotGrid({ cls }) {
  return (
    <div className={cls}>
      {Array.from({ length: 36 }).map((_, i) => <span key={i} />)}
    </div>
  );
}

/* ── Journey steps ── */
const STEPS = [
  { num: "1", title: "Create your account", desc: "Enter your name, email, and a secure password to get started." },
  { num: "2", title: "Verify & set up",      desc: "Log in and explore your personalised health dashboard." },
  { num: "3", title: "Add your first report", desc: "Upload lab values and receive instant AI-driven insights." },
];

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw]     = useState(false);
  const [agreed, setAgreed]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const strength = getStrength(formData.password);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms of Service to continue.");
      return;
    }
    if (strength.score < 2) {
      setError("Please choose a stronger password (min. 6 characters).");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("https://nutriai-care.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess("Account created successfully — redirecting to sign in…");
      setTimeout(() => navigate("/"), 1400);
    } catch {
      setError("Server error. Please try again.");
      setLoading(false);
    }
  };

  /* step indicator: 1 = filling form, 2 = submitting, 3 = done */
  const currentStep = success ? 3 : loading ? 2 : 1;

  return (
    <div className="reg-shell">

      {/* ── LEFT: FORM ── */}
      <div className="reg-left">
        <div className="reg-form-wrap">

          {/* Header */}
          <div className="rf-header">
            <div className="rf-eyebrow">
              <span className="rf-eyebrow-dot" />
              New Account
            </div>
            <h2 className="rf-title">
              Join <span>NutriAI</span>
            </h2>
            <p className="rf-subtitle">
              Start your wellness journey — your lab data, AI insights, and health trends in one place.
            </p>
          </div>

          {/* Step indicator */}
          <div className="rf-steps">
            {["Details", "Verify", "Dashboard"].map((s, i) => (
              <React.Fragment key={i}>
                <div className={`rf-step ${currentStep === i + 1 ? "active" : currentStep > i + 1 ? "done" : ""}`}>
                  <div className="rf-step-num">{currentStep > i + 1 ? "✓" : i + 1}</div>
                  <span>{s}</span>
                </div>
                {i < 2 && <div className="rf-step-line" />}
              </React.Fragment>
            ))}
          </div>

          {/* Messages */}
          {error && (
            <div className="rf-msg error">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="7.5" cy="7.5" r="6" />
                <path d="M7.5 4.5v3.5M7.5 10.5v.5" />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="rf-msg success">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="7.5" cy="7.5" r="6" />
                <path d="M5 7.5l2 2 3-3" />
              </svg>
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister}>
            <div className="rf-fields">

              {/* Name */}
              <div className="rf-field">
                <label className="rf-label" htmlFor="reg-name">Full Name</label>
                <div className="rf-input-wrap">
                  <span className="rf-input-icon"><IconUser /></span>
                  <input
                    id="reg-name"
                    className="rf-input"
                    type="text"
                    name="name"
                    placeholder="Dr. Jane Smith"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="rf-field">
                <label className="rf-label" htmlFor="reg-email">Email Address</label>
                <div className="rf-input-wrap">
                  <span className="rf-input-icon"><IconEmail /></span>
                  <input
                    id="reg-email"
                    className="rf-input"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="rf-field">
                <label className="rf-label" htmlFor="reg-password">Password</label>
                <div className="rf-input-wrap">
                  <span className="rf-input-icon"><IconLock /></span>
                  <input
                    id="reg-password"
                    className="rf-input"
                    type={showPw ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="rf-pw-toggle"
                    onClick={() => setShowPw(v => !v)}
                    tabIndex={-1}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>

                {/* Strength meter */}
                {formData.password && (
                  <div className="rf-strength">
                    <div className="rf-strength-bars">
                      {[1, 2, 3, 4].map(n => (
                        <div
                          key={n}
                          className={`rf-strength-bar ${strength.score >= n ? `active-${strength.key}` : ""}`}
                        />
                      ))}
                    </div>
                    <span className="rf-strength-label">{strength.label}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="rf-terms">
              <input
                className="rf-checkbox"
                type="checkbox"
                id="reg-terms"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
              />
              <label className="rf-terms-text" htmlFor="reg-terms">
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>. I understand this platform provides supportive wellness information, not medical advice.
              </label>
            </div>

            {/* Submit */}
            <button type="submit" className="rf-submit" disabled={loading || !!success}>
              <div className="rf-submit-inner">
                {loading
                  ? <><div className="rf-spinner" /> Creating account…</>
                  : success
                  ? <><IconCheck /> Account created</>
                  : <><span>Create My Account</span><IconArrow /></>
                }
              </div>
            </button>
          </form>

          {/* Divider + login */}
          <div className="rf-divider">
            <div className="rf-divider-line" />
            <span className="rf-divider-text">Already registered?</span>
            <div className="rf-divider-line" />
          </div>

          <p className="rf-login-link">
            Sign in to your existing account &nbsp;<Link to="/">Login here</Link>
          </p>

          {/* Trust badges */}
          <div className="rf-trust">
            <div className="rf-trust-item"><IconShield /><span>Encrypted</span></div>
            <div className="rf-trust-item"><IconCheck /><span>HIPAA Aligned</span></div>
            <div className="rf-trust-item"><IconLeaf /><span>No ads, ever</span></div>
          </div>

        </div>
      </div>

      {/* ── RIGHT: BRAND PANEL ── */}
      <div className="reg-right">
        <div className="rr-grid" />
        <div className="rr-ring" />
        <DotGrid cls="rr-dots" />

        {/* Logo */}
        <div className="rr-logo">
          <div className="rr-logo-mark">N</div>
          <div>
            <div className="rr-logo-text">NutriAI Care</div>
            <div className="rr-logo-sub">Health Analytics</div>
          </div>
        </div>

        {/* Body */}
        <div className="rr-body">
          <h2 className="rr-headline">
            Three steps<br />
            to <em>clearer</em><br />
            health.
          </h2>
          <p className="rr-desc">
            From sign-up to your first AI-powered nutrition insight — it takes under two minutes.
          </p>

          <div className="rr-journey">
            {STEPS.map((s, i) => (
              <div className="rr-step" key={i}>
                <div className="rr-step-dot">{s.num}</div>
                <div className="rr-step-col">
                  <div className="rr-step-text">
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="rr-footer">
          <div className="rr-quote">
            <p>"The greatest wealth is health."</p>
            <cite>— Virgil</cite>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Register;
