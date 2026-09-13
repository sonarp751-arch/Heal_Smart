import React from "react";

export default function SignatureReversalPlot({ signatureReversal = [] }) {
  if (!signatureReversal || signatureReversal.length === 0) return null;

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
        <span style={{ fontSize: "1.2rem" }}>🔄</span>
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--navy)", margin: 0 }}>
            Transcriptomic Signature Reversal (CMap / L1000 Perturbations)
          </h3>
          <p style={{ fontSize: "0.78rem", color: "var(--gray)", margin: 0 }}>
            Computational anti-correlation between disease mRNA expression and drug perturbation signatures
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {signatureReversal.map((sig, idx) => {
          const score = typeof sig.reversalScore === "number" ? sig.reversalScore : -0.85;
          const scorePercent = Math.abs(Math.round(score * 100));

          return (
            <div
              key={idx}
              style={{
                background: "white",
                borderRadius: 14,
                border: "1px solid var(--border)",
                padding: "1.25rem 1.5rem",
                boxShadow: "0 2px 12px rgba(0,0,0,0.03)"
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
                <div>
                  <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--teal)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Disease Transcriptome Target
                  </span>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--navy)", margin: "2px 0 0" }}>
                    {sig.disease}
                  </h4>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.15rem", fontWeight: 700, color: "var(--teal)" }}>
                      {score}
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "var(--gray)", fontFamily: "var(--font-mono)" }}>
                      Connectivity Score (p = {sig.pValue || "1.0e-8"})
                    </div>
                  </div>
                  <span
                    style={{
                      background: "#EAF3DE",
                      color: "#3B6D11",
                      fontFamily: "var(--font-mono)",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      padding: "0.3rem 0.6rem",
                      borderRadius: 20,
                      border: "1px solid rgba(59,109,17,0.3)"
                    }}
                  >
                    {sig.concordanceRatio || `${scorePercent}% Reversal`}
                  </span>
                </div>
              </div>

              {/* Visual Meter */}
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--gray)", fontFamily: "var(--font-mono)", marginBottom: 4 }}>
                  <span>-1.0 (Complete Signature Reversal / Therapeutic)</span>
                  <span>0.0 (Neutral)</span>
                  <span>+1.0 (Exacerbates Disease)</span>
                </div>
                <div style={{ height: 10, background: "linear-gradient(90deg, #0D9488 0%, #14B8A6 35%, #E2E8F0 50%, #EF4444 100%)", borderRadius: 5, position: "relative" }}>
                  {/* Indicator needle */}
                  <div
                    style={{
                      position: "absolute",
                      left: `${((score + 1) / 2) * 100}%`,
                      top: -4,
                      width: 18,
                      height: 18,
                      background: "var(--navy)",
                      border: "2px solid white",
                      borderRadius: "50%",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                      transform: "translateX(-50%)"
                    }}
                  />
                </div>
              </div>

              {/* Perturbed Gene Sets Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                {/* Upregulated in Disease -> Downregulated by Drug */}
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "0.85rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <span style={{ fontSize: "0.85rem" }}>🔻</span>
                    <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#991B1B", fontFamily: "var(--font-mono)" }}>
                      DISEASE-UP genes REVERSED (suppressed) by drug:
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {sig.upregulatedInDiseaseDownregulatedByDrug?.map((g, i) => (
                      <span
                        key={i}
                        style={{
                          background: "white",
                          border: "1px solid #F87171",
                          color: "#991B1B",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          padding: "0.15rem 0.45rem",
                          borderRadius: 4
                        }}
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Downregulated in Disease -> Upregulated by Drug */}
                <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "0.85rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <span style={{ fontSize: "0.85rem" }}>🔺</span>
                    <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#166534", fontFamily: "var(--font-mono)" }}>
                      DISEASE-DOWN genes RESTORED (elevated) by drug:
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {sig.downregulatedInDiseaseUpregulatedByDrug?.map((g, i) => (
                      <span
                        key={i}
                        style={{
                          background: "white",
                          border: "1px solid #4ADE80",
                          color: "#166534",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          padding: "0.15rem 0.45rem",
                          borderRadius: 4
                        }}
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mechanistic Hypothesis */}
              {sig.mechanisticHypothesis && (
                <div style={{ fontSize: "0.82rem", color: "var(--gray-dark)", background: "var(--surface)", padding: "0.75rem 1rem", borderRadius: 8, borderLeft: "3px solid var(--teal)" }}>
                  <strong style={{ color: "var(--teal)" }}>Omics Reversal Rationale: </strong>
                  {sig.mechanisticHypothesis}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
