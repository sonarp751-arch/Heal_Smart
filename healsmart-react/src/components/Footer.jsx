import React from "react";
import { useNavigate } from "react-router-dom";

const COLS = [
  {
    heading: "Platform",
    links: ["Upload Report", "Drug Insights", "Jan Aushadhi", "Pharma Portal"],
  },
  {
    heading: "Company",
    links: ["About Us", "Careers", "Press", "Blog"],
  },
  {
    heading: "Legal",
    links: ["Privacy Policy", "Terms of Use", "Disclaimer", "Cookie Policy"],
  },
];

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer style={{ background: "var(--navy)", color: "white", padding: "4rem 2rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Disclaimer strip */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10,
          padding: "1rem 1.25rem",
          marginBottom: "2.5rem",
          fontSize: "0.78rem",
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.65,
          fontFamily: "var(--font-body)",
        }}>
          <strong style={{ color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>Medical Disclaimer:</strong>{" "}
          HealSmart provides educational and research-based insights only. This platform does not prescribe
          medication, provide diagnoses, or substitute professional medical advice. Always consult a licensed
          healthcare professional before making any health decisions.
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: "3rem",
          marginBottom: "3rem",
        }}>
          {/* Brand column */}
          <div>
            <span style={{ fontFamily: "var(--font-head)", fontSize: "1.4rem", fontWeight: 600, fontStyle: "italic", color: "var(--teal-mid)" }}>
              Heal<span style={{ color: "white", fontStyle: "normal", fontWeight: 300 }}>Smart</span>
            </span>
            <p style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, fontWeight: 300, fontFamily: "var(--font-body)" }}>
              AI-powered drug repurposing intelligence for patients, doctors, and pharmaceutical companies.
              Building affordable healthcare, one insight at a time.
            </p>
            <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {["OpenFDA", "ChEMBL", "Jan Aushadhi", "OpenTargets"].map((badge) => (
                <span key={badge} style={{
                  background: "rgba(93,202,165,0.15)",
                  border: "1px solid rgba(93,202,165,0.25)",
                  color: "var(--teal-mid)",
                  fontSize: "0.65rem",
                  padding: "0.2rem 0.5rem",
                  borderRadius: 4,
                  fontFamily: "var(--font-mono)",
                }}>
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLS.map((col) => (
            <div key={col.heading}>
              <h5 style={{
                fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 300,
                color: "rgba(255,255,255,0.6)", marginBottom: "1rem",
                textTransform: "uppercase", letterSpacing: "0.16em",
              }}>
                {col.heading}
              </h5>
              {col.links.map((link) => (
                <button
                  key={link}
                  onClick={() => {
                    if (link === "Upload Report") navigate("/upload-report");
                    else if (link === "Drug Insights") navigate("/drug-insights");
                    else if (link === "Settings") navigate("/settings");
                  }}
                  style={{
                    display: "block", fontFamily: "var(--font-body)",
                    fontSize: "0.85rem", color: "rgba(255,255,255,0.4)",
                    marginBottom: "0.5rem", background: "none",
                    border: "none", cursor: "pointer", textAlign: "left",
                    padding: 0, fontWeight: 300, transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--teal-mid)")}
                  onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.4)")}
                >
                  {link}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.1)",
          fontSize: "0.8rem", color: "rgba(255,255,255,0.3)",
          flexWrap: "wrap", gap: "0.5rem",
        }}>
          <span>© {new Date().getFullYear()} HealSmart Technologies Pvt. Ltd. All rights reserved.</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>
            Powered by OpenRouter AI · Data: OpenFDA · ChEMBL · Jan Aushadhi
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          footer > div > div:nth-child(2) {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          footer > div > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
