import React from "react";

export default function OmicsExpressionHeatmap({ geneSymbol, gtexExpression = {} }) {
  const tissues = Object.entries(gtexExpression);
  const maxVal = Math.max(...tissues.map(([_, val]) => val), 1);

  const getHeatmapColor = (val) => {
    const ratio = val / maxVal;
    if (ratio > 0.75) return "#0D9488"; // High: Teal
    if (ratio > 0.45) return "#14B8A6"; // Med-High
    if (ratio > 0.2) return "#5EEAD4";  // Medium
    return "#CCFBF1";                   // Low
  };

  return (
    <div style={{ background: "var(--surface)", borderRadius: 10, padding: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <h4 style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--navy)", margin: 0 }}>
            GTEx v8 Median RNA Expression (TPM)
          </h4>
          <span style={{ fontSize: "0.74rem", color: "var(--gray)" }}>
            Distribution of <strong>{geneSymbol}</strong> transcript abundance across non-diseased human tissues
          </span>
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--teal)", background: "white", padding: "0.2rem 0.5rem", borderRadius: 4, border: "1px solid var(--border)" }}>
          Max: {maxVal} TPM
        </span>
      </div>

      {tissues.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.6rem" }}>
          {tissues.map(([tissue, val]) => {
            const pct = Math.round((val / maxVal) * 100);
            return (
              <div
                key={tissue}
                style={{
                  background: "white",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "0.65rem 0.75rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem" }}>
                  <span style={{ fontWeight: 500, color: "var(--navy)" }}>{tissue}</span>
                  <strong style={{ fontFamily: "var(--font-mono)", color: "var(--teal)", fontSize: "0.72rem" }}>
                    {val} TPM
                  </strong>
                </div>
                
                {/* Visual bar */}
                <div style={{ height: 6, background: "var(--surface)", borderRadius: 3, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: getHeatmapColor(val),
                      transition: "width 0.6s ease"
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ fontSize: "0.8rem", color: "var(--gray)", textAlign: "center", margin: 0 }}>
          Expression levels recorded across multiple tissue panels.
        </p>
      )}

      <div style={{ marginTop: "0.9rem", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--gray)" }}>
        <span>Data source: GTEx Consortium (Genotype-Tissue Expression Portal v8)</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span>Low</span>
          <div style={{ display: "flex", gap: 2 }}>
            {["#CCFBF1", "#5EEAD4", "#14B8A6", "#0D9488"].map((c, i) => (
              <span key={i} style={{ width: 10, height: 10, background: c, borderRadius: 2 }} />
            ))}
          </div>
          <span>High</span>
        </div>
      </div>
    </div>
  );
}
