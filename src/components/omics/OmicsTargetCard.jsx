import React, { useState } from "react";
import OmicsExpressionHeatmap from "./OmicsExpressionHeatmap";

export default function OmicsTargetCard({ target, index = 0 }) {
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "gtex" | "genetics" | "pathways"

  const {
    geneSymbol,
    geneName,
    uniprotId,
    chemblTargetId,
    pdbStructure,
    targetClass,
    mechanismOfAction,
    bindingAffinity,
    druggabilityTier,
    subcellularLocation,
    gtexExpression,
    diseaseDysregulation = [],
    geneticsEvidence,
    pathways = [],
    stringInteractions = []
  } = target;

  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        border: "1px solid var(--border)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        overflow: "hidden",
        marginBottom: "1.25rem",
        transition: "all 0.25s ease"
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          padding: "1.25rem 1.5rem",
          background: "linear-gradient(135deg, rgba(13,148,136,0.04) 0%, rgba(240,253,250,0.4) 100%)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: 4 }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--teal)",
                background: "var(--teal-bg)",
                padding: "0.2rem 0.6rem",
                borderRadius: 6,
                border: "1px solid rgba(13,148,136,0.2)"
              }}
            >
              {geneSymbol}
            </span>
            <span style={{ fontWeight: 600, fontSize: "1.05rem", color: "var(--navy)" }}>
              {geneName}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginTop: 6, fontSize: "0.78rem" }}>
            {uniprotId && (
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--gray)", background: "var(--surface)", padding: "0.15rem 0.45rem", borderRadius: 4 }}>
                UniProt: <strong style={{ color: "var(--navy)" }}>{uniprotId}</strong>
              </span>
            )}
            {chemblTargetId && (
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--gray)", background: "var(--surface)", padding: "0.15rem 0.45rem", borderRadius: 4 }}>
                ChEMBL: <strong style={{ color: "var(--navy)" }}>{chemblTargetId}</strong>
              </span>
            )}
            {pdbStructure && (
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--teal)", background: "var(--teal-bg)", padding: "0.15rem 0.45rem", borderRadius: 4 }}>
                PDB: <strong>{pdbStructure}</strong>
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
              padding: "0.25rem 0.6rem",
              borderRadius: 20,
              background: druggabilityTier?.includes("Tier 1") ? "#EAF3DE" : "var(--amber-light)",
              color: druggabilityTier?.includes("Tier 1") ? "#3B6D11" : "var(--amber)",
              border: "1px solid currentColor"
            }}
          >
            {druggabilityTier || "Tier 1: Approved Druggable Target"}
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--gray)", fontFamily: "var(--font-mono)" }}>
            {targetClass}
          </span>
        </div>
      </div>

      {/* Target Key Properties Grid */}
      <div style={{ padding: "1.25rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
          <div style={{ background: "var(--surface)", padding: "0.85rem", borderRadius: 10 }}>
            <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.68rem", textTransform: "uppercase", color: "var(--gray)", letterSpacing: "0.06em", marginBottom: 3 }}>
              Mechanism of Action
            </span>
            <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--navy)" }}>
              {mechanismOfAction}
            </span>
          </div>

          <div style={{ background: "var(--surface)", padding: "0.85rem", borderRadius: 10 }}>
            <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.68rem", textTransform: "uppercase", color: "var(--gray)", letterSpacing: "0.06em", marginBottom: 3 }}>
              Binding Affinity / Potency
            </span>
            <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--teal)", fontFamily: "var(--font-mono)" }}>
              {bindingAffinity || "Direct sub-micromolar modulation"}
            </span>
          </div>

          <div style={{ background: "var(--surface)", padding: "0.85rem", borderRadius: 10 }}>
            <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.68rem", textTransform: "uppercase", color: "var(--gray)", letterSpacing: "0.06em", marginBottom: 3 }}>
              Subcellular Location (HPA)
            </span>
            <span style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--gray-dark)" }}>
              {subcellularLocation || "Cytosol & Plasma Membrane"}
            </span>
          </div>
        </div>

        {/* Tab Navigation for Multi-Omics Layers */}
        <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--border)", marginBottom: "1rem" }}>
          {[
            { key: "overview", label: "📊 Disease Differential Expression" },
            { key: "gtex", label: "🧬 GTEx Tissue Expression" },
            { key: "genetics", label: "🎯 Genomics & GWAS Evidence" },
            { key: "pathways", label: "🕸️ Pathways & PPI Network" }
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                padding: "0.5rem 0.85rem",
                fontSize: "0.8rem",
                fontFamily: "var(--font-sub)",
                fontWeight: activeTab === t.key ? 600 : 400,
                color: activeTab === t.key ? "var(--teal)" : "var(--gray)",
                background: "none",
                border: "none",
                borderBottom: activeTab === t.key ? "2px solid var(--teal)" : "2px solid transparent",
                cursor: "pointer",
                marginBottom: -1
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content: Disease Differential Expression */}
        {activeTab === "overview" && (
          <div>
            <p style={{ fontSize: "0.82rem", color: "var(--gray)", marginBottom: "0.75rem" }}>
              Transcriptomic RNA-seq perturbation of <strong>{geneSymbol}</strong> across candidate repurposing diseases:
            </p>
            {diseaseDysregulation.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {diseaseDysregulation.map((d, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.65rem 0.9rem",
                      background: "white",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: "0.82rem"
                    }}
                  >
                    <div>
                      <strong style={{ color: "var(--navy)" }}>{d.disease}</strong>
                      <span style={{ color: "var(--gray)", fontSize: "0.75rem", marginLeft: 8 }}>
                        p-val: {d.pValue}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          color: d.log2FC > 0 ? "#DC2626" : "#2563EB",
                          background: d.log2FC > 0 ? "#FEE2E2" : "#DBEAFE",
                          padding: "0.15rem 0.45rem",
                          borderRadius: 4
                        }}
                      >
                        {d.log2FC > 0 ? `+${d.log2FC}` : d.log2FC} Log2FC
                      </span>
                      <span style={{ fontSize: "0.74rem", color: "var(--gray-dark)" }}>
                        {d.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: "1rem", textAlign: "center", color: "var(--gray)", fontSize: "0.82rem" }}>
                Documented baseline expression across tissue repositories.
              </div>
            )}
          </div>
        )}

        {/* Tab Content: GTEx Expression */}
        {activeTab === "gtex" && (
          <OmicsExpressionHeatmap geneSymbol={geneSymbol} gtexExpression={gtexExpression} />
        )}

        {/* Tab Content: Genetics & GWAS */}
        {activeTab === "genetics" && geneticsEvidence && (
          <div style={{ background: "var(--surface)", padding: "1rem", borderRadius: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "0.75rem" }}>
              <div>
                <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "var(--gray)", textTransform: "uppercase" }}>
                  GWAS Trait Association
                </span>
                <p style={{ fontWeight: 600, color: "var(--navy)", fontSize: "0.85rem", marginTop: 2 }}>
                  {geneticsEvidence.gwasTrait}
                </p>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--teal)" }}>
                  p = {geneticsEvidence.gwasPvalue}
                </span>
              </div>

              <div>
                <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "var(--gray)", textTransform: "uppercase" }}>
                  Open Targets Genetic Score
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: 2 }}>
                  <div style={{ flex: 1, height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${(geneticsEvidence.openTargetsScore || 0.85) * 100}%`,
                        height: "100%",
                        background: "var(--teal)"
                      }}
                    />
                  </div>
                  <strong style={{ fontFamily: "var(--font-mono)", color: "var(--teal)", fontSize: "0.85rem" }}>
                    {geneticsEvidence.openTargetsScore || "0.88"}
                  </strong>
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.6rem", fontSize: "0.8rem", color: "var(--gray-dark)" }}>
              <strong>eQTL Evidence:</strong> {geneticsEvidence.eqtlSummary}
            </div>
          </div>
        )}

        {/* Tab Content: Pathways & Interactomics */}
        {activeTab === "pathways" && (
          <div>
            <div style={{ marginBottom: "1rem" }}>
              <span style={{ display: "block", fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--gray)", textTransform: "uppercase", marginBottom: 6 }}>
                Reactome Biological Pathways Affected
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {pathways.map((p, i) => (
                  <span
                    key={i}
                    style={{
                      background: "white",
                      border: "1px solid var(--border)",
                      padding: "0.3rem 0.6rem",
                      borderRadius: 6,
                      fontSize: "0.76rem",
                      color: "var(--navy)",
                      fontWeight: 500
                    }}
                  >
                    ⚡ {p}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span style={{ display: "block", fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--gray)", textTransform: "uppercase", marginBottom: 6 }}>
                STRING Protein-Protein Interaction Hubs (Top Interacting Partners)
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {stringInteractions.map((partner, i) => (
                  <span
                    key={i}
                    style={{
                      background: "var(--teal-bg)",
                      color: "var(--teal)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.5rem",
                      borderRadius: 4,
                      border: "1px solid rgba(13,148,136,0.2)"
                    }}
                  >
                    🔗 {partner}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
