import { useNavigate } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="nf-shell">
      {/* ambient blobs */}
      <div className="nf-blob nf-blob-1" />
      <div className="nf-blob nf-blob-2" />
      <div className="nf-grid" />

      <div className="nf-card">
        {/* logo */}
        <div className="nf-logo">
          <div className="nf-logo-mark">N</div>
          <span className="nf-logo-text">NutriAI Care</span>
        </div>

        {/* big 404 */}
        <div className="nf-code">404</div>

        {/* decorative line */}
        <div className="nf-rule" />

        <h1 className="nf-title">Page <span>not found</span></h1>
        <p className="nf-desc">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="nf-actions">
          <button className="nf-btn primary" onClick={() => navigate("/dashboard")}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="1" y="1" width="6" height="6" rx="1.5" />
              <rect x="9" y="1" width="6" height="6" rx="1.5" />
              <rect x="1" y="9" width="6" height="6" rx="1.5" />
              <rect x="9" y="9" width="6" height="6" rx="1.5" />
            </svg>
            Go to Dashboard
          </button>
          <button className="nf-btn ghost" onClick={() => navigate(-1)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M13 8H3M7 4L3 8l4 4" />
            </svg>
            Go back
          </button>
        </div>

        <p className="nf-help">
          Need help? <a href="#">Contact support</a>
        </p>
      </div>
    </div>
  );
}
