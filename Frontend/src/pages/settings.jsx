import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

/* ── SVG icons ── */
const IconGrid = () => (
  <svg viewBox="0 0 18 18" fill="none" className="sidebar-icon">
    <rect x="1" y="1" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.7)" />
    <rect x="10" y="1" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.7)" />
    <rect x="1" y="10" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.7)" />
    <rect x="10" y="10" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.7)" />
  </svg>
);
const IconChart = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" className="sidebar-icon">
    <path d="M2 12L5 7l3 3 3-5 2 5" />
  </svg>
);
const IconDoc = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" className="sidebar-icon">
    <path d="M4 2h7l3 3v11H4V2z" /><path d="M11 2v3h3" /><path d="M7 9h4M7 12h4" />
  </svg>
);
const IconAI = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round" className="sidebar-icon">
    <circle cx="9" cy="9" r="6" /><path d="M6 9c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3" />
    <path d="M9 3V1M9 17v-2M3 9H1M17 9h-2" />
  </svg>
);
const IconSettings = () => (
  <svg viewBox="0 0 18 18" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round" className="sidebar-icon">
    <circle cx="9" cy="9" r="2.5" />
    <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.22 3.22l1.42 1.42M13.36 13.36l1.42 1.42M3.22 14.78l1.42-1.42M13.36 4.64l1.42-1.42" />
  </svg>
);

/* row icons */
const IUser    = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="8" cy="5" r="3"/><path d="M2 14c0-3 2.7-5 6-5s6 2 6 5"/></svg>;
const IEmail   = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="1" y="3" width="14" height="10" rx="2"/><path d="M1 5l7 5 7-5"/></svg>;
const ILock    = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="3" y="7" width="10" height="8" rx="2"/><path d="M5 7V5a3 3 0 016 0v2"/></svg>;
const IBell    = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 2a5 5 0 015 5v3l1 2H2l1-2V7a5 5 0 015-5z"/><path d="M7 14a1 1 0 002 0"/></svg>;
const IShield  = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 1L3 3v5c0 3 2 5 5 6 3-1 5-3 5-6V3L8 1z"/></svg>;
const ITrash   = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M2 4h12M5 4V2h6v2M6 7v6M10 7v6M3 4l1 10h8L13 4"/></svg>;
const IGlobe   = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><path d="M1 8h14M8 2c-2 2-3 4-3 6s1 4 3 6M8 2c2 2 3 4 3 6s-1 4-3 6"/></svg>;
const IDownload= () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 2v8M5 7l3 3 3-3"/><path d="M2 13h12"/></svg>;
const ICheck   = () => <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 6.5l3 3 6-6"/></svg>;

/* Toggle component */
function Toggle({ checked, onChange }) {
  return (
    <label className="st-toggle">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="st-toggle-track" />
    </label>
  );
}

