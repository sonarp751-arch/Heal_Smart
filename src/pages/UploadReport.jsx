import React, { useState } from "react";
import { analyseHealthReport } from "../api/openrouter";
import { scoreHealth, RISK_STYLES } from "../utils/scoreHealth";
import { HEALTH_FALLBACK } from "../data/mockData";
import { useApp } from "../App";
import { LoadingDots, ErrorBanner } from "../components/Feedback";

const BIOMARKERS = [
  { key: "glucose",     label: "Glucose (mg/dL)",          placeholder: "e.g. 95",  hint: "Normal: 70–100" },
  { key: "cholesterol", label: "Total Cholesterol (mg/dL)", placeholder: "e.g. 190", hint: "Optimal: <200" },
  { key: "bp",          label: "Blood Pressure – Systolic", placeholder: "e.g. 120", hint: "Normal: <120 mmHg" },
  { key: "bmi",         label: "BMI",                       placeholder: "e.g. 24.5",hint: "Normal: 18.5–24.9" },
  { key: "hba1c",       label: "HbA1c (%)",                 placeholder: "e.g. 5.4", hint: "Normal: <5.7%" },
  { key: "age",         label: "Age (years)",               placeholder: "e.g. 42",  hint: "For risk calibration" },
];

export default function UploadReport() {
  const { apiKey, showToast } = useApp();

  const [params,   setParams]   = useState({});
  const [notes,    setNotes]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [result,   setResult]   = useState(null);
  const [uploaded, setUploaded] = useState(false);

  const handleInput = (key, val) =>
    setParams((p) => ({ ...p, [key]: parseFloat(val) || undefined }));

  /* Simulate PDF upload by auto-filling demo values */
  const simulateUpload = () => {
    const demo = { glucose: 112, cholesterol: 215, bp: 135, bmi: 27.8, hba1c: 6.1, age: 48 };
    setParams(demo);
    setUploaded(true);
    // Programmatically update visible inputs
    Object.entries(demo).forEach(([k, v]) => {
      const el = document.getElementById(`bio-${k}`);
      if (el) el.value = v;
    });
    showToast("Lab report uploaded — biomarkers auto-filled!");
  };

  const analyse = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let data = null;
      if (apiKey) {
        data = await analyseHealthReport({ ...params, notes }, apiKey);
      }
      // Fallback if API unavailable or no key
      if (!data) {
        const riskLevel = scoreHealth(params);
        data = { riskLevel, riskScore: 0, ...HEALTH_FALLBACK[riskLevel] };
      }
      setResult(data);
    } catch (e) {
      const riskLevel = scoreHealth(params);
      const fallback = { riskLevel, riskScore: 0, ...HEALTH_FALLBACK[riskLevel] };
      setResult(fallback);
      if (e.message !== "NO_KEY") setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const rs = result ? RISK_STYLES[result.riskLevel] : null;

  return (
    <div style={{ paddingTop: 64 }}>
      <div className="hs-section">
        <div className="hs-container" style={{ maxWidth: 880 }}>

          {/* Page header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "var(--teal-bg)", border: "1px solid rgba(15,110,86,0.2)",
              color: "var(--teal)", fontSize: "0.68rem", fontWeight: 400,
              padding: "0.3rem 0.75rem", borderRadius: 20,
              fontFamily: "var(--font-mono)", letterSpacing: "0.06em", marginBottom: "0.875rem",
            }}>
              🩺 AI Health Insights
            </div>
            <h1 style={{ fontFamily: "var(--font-head)", fontSize: "2.4rem", fontWeight: 600, color: "var(--navy)", fontStyle: "italic", letterSpacing: "-0.01em", marginBottom: "0.5rem" }}>
              Upload Health Report
            </h1>
            <p style={{ color: "var(--gray)", fontWeight: 300, fontSize: "0.9375rem" }}>
              Upload your lab report or manually enter biomarkers to receive an AI-powered risk summary and educational medication insights.
              {!apiKey && (
                <span style={{ color: "var(--amber)", marginLeft: "0.5rem", fontSize: "0.8rem" }}>
                  (No API key — using local risk scoring)
                </span>
              )}
            </p>
          </div>

          {/* Card: Upload + inputs */}
          <div style={{ background: "white", borderRadius: 20, padding: "2rem", border: "1px solid var(--border)", marginBottom: "1.5rem" }}>

            {/* Upload zone */}
            <h4 style={{ fontFamily: "var(--font-head)", fontSize: "1.1rem", fontWeight: 600, color: "var(--navy)", fontStyle: "italic", marginBottom: "1rem" }}>
              📁 Upload Lab Report <span style={{ fontStyle: "normal", fontWeight: 300, fontSize: "0.9rem" }}>(PDF / Image)</span>
            </h4>
            <div
              className="upload-zone"
              onClick={simulateUpload}
              style={{ marginBottom: "1.5rem" }}
            >
              {uploaded ? (
                <>
                  <div style={{ fontSize: "2rem", marginBottom: 6 }}>✅</div>
                  <p style={{ fontWeight: 500, color: "var(--teal)" }}>lab_report_2024.pdf uploaded</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--gray)", marginTop: 4, fontWeight: 300 }}>Biomarkers auto-filled from report</p>
                </>
              ) : (
                <>
                  <div style={{ fontSize: "2.5rem", marginBottom: 6 }}>📄</div>
                  <p style={{ color: "var(--gray)", fontWeight: 300 }}>
                    Drop your lab report here or <strong style={{ color: "var(--teal)", fontWeight: 500 }}>browse files</strong>
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--gray)", marginTop: 4, fontWeight: 300 }}>
                    Supports PDF, JPG, PNG · Max 10 MB · Click to demo with sample data
                  </p>
                </>
              )}
            </div>

            {/* Biomarker inputs */}
            <h4 style={{ fontFamily: "var(--font-head)", fontSize: "1.1rem", fontWeight: 600, color: "var(--navy)", fontStyle: "italic", marginBottom: "1rem" }}>
              🧪 Or Enter Biomarkers Manually
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
              {BIOMARKERS.map((b) => (
                <div key={b.key}>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 400, color: "var(--gray)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {b.label}
                  </label>
                  <input
                    id={`bio-${b.key}`}
                    className="hs-input"
                    type="number"
                    placeholder={b.placeholder}
                    defaultValue={params[b.key] || ""}
                    onChange={(e) => handleInput(b.key, e.target.value)}
                  />
                  <div style={{ fontSize: "0.65rem", color: "var(--gray)", marginTop: 3, fontFamily: "var(--font-mono)" }}>{b.hint}</div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 400, color: "var(--gray)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Additional Notes (optional)
              </label>
              <textarea
                className="hs-input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Family history, current medications, symptoms, lifestyle…"
                style={{ resize: "vertical", minHeight: 72 }}
              />
            </div>

            <button
              onClick={analyse}
              disabled={loading}
              style={{
                width: "100%", padding: "0.9rem",
                background: loading ? "rgba(15,110,86,0.4)" : "var(--teal)",
                color: "white", border: "none", borderRadius: 10,
                fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.04em", transition: "background 0.2s",
              }}
            >
              {loading ? "🔄 Analysing with AI…" : "🔍 Analyse Health Report"}
            </button>
          </div>

          {loading && <LoadingDots message="AI is analysing your biomarkers…" />}
          {error   && !result && <ErrorBanner error={error} onRetry={analyse} />}

          {/* ── Results ── */}
          {result && (
            <div className="animate-fadeInUp">

              {/* Risk banner */}
              <div style={{ background: "white", borderRadius: 20, padding: "2rem", border: "1px solid var(--border)", marginBottom: "1.25rem" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "1rem",
                  padding: "1rem 1.25rem",
                  background: rs.bg, border: `1px solid ${rs.border}`,
                  borderRadius: 12, marginBottom: "1.25rem",
                }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: rs.dot, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: "var(--font-head)", fontSize: "1.2rem", fontWeight: 600, color: rs.text, fontStyle: "italic" }}>
                      {result.riskLevel} Risk
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--gray)" }}>Based on submitted biomarker profile</div>
                  </div>
                </div>
                <p style={{ fontSize: "0.875rem", color: "var(--gray)", lineHeight: 1.7, fontWeight: 300, marginBottom: "1rem" }}>
                  {result.summary}
                </p>
                {result.concerns?.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {result.concerns.map((c) => (
                      <span key={c} style={{ fontSize: "0.75rem", background: "var(--red-light)", color: "var(--red)", padding: "0.25rem 0.6rem", borderRadius: 6, fontWeight: 500 }}>
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Medications */}
              <MedSection
                title="💊 Related Medications"
                subtitle="For awareness only — not a prescription"
                items={result.medications}
                renderItem={(m) => (
                  <div key={m.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{m.name}</div>
                      {m.reason && <div style={{ fontSize: "0.75rem", color: "var(--gray)", marginTop: 2 }}>{m.reason}</div>}
                    </div>
                    <span style={{ background: "var(--teal-bg)", color: "var(--teal)", fontSize: "0.7rem", padding: "0.2rem 0.5rem", borderRadius: 4, fontWeight: 600 }}>
                      {m.category}
                    </span>
                  </div>
                )}
              />

              {/* Generics */}
              <MedSection
                title="💰 Affordable Generic Alternatives"
                subtitle="Educational examples — prices vary by region"
                items={result.generics}
                renderItem={(g) => (
                  <div key={g.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{g.name}</div>
                      {g.note && <div style={{ fontSize: "0.75rem", color: "var(--gray)", marginTop: 2 }}>{g.note}</div>}
                    </div>
                    <span style={{ background: "#EAF3DE", color: "#3B6D11", fontSize: "0.75rem", padding: "0.2rem 0.6rem", borderRadius: 4, fontWeight: 700, fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>
                      {g.estimatedCost}
                    </span>
                  </div>
                )}
              />

              {/* Lifestyle */}
              {result.lifestyleAdvice?.length > 0 && (
                <div style={{ background: "white", borderRadius: 16, padding: "1.75rem", border: "1px solid var(--border)", marginBottom: "1.25rem" }}>
                  <h4 style={{ fontFamily: "var(--font-head)", fontSize: "1.1rem", fontWeight: 600, color: "var(--navy)", fontStyle: "italic", marginBottom: "1rem" }}>
                    🌱 Lifestyle Recommendations
                  </h4>
                  {result.lifestyleAdvice.map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.5rem", fontSize: "0.875rem", color: "var(--gray)", lineHeight: 1.5 }}>
                      <span style={{ color: "var(--teal)", fontWeight: 700, fontFamily: "var(--font-mono)", minWidth: 24 }}>{String(i+1).padStart(2,"0")}</span>
                      {a}
                    </div>
                  ))}
                </div>
              )}

              {/* Disclaimer */}
              <div className="hs-disclaimer">
                <strong style={{ color: "var(--teal)", fontWeight: 500 }}>⚕️ Medical Disclaimer:</strong>{" "}
                This platform provides research-based, educational insights and does <strong>not</strong> prescribe medication
                or give medical advice. The information above is for general awareness only. Always consult a licensed
                healthcare professional before making any health or medication decisions.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MedSection({ title, subtitle, items, renderItem }) {
  if (!items?.length) return null;
  return (
    <div style={{ background: "white", borderRadius: 16, padding: "1.75rem", border: "1px solid var(--border)", marginBottom: "1.25rem" }}>
      <h4 style={{ fontFamily: "var(--font-head)", fontSize: "1.1rem", fontWeight: 600, color: "var(--navy)", fontStyle: "italic", marginBottom: "0.25rem" }}>
        {title}
      </h4>
      <p style={{ fontSize: "0.75rem", color: "var(--gray)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em", marginBottom: "1rem" }}>
        {subtitle}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {items.map((item) => (
          <div key={item.name} style={{ background: "var(--surface)", borderRadius: 8, padding: "0.875rem 1rem", border: "1px solid var(--border)" }}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}
