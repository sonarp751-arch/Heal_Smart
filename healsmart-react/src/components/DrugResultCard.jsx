import React, { useEffect, useRef, useState } from "react";
import { JAN_STORES_MOCK } from "../data/mockData";

const EVIDENCE_STYLE = {
  "Approved":   { bg: "#EAF3DE", color: "#3B6D11" },
  "Phase 3":    { bg: "var(--teal-bg)",    color: "var(--teal)"    },
  "Phase 2":    { bg: "var(--amber-light)", color: "var(--amber)"  },
  "Phase 1":    { bg: "var(--navy-light)", color: "var(--navy-mid)" },
  "Preclinical":{ bg: "var(--gray-light)", color: "var(--gray)"    },
};

function ConfBar({ value }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 120);
    return () => clearTimeout(t);
  }, [value]);

  const color =
    value >= 80 ? "var(--teal)"  :
    value >= 60 ? "var(--amber)" : "#A32D2D";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <div className="conf-bar-track" style={{ flex: 1 }}>
        <div className="conf-bar-fill" style={{ width: `${width}%`, background: `linear-gradient(90deg, ${color}, ${color}99)` }} />
      </div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: 500, color, minWidth: 36, textAlign: "right" }}>
        {value}%
      </span>
    </div>
  );
}

export default function DrugResultCard({ drug, index = 0 }) {
  const [showStores, setShowStores] = useState(false);
  const {
    drugName, genericName, drugClass, originalUse,
    pathway, confidence, repurposingTargets = [],
    genericPrice, janAushadhiAvailable, summary,
  } = drug;

  return (
    <div
      className="result-card animate-fadeInUp"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.35rem", fontWeight: 600, color: "var(--navy)", fontStyle: "italic" }}>
            {drugName}
          </h3>
          {genericName && (
            <p style={{ fontSize: "0.8rem", color: "var(--gray)", marginTop: 2 }}>
              Generic: {genericName} · {drugClass}
            </p>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.3rem", fontWeight: 700, color: "var(--teal)" }}>
            {genericPrice || "—"}
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--gray)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Jan Aushadhi price
          </div>
        </div>
      </div>

      {/* ── Meta grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "1rem" }}>
        {[
          { key: "Original Use", val: originalUse },
          { key: "Mechanism / Pathway", val: pathway },
          { key: "Drug Class", val: drugClass },
        ].map(({ key, val }) => (
          <div key={key} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--gray)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {key}
            </span>
            <span style={{ fontSize: "0.875rem", color: "var(--gray-dark)", lineHeight: 1.4 }}>{val}</span>
          </div>
        ))}
      </div>

      {/* ── Confidence ── */}
      <div style={{ marginBottom: "1rem" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--gray)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
          AI Confidence Score
        </p>
        <ConfBar value={confidence} />
      </div>

      {/* ── Summary ── */}
      {summary && (
        <p style={{ fontSize: "0.875rem", color: "var(--gray)", lineHeight: 1.7, marginBottom: "1rem", fontWeight: 300 }}>
          {summary}
        </p>
      )}

      {/* ── Repurposing targets ── */}
      {repurposingTargets.length > 0 && (
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", marginBottom: "1rem" }}>
          <h5 style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 400, color: "var(--teal)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "0.75rem" }}>
            Repurposing Opportunities
          </h5>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.6rem" }}>
            {repurposingTargets.map((t) => {
              const st = EVIDENCE_STYLE[t.evidenceLevel] || EVIDENCE_STYLE["Preclinical"];
              return (
                <div key={t.disease} style={{ background: "white", borderRadius: 8, padding: "0.75rem", border: "1px solid var(--border)" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--navy)", marginBottom: 2 }}>
                    {t.disease}
                  </div>
                  {t.notes && (
                    <div style={{ fontSize: "0.75rem", color: "var(--gray)", lineHeight: 1.5, marginBottom: 4 }}>
                      {t.notes}
                    </div>
                  )}
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    fontSize: "0.68rem", fontWeight: 700, padding: "0.15rem 0.45rem",
                    borderRadius: 4, background: st.bg, color: st.color,
                    fontFamily: "var(--font-mono)",
                  }}>
                    {t.evidenceLevel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Jan Aushadhi stores ── */}
      {janAushadhiAvailable && (
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
          <button
            onClick={() => setShowStores(!showStores)}
            style={{
              fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--teal)",
              textTransform: "uppercase", letterSpacing: "0.14em",
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6, marginBottom: showStores ? "0.75rem" : 0,
            }}
          >
            🏪 Jan Aushadhi Stores Near You {showStores ? "▲" : "▼"}
          </button>
          {showStores && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {JAN_STORES_MOCK.map((s) => (
                <div key={s.name} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "0.5rem 0.75rem", background: "white", borderRadius: 8,
                  border: "1px solid var(--border)", fontSize: "0.8rem",
                }}>
                  <span style={{ fontWeight: 500, color: "var(--navy)", fontFamily: "var(--font-sub)", fontSize: "0.85rem" }}>
                    {s.name}
                  </span>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <span style={{ color: "var(--teal)", fontWeight: 600, fontFamily: "var(--font-mono)" }}>
                      {s.distance}
                    </span>
                    <span style={{
                      padding: "0.2rem 0.5rem", borderRadius: 4, fontSize: "0.7rem", fontWeight: 700,
                      background: s.stock ? "var(--teal-bg)" : "var(--red-light)",
                      color: s.stock ? "var(--teal)" : "var(--red)",
                    }}>
                      {s.stock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