export default function Settings() {
  const navigate = useNavigate();

  // Derived from localStorage
  const userId = localStorage.getItem("user_id") || "—";

  const [profile, setProfile] = useState({ name: "User", email: "" });
  const [prefs, setPrefs]     = useState({
    units: "metric",
    language: "en",
    emailAlerts: true,
    pushAlerts: false,
    weeklyReport: true,
  });
  const [security, setSecurity] = useState({ twoFactor: false });
  const [dirty, setDirty]   = useState(false);
  const [toast, setToast]   = useState("");
  const [activeNav, setActiveNav] = useState("settings");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const markDirty = () => setDirty(true);

  const handleSave = () => {
    setDirty(false);
    showToast("Settings saved successfully");
  };

  const handleDiscard = () => {
    setDirty(false);
  };

  const handleExport = () => {
    showToast("Exporting your health data…");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure? This will permanently delete your account and all health data.")) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const NAV = [
    { id: "overview",  icon: <IconGrid />,  label: "Overview",  to: "/dashboard" },
    { id: "trends",    icon: <IconChart />, label: "Trends",    to: "/dashboard" },
    { id: "reports",   icon: <IconDoc />,   label: "Reports",   to: "/lab-input" },
    { id: "insights",  icon: <IconAI />,    label: "Insights",  to: "/dashboard" },
  ];

  const initials = profile.name ? profile.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "U";

  return (
    <div className="st-shell">
      {/* ambient */}
      <div className="st-bg">
        <div className="st-blob st-blob-1" />
        <div className="st-blob st-blob-2" />
        <div className="st-grid" />
      </div>

      {/* Sidebar */}
      <aside className="db-sidebar">
        <div className="sidebar-logo" onClick={() => navigate("/dashboard")}>N</div>
        <nav className="sidebar-nav">
          {NAV.map(it => (
            <div key={it.id} className="sidebar-item" onClick={() => navigate(it.to)} title={it.label}>
              {it.icon}
              <span className="sidebar-label">{it.label}</span>
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-item active" title="Settings"><IconSettings /></div>
          <div className="sidebar-avatar" title="Profile">{initials}</div>
        </div>
      </aside>

      <div className="st-main">
        {/* Topbar */}
        <div className="st-topbar">
          <div className="st-topbar-left">
            <span className="st-breadcrumb">NutriAI Care &nbsp;/&nbsp; <span>Settings</span></span>
            <div className="st-topbar-divider" />
            <span className="st-topbar-title">Profile &amp; Preferences</span>
          </div>
          <div className="st-topbar-right">
            <button className="st-topbar-btn ghost" onClick={() => navigate("/dashboard")}>
              ← Dashboard
            </button>
            <button className="st-topbar-btn ghost" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="st-content">

          {/* Profile banner */}
          <div className="st-profile-banner">
            <div className="st-avatar-large">{initials}</div>
            <div className="st-profile-info">
              <div className="st-profile-name">{profile.name || "Your Name"}</div>
              <div className="st-profile-email">{profile.email || "your@email.com"} &nbsp;·&nbsp; ID #{userId}</div>
            </div>
            <div className="st-profile-badge">Free Account</div>
          </div>

          {/* ── PROFILE ── */}
          <div className="st-section">
            <div className="st-section-title">Profile Information</div>
            <div className="st-card">
              <div className="st-row">
                <div className="st-row-left">
                  <div className="st-row-icon green"><IUser /></div>
                  <div className="st-row-text">
                    <h4>Full Name</h4>
                    <p>Displayed on your dashboard and reports</p>
                  </div>
                </div>
                <input
                  className="st-input"
                  type="text"
                  placeholder="Enter your name"
                  value={profile.name}
                  onChange={e => { setProfile(p => ({ ...p, name: e.target.value })); markDirty(); }}
                />
              </div>
              <div className="st-row">
                <div className="st-row-left">
                  <div className="st-row-icon green"><IEmail /></div>
                  <div className="st-row-text">
                    <h4>Email Address</h4>
                    <p>Used for login and alert notifications</p>
                  </div>
                </div>
                <input
                  className="st-input"
                  type="email"
                  placeholder="you@example.com"
                  value={profile.email}
                  onChange={e => { setProfile(p => ({ ...p, email: e.target.value })); markDirty(); }}
                />
              </div>
              <div className="st-row">
                <div className="st-row-left">
                  <div className="st-row-icon stone"><ILock /></div>
                  <div className="st-row-text">
                    <h4>Password</h4>
                    <p>Last changed: unknown</p>
                  </div>
                </div>
                <button className="st-action-btn stone" onClick={() => showToast("Password reset email sent")}>Change Password</button>
              </div>
            </div>
          </div>

          {/* ── PREFERENCES ── */}
          <div className="st-section">
            <div className="st-section-title">Preferences</div>
            <div className="st-card">
              <div className="st-row">
                <div className="st-row-left">
                  <div className="st-row-icon brown"><IGlobe /></div>
                  <div className="st-row-text">
                    <h4>Units</h4>
                    <p>Measurement system for lab values</p>
                  </div>
                </div>
                <select
                  className="st-select"
                  value={prefs.units}
                  onChange={e => { setPrefs(p => ({ ...p, units: e.target.value })); markDirty(); }}
                >
                  <option value="metric">Metric (g/dL, ng/mL)</option>
                  <option value="imperial">Imperial</option>
                </select>
              </div>
              <div className="st-row">
                <div className="st-row-left">
                  <div className="st-row-icon brown"><IGlobe /></div>
                  <div className="st-row-text">
                    <h4>Language</h4>
                    <p>Interface display language</p>
                  </div>
                </div>
                <select
                  className="st-select"
                  value={prefs.language}
                  onChange={e => { setPrefs(p => ({ ...p, language: e.target.value })); markDirty(); }}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="mr">Marathi</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── NOTIFICATIONS ── */}
          <div className="st-section">
            <div className="st-section-title">Notifications</div>
            <div className="st-card">
              <div className="st-row">
                <div className="st-row-left">
                  <div className="st-row-icon green"><IBell /></div>
                  <div className="st-row-text">
                    <h4>Email Alerts</h4>
                    <p>Receive health alerts and recommendations by email</p>
                  </div>
                </div>
                <Toggle checked={prefs.emailAlerts} onChange={e => { setPrefs(p => ({ ...p, emailAlerts: e.target.checked })); markDirty(); }} />
              </div>
              <div className="st-row">
                <div className="st-row-left">
                  <div className="st-row-icon green"><IBell /></div>
                  <div className="st-row-text">
                    <h4>Push Notifications</h4>
                    <p>Browser push notifications for critical alerts</p>
                  </div>
                </div>
                <Toggle checked={prefs.pushAlerts} onChange={e => { setPrefs(p => ({ ...p, pushAlerts: e.target.checked })); markDirty(); }} />
              </div>
              <div className="st-row">
                <div className="st-row-left">
                  <div className="st-row-icon green"><IBell /></div>
                  <div className="st-row-text">
                    <h4>Weekly Health Summary</h4>
                    <p>A weekly digest of your health trends and tips</p>
                  </div>
                </div>
                <Toggle checked={prefs.weeklyReport} onChange={e => { setPrefs(p => ({ ...p, weeklyReport: e.target.checked })); markDirty(); }} />
              </div>
            </div>
          </div>

          {/* ── SECURITY ── */}
          <div className="st-section">
            <div className="st-section-title">Security</div>
            <div className="st-card">
              <div className="st-row">
                <div className="st-row-left">
                  <div className="st-row-icon stone"><IShield /></div>
                  <div className="st-row-text">
                    <h4>Two-Factor Authentication</h4>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                </div>
                <Toggle checked={security.twoFactor} onChange={e => { setSecurity(s => ({ ...s, twoFactor: e.target.checked })); markDirty(); showToast(e.target.checked ? "2FA enabled" : "2FA disabled"); }} />
              </div>
              <div className="st-row">
                <div className="st-row-left">
                  <div className="st-row-icon stone"><IShield /></div>
                  <div className="st-row-text">
                    <h4>Active Sessions</h4>
                    <p>Manage devices where you're logged in</p>
                  </div>
                </div>
                <button className="st-action-btn stone" onClick={() => showToast("All other sessions signed out")}>Sign out all devices</button>
              </div>
            </div>
          </div>

          {/* ── DATA ── */}
          <div className="st-section">
            <div className="st-section-title">Data &amp; Privacy</div>
            <div className="st-card">
              <div className="st-row">
                <div className="st-row-left">
                  <div className="st-row-icon brown"><IDownload /></div>
                  <div className="st-row-text">
                    <h4>Export Health Data</h4>
                    <p>Download all your lab reports and insights as JSON</p>
                  </div>
                </div>
                <button className="st-action-btn green" onClick={handleExport}>Export Data</button>
              </div>
              <div className="st-row">
                <div className="st-row-left">
                  <div className="st-row-icon alert"><ITrash /></div>
                  <div className="st-row-text">
                    <h4>Delete Account</h4>
                    <p>Permanently remove your account and all health data</p>
                  </div>
                </div>
                <button className="st-action-btn danger" onClick={handleDeleteAccount}>Delete Account</button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="st-footer">
          <span className="st-footer-brand">NutriAI Care</span>
          <span>v1.0 &nbsp;·&nbsp; Supportive wellness platform, not medical advice</span>
        </div>
      </div>

      {/* Unsaved changes bar */}
      {dirty && (
        <div className="st-save-bar">
          <span className="st-save-bar-text">You have unsaved changes</span>
          <button className="st-save-bar-btn discard" onClick={handleDiscard}>Discard</button>
          <button className="st-save-bar-btn save" onClick={handleSave}>Save Changes</button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="st-toast">
          <div className="st-toast-icon"><ICheck /></div>
          {toast}
        </div>
      )}

    </div>
  );
}
