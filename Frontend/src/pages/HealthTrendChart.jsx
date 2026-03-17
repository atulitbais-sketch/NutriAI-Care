import { useEffect, useRef } from "react";
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip } from "chart.js";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

/*
  HealthTrendChart
  Props:
    title   — string, e.g. "Haemoglobin Chart"
    labels  — string[], x-axis dates
    values  — number[], y-axis readings
    unit    — string, e.g. "g/dL"
*/

const PALETTE = {
  green:       "#2d5a3d",
  greenMid:    "#3d6b4f",
  greenHi:     "#4e7f62",
  greenPale:   "rgba(61,107,79,0.08)",
  bark:        "#6b4c2a",
  barkPale:    "rgba(107,76,42,0.08)",
  caution:     "#7a5020",
  cautionPale: "rgba(122,80,32,0.08)",
  stone2:      "#e8e2d8",
  stone4:      "#9e9488",
  ink:         "#1a1714",
  inkSoft:     "#5a5249",
  inkMuted:    "#9e9488",
};

// Pick accent by title keyword
function getAccent(title = "") {
  const t = title.toLowerCase();
  if (t.includes("sugar") || t.includes("glucose")) return { line: PALETTE.caution,  fill: PALETTE.cautionPale, point: PALETTE.caution  };
  if (t.includes("vitamin"))                          return { line: PALETTE.bark,     fill: PALETTE.barkPale,    point: PALETTE.bark     };
  return                                                     { line: PALETTE.green,    fill: PALETTE.greenPale,   point: PALETTE.greenMid };
}

export default function HealthTrendChart({ title, labels, values, unit }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);
  const accent    = getAccent(title);

  const min  = values.length ? Math.min(...values) : 0;
  const max  = values.length ? Math.max(...values) : 100;
  const last = values.length ? values[values.length - 1] : null;
  const prev = values.length > 1 ? values[values.length - 2] : null;
  const delta = prev !== null ? (last - prev) : null;
  const deltaDir = delta === null ? "stable" : delta > 0 ? "up" : delta < 0 ? "down" : "stable";

  useEffect(() => {
    if (!canvasRef.current || !values.length) return;
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }

    const ctx = canvasRef.current.getContext("2d");

    // gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, 200);
    grad.addColorStop(0, accent.fill.replace("0.08", "0.18"));
    grad.addColorStop(1, accent.fill.replace("0.08", "0.01"));

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          data: values,
          borderColor: accent.line,
          borderWidth: 2,
          backgroundColor: grad,
          fill: true,
          tension: 0.42,
          pointBackgroundColor: accent.point,
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: values.length === 1 ? 6 : 4,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: accent.point,
          pointHoverBorderColor: "#fff",
          pointHoverBorderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900, easing: "easeInOutQuart" },
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1a1714",
            titleColor: "#f4f0eb",
            bodyColor: "#9e9488",
            borderColor: "rgba(160,140,110,0.2)",
            borderWidth: 1,
            padding: 10,
            titleFont: { family: "'DM Sans', sans-serif", size: 12, weight: "600" },
            bodyFont:  { family: "'DM Sans', sans-serif", size: 12 },
            callbacks: {
              label: ctx => ` ${ctx.parsed.y} ${unit}`,
            },
            displayColors: false,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(160,140,110,0.08)", drawBorder: false },
            ticks: {
              color: PALETTE.inkMuted,
              font: { family: "'DM Sans', sans-serif", size: 10 },
              maxRotation: 0,
              maxTicksLimit: 6,
            },
            border: { display: false },
          },
          y: {
            grid: { color: "rgba(160,140,110,0.08)", drawBorder: false },
            ticks: {
              color: PALETTE.inkMuted,
              font: { family: "'DM Sans', sans-serif", size: 10 },
              maxTicksLimit: 5,
              callback: v => `${v}`,
            },
            border: { display: false },
            suggestedMin: Math.max(0, min - (max - min) * 0.2),
            suggestedMax: max + (max - min) * 0.2,
          },
        },
      },
    });

    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [labels, values, unit]);

  const badgeStyle = {
    up:     { bg: "var(--ok-pale,#e4ede7)",      color: "var(--ok,#2d5a3d)"       },
    down:   { bg: "var(--alert-pale,#fdf2f2)",   color: "var(--alert,#7a2828)"    },
    stable: { bg: "var(--stone-1,#f4f0eb)",      color: "var(--stone-5,#6b6358)"  },
  }[deltaDir];

  return (
    <div className="card chart-card">
      <div className="card-head">
        <div className="chip chip-green" style={{ background: accent.fill.replace("0.08","0.15"), color: accent.line, border: `1px solid ${accent.line}33` }}>
          {title.split(" ")[0].slice(0,3).toUpperCase()}
        </div>
        <h2 style={{ flex: 1 }}>{title}</h2>
        {last !== null && (
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "var(--ink,#1a1714)",
            marginRight: 8,
          }}>
            {last} <span style={{ fontSize: "0.72rem", color: "var(--ink-muted,#9e9488)", fontFamily: "'DM Sans',sans-serif", fontWeight: 400 }}>{unit}</span>
          </span>
        )}
        {delta !== null && (
          <span style={{
            padding: "3px 10px",
            borderRadius: 4,
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            background: badgeStyle.bg,
            color: badgeStyle.color,
          }}>
            {deltaDir === "up" ? "▲" : deltaDir === "down" ? "▼" : "—"} {Math.abs(delta).toFixed(1)}
          </span>
        )}
      </div>

      <div className="card-body">
        {/* mini stat row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 8,
          marginBottom: 18,
        }}>
          {[
            { label: "Latest",  val: last !== null ? `${last} ${unit}` : "—" },
            { label: "Min",     val: values.length ? `${min} ${unit}` : "—"  },
            { label: "Max",     val: values.length ? `${max} ${unit}` : "—"  },
          ].map((s, i) => (
            <div key={i} style={{
              background: "var(--surface-alt,#f2ede7)",
              border: "1px solid var(--border,rgba(160,140,110,0.18))",
              borderRadius: 10,
              padding: "10px 12px",
            }}>
              <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-muted,#9e9488)", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", fontWeight: 700, color: "var(--ink,#1a1714)" }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* chart */}
        {values.length === 0 ? (
          <div style={{
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--ink-muted,#9e9488)",
            fontSize: "0.85rem",
            fontStyle: "italic",
            background: "var(--stone-1,#f4f0eb)",
            borderRadius: 10,
            border: "1px solid var(--border,rgba(160,140,110,0.18))",
          }}>
            No data available yet
          </div>
        ) : (
          <div className="chart-wrapper">
            <canvas ref={canvasRef} />
          </div>
        )}

        {values.length > 0 && (
          <div style={{
            marginTop: 12,
            fontSize: "0.72rem",
            color: "var(--ink-muted,#9e9488)",
            textAlign: "right",
            fontStyle: "italic",
          }}>
            {values.length} {values.length === 1 ? "reading" : "readings"} recorded
          </div>
        )}
      </div>
    </div>
  );
}
