import React, { useState } from "react";

export default function PathwayNetworkViewer({ drug }) {
  const [selectedNode, setSelectedNode] = useState(null);

  if (!drug || !drug.targets) return null;

  const targets = drug.targets || [];
  const repurposing = drug.repurposingCandidates || [];

  // Extract unique top pathways
  const allPathways = [];
  targets.forEach((t) => {
    t.pathways?.slice(0, 2).forEach((p) => {
      if (!allPathways.includes(p)) allPathways.push(p);
    });
  });

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #0F172A 0%, #090D16 100%)",
        borderRadius: 16,
        padding: "1.5rem",
        color: "white",
        marginTop: "1.5rem",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "1.2rem" }}>🕸️</span>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "white", margin: 0 }}>
              Multi-Omics Network Architecture: Drug ➔ Target ➔ Pathway ➔ Disease
            </h3>
          </div>
          <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: "2px 0 0" }}>
            Interactive bipartite topology connecting molecular pharmacology with clinical phenotypic responses
          </p>
        </div>

        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#2DD4BF", background: "rgba(45,212,191,0.1)", padding: "0.25rem 0.6rem", borderRadius: 20, border: "1px solid rgba(45,212,191,0.3)" }}>
          {targets.length} Targets · {allPathways.length} Pathways · {repurposing.length} Indications
        </span>
      </div>

      {/* Network Columns Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", position: "relative", minHeight: 280 }}>
        {/* Column 1: Drug Node */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "#64748B", textTransform: "uppercase", marginBottom: 8 }}>
            1. Drug Molecule
          </div>
          <div
            onClick={() => setSelectedNode({ type: "drug", data: drug })}
            style={{
              padding: "1.1rem 1rem",
              background: "linear-gradient(135deg, #0D9488 0%, #115E59 100%)",
              border: "2px solid #2DD4BF",
              borderRadius: 14,
              textAlign: "center",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(45,212,191,0.35)",
              width: "100%",
              maxWidth: 190,
              transition: "transform 0.2s ease"
            }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>💊</div>
            <strong style={{ display: "block", fontSize: "1.05rem", color: "white" }}>{drug.drugName}</strong>
            <span style={{ fontSize: "0.72rem", color: "#99F6E4", fontFamily: "var(--font-mono)" }}>
              {drug.chemblId}
            </span>
          </div>
        </div>

        {/* Column 2: Molecular Targets */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", justifyContent: "center" }}>
          <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "#64748B", textTransform: "uppercase", textAlign: "center", marginBottom: 2 }}>
            2. Biological Targets
          </div>
          {targets.map((t) => (
            <div
              key={t.geneSymbol}
              onClick={() => setSelectedNode({ type: "target", data: t })}
              style={{
                padding: "0.75rem 0.9rem",
                background: "rgba(30, 41, 59, 0.8)",
                border: selectedNode?.data?.geneSymbol === t.geneSymbol ? "1.5px solid #2DD4BF" : "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ color: "#2DD4BF", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                  {t.geneSymbol}
                </strong>
                <span style={{ fontSize: "0.68rem", color: "#94A3B8" }}>{t.uniprotId}</span>
              </div>
              <div style={{ fontSize: "0.72rem", color: "#CBD5E1", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {t.mechanismOfAction?.split(" ")[0]} ({t.targetClass?.split(" ")[0]})
              </div>
            </div>
          ))}
        </div>

        {/* Column 3: Pathways Affected */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", justifyContent: "center" }}>
          <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "#64748B", textTransform: "uppercase", textAlign: "center", marginBottom: 2 }}>
            3. Reactome Pathways
          </div>
          {allPathways.slice(0, 4).map((p, i) => (
            <div
              key={i}
              onClick={() => setSelectedNode({ type: "pathway", data: { name: p } })}
              style={{
                padding: "0.75rem 0.9rem",
                background: "rgba(30, 41, 59, 0.6)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
                cursor: "pointer",
                fontSize: "0.75rem",
                color: "#E2E8F0",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <span style={{ color: "#F59E0B" }}>⚡</span>
              <span style={{ lineHeight: 1.3 }}>{p}</span>
            </div>
          ))}
        </div>

        {/* Column 4: Repurposed Diseases */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", justifyContent: "center" }}>
          <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "#64748B", textTransform: "uppercase", textAlign: "center", marginBottom: 2 }}>
            4. Repurposed Diseases
          </div>
          {repurposing.slice(0, 3).map((r) => (
            <div
              key={r.disease}
              onClick={() => setSelectedNode({ type: "disease", data: r })}
              style={{
                padding: "0.75rem 0.9rem",
                background: "linear-gradient(135deg, rgba(30,58,138,0.4) 0%, rgba(15,23,42,0.8) 100%)",
                border: "1px solid rgba(96,165,250,0.3)",
                borderRadius: 10,
                cursor: "pointer"
              }}
            >
              <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "#93C5FD", marginBottom: 2 }}>
                {r.disease}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.68rem", color: "#38BDF8", fontFamily: "var(--font-mono)" }}>
                  {r.phase?.split(" ")[0]} {r.phase?.split(" ")[1]}
                </span>
                <span style={{ fontSize: "0.72rem", color: "#34D399", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                  {r.overallRepurposingScore}% Score
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Node Details Bar */}
      {selectedNode && (
        <div
          style={{
            marginTop: "1.25rem",
            padding: "0.9rem 1.25rem",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem"
          }}
        >
          <div>
            <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "#2DD4BF", textTransform: "uppercase" }}>
              Selected Node Details ({selectedNode.type})
            </span>
            <div style={{ fontSize: "0.88rem", color: "white", marginTop: 2 }}>
              {selectedNode.type === "drug" && `${selectedNode.data.drugName} — ${selectedNode.data.primaryIndication}`}
              {selectedNode.type === "target" && `${selectedNode.data.geneSymbol}: ${selectedNode.data.geneName} | Affinity: ${selectedNode.data.bindingAffinity}`}
              {selectedNode.type === "pathway" && `Pathway: ${selectedNode.data.name}`}
              {selectedNode.type === "disease" && `${selectedNode.data.disease} | Mechanism: ${selectedNode.data.keyMechanism}`}
            </div>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#94A3B8",
              padding: "0.25rem 0.6rem",
              borderRadius: 4,
              fontSize: "0.75rem",
              cursor: "pointer"
            }}
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
}
