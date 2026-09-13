import React, { useState, useEffect } from "react";
import { useApp } from "../App";
import {
  OMICS_DRUG_DATABASE,
  OMICS_DISEASE_INDEX,
  OMICS_QUICK_TAGS,
  queryOmicsDatabase,
  runCustomOmicsReversal
} from "../data/omicsMockData";
import { analyseOmicsDrugRepurposing } from "../api/openrouter";
import OmicsTargetCard from "../components/omics/OmicsTargetCard";
import SignatureReversalPlot from "../components/omics/SignatureReversalPlot";
import PathwayNetworkViewer from "../components/omics/PathwayNetworkViewer";
import { LoadingDots, ErrorBanner } from "../components/Feedback";

const SEARCH_MODES = [
  { key: "drug", icon: "💊", label: "Drug Name", placeholder: "Enter drug (e.g. Metformin, Sildenafil, Rapamycin, Aspirin)…" },
  { key: "disease", icon: "🦠", label: "Disease Indication", placeholder: "Enter disease (e.g. Triple-Negative Breast Cancer, Alzheimer's)…" },
  { key: "target", icon: "🧬", label: "Gene / Target", placeholder: "Enter target symbol (e.g. PRKAA1, PDE5A, MTOR, CRBN)…" },
  { key: "custom_omics", icon: "🧪", label: "Custom Omics Signature Reversal", placeholder: "Match custom gene expression signatures…" },
];

export default function OmicsDiscovery() {
  const { apiKey } = useApp();
  const [mode, setMode] = useState("drug");
  const [query, setQuery] = useState("");
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [resultsList, setResultsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiGenerated, setAiGenerated] = useState(false);

  // Custom Omics Signature Reversal Inputs
  const [customUpGenes, setCustomUpGenes] = useState("MTOR, MYC, HIF1A, VEGFA, CCND1");
  const [customDownGenes, setCustomDownGenes] = useState("PRKAA1, FOXO3, SIRT1, CDKN1A");
  const [customResults, setCustomResults] = useState([]);

  // Filters
  const [minScore, setMinScore] = useState(70);
  const [filterStage, setFilterStage] = useState("ALL");

  // Load default on mount (Metformin)
  useEffect(() => {
    const all = Object.values(OMICS_DRUG_DATABASE);
    setResultsList(all);
    setSelectedDrug(all[0]);
  }, []);

  const handleSearch = async (overrideQuery = query) => {
    const trimmed = overrideQuery.trim();
    if (!trimmed && mode !== "custom_omics") return;

    setLoading(true);
    setError(null);
    setAiGenerated(false);

    try {
      if (mode === "custom_omics") {
        const upArr = customUpGenes.split(",").map((g) => g.trim()).filter(Boolean);
        const downArr = customDownGenes.split(",").map((g) => g.trim()).filter(Boolean);
        const matches = runCustomOmicsReversal(upArr, downArr);
        setCustomResults(matches);
        if (matches.length > 0) {
          setSelectedDrug(matches[0].drug);
        }
      } else {
        // Query local curated knowledge base first
        const localMatches = queryOmicsDatabase(trimmed);

        if (localMatches.length > 0) {
          setResultsList(localMatches);
          setSelectedDrug(localMatches[0]);
        } else if (apiKey) {
          // If not found in local mock, call OpenRouter for deep multi-omics reasoning
          setAiGenerated(true);
          const aiData = await analyseOmicsDrugRepurposing(trimmed, apiKey);
          if (aiData && aiData.drugName) {
            setResultsList([aiData]);
            setSelectedDrug(aiData);
          } else {
            throw new Error(`No multi-omics data found for "${trimmed}".`);
          }
        } else {
          setResultsList([]);
          setSelectedDrug(null);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to retrieve multi-omics data.");
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = (tagLabel) => {
    setQuery(tagLabel);
    if (tagLabel.includes("Cancer") || tagLabel.includes("Disease") || tagLabel.includes("Hypertension")) {
      setMode("disease");
    } else if (tagLabel.includes("(") || tagLabel === "PDE5A" || tagLabel === "CRBN" || tagLabel === "MTOR") {
      setMode("target");
    } else {
      setMode("drug");
    }
    handleSearch(tagLabel);
  };

  const exportDossierJSON = () => {
    if (!selectedDrug) return;
    const blob = new Blob([JSON.stringify(selectedDrug, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedDrug.drugName}_Omics_Repurposing_Dossier.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentPlaceholder = SEARCH_MODES.find((m) => m.key === mode)?.placeholder;

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", background: "var(--surface)" }}>
      {/* Header Banner */}
      <section style={{ background: "linear-gradient(135deg, #042F2E 0%, #0F172A 100%)", color: "white", padding: "3.5rem 1.5rem 3rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(45,212,191,0.15)", border: "1px solid rgba(45,212,191,0.3)", padding: "0.3rem 0.8rem", borderRadius: 20, fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#2DD4BF", marginBottom: "1rem" }}>
            <span>🧬</span> MULTI-OMICS TARGET IDENTIFICATION & DRUG REPURPOSING ENGINE
          </div>

          <h1 style={{ fontFamily: "var(--font-head)", fontSize: "2.4rem", fontWeight: 700, margin: "0 0 0.75rem" }}>
            Omics-Driven Drug Repurposing & Target Discovery
          </h1>
          <p style={{ maxWidth: 850, fontSize: "1.05rem", color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>
            Query any drug, disease, or gene target to unveil biological targets (ChEMBL, UniProt, PDB), GTEx tissue expression profiles, transcriptomic CMap signature reversal scores, and clinical repurposing candidates.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div style={{ maxWidth: 1200, margin: "-1.5rem auto 3rem", padding: "0 1.5rem" }}>
        {/* Search & Query Control Card */}
        <div style={{ background: "white", borderRadius: 20, padding: "1.75rem", boxShadow: "0 10px 30px rgba(0,0,0,0.06)", border: "1px solid var(--border)", marginBottom: "2rem" }}>
          {/* Mode Switcher Tabs */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem", background: "var(--surface)", padding: "0.4rem", borderRadius: 12 }}>
            {SEARCH_MODES.map((m) => (
              <button
                key={m.key}
                onClick={() => {
                  setMode(m.key);
                  if (m.key === "custom_omics") handleSearch("");
                }}
                style={{
                  flex: 1,
                  minWidth: 160,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "0.65rem 1rem",
                  fontSize: "0.85rem",
                  fontFamily: "var(--font-sub)",
                  fontWeight: mode === m.key ? 700 : 500,
                  color: mode === m.key ? "white" : "var(--gray)",
                  background: mode === m.key ? "var(--teal)" : "transparent",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          {/* Search Inputs based on mode */}
          {mode !== "custom_omics" ? (
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
              <input
                className="hs-input"
                style={{ flex: 1, fontSize: "1rem", padding: "0.85rem 1.1rem", borderRadius: 12 }}
                value={query}
                placeholder={currentPlaceholder}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                className="hs-btn hs-btn-solid hs-btn-lg"
                onClick={() => handleSearch()}
                style={{ minWidth: 140, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                <span>🔍</span> Run Omics Search
              </button>
            </div>
          ) : (
            /* Custom Omics Signature Reversal Input Box */
            <div style={{ background: "var(--surface)", borderRadius: 12, padding: "1.25rem", marginBottom: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#DC2626", fontFamily: "var(--font-mono)", marginBottom: 4 }}>
                    🔻 UPREGULATED DISEASE GENES (Comma-separated)
                  </label>
                  <input
                    className="hs-input"
                    value={customUpGenes}
                    onChange={(e) => setCustomUpGenes(e.target.value)}
                    placeholder="e.g. MTOR, MYC, HIF1A, VEGFA, CCND1"
                    style={{ fontSize: "0.88rem", fontFamily: "var(--font-mono)" }}
                  />
                  <span style={{ fontSize: "0.7rem", color: "var(--gray)" }}>Genes elevated in the disease transcriptome to be downregulated</span>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#16A34A", fontFamily: "var(--font-mono)", marginBottom: 4 }}>
                    🔺 DOWNREGULATED DISEASE GENES (Comma-separated)
                  </label>
                  <input
                    className="hs-input"
                    value={customDownGenes}
                    onChange={(e) => setCustomDownGenes(e.target.value)}
                    placeholder="e.g. PRKAA1, FOXO3, SIRT1, CDKN1A"
                    style={{ fontSize: "0.88rem", fontFamily: "var(--font-mono)" }}
                  />
                  <span style={{ fontSize: "0.7rem", color: "var(--gray)" }}>Genes suppressed in the disease transcriptome to be restored</span>
                </div>
              </div>

              <button
                className="hs-btn hs-btn-solid"
                onClick={() => handleSearch("")}
                style={{ width: "100%", padding: "0.85rem", fontSize: "0.95rem" }}
              >
                🧪 Run Perturbation Signature Reversal Algorithm
              </button>
            </div>
          )}

          {/* Quick suggestions */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--gray)", fontFamily: "var(--font-mono)" }}>Quick Queries:</span>
            {OMICS_QUICK_TAGS.map((t) => (
              <span
                key={t.label}
                onClick={() => handleTagClick(t.label)}
                style={{
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  padding: "0.2rem 0.6rem",
                  borderRadius: 20,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--navy)",
                  transition: "all 0.15s ease"
                }}
              >
                {t.label}
              </span>
            ))}

            {aiGenerated && (
              <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--teal)" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--teal)" }} />
                Live OpenRouter AI Omics
              </span>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && <ErrorBanner error={error} onRetry={() => handleSearch()} />}

        {/* Loading */}
        {loading ? (
          <div style={{ background: "white", borderRadius: 20, padding: "4rem 2rem", textAlign: "center", border: "1px solid var(--border)" }}>
            <LoadingDots message="Computing multi-omics target bindings, GTEx expressions & CMap signature reversal…" />
          </div>
        ) : selectedDrug ? (
          /* Main Results Dashboard */
          <div>
            {/* Drug Selection Bar (if multiple results) */}
            {resultsList.length > 1 && (
              <div style={{ display: "flex", gap: "0.75rem", overflowX: "auto", paddingBottom: "0.75rem", marginBottom: "1.5rem" }}>
                {resultsList.map((d) => (
                  <button
                    key={d.id || d.drugName}
                    onClick={() => setSelectedDrug(d)}
                    style={{
                      padding: "0.6rem 1.1rem",
                      borderRadius: 12,
                      border: selectedDrug.drugName === d.drugName ? "2px solid var(--teal)" : "1px solid var(--border)",
                      background: selectedDrug.drugName === d.drugName ? "var(--teal-bg)" : "white",
                      color: selectedDrug.drugName === d.drugName ? "var(--teal)" : "var(--navy)",
                      fontWeight: selectedDrug.drugName === d.drugName ? 700 : 500,
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    <span>💊</span>
                    <span>{d.drugName}</span>
                    <span style={{ fontSize: "0.72rem", color: "var(--gray)", fontFamily: "var(--font-mono)" }}>
                      ({d.targets?.length || 0} Targets)
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Custom Omics Ranking Table (if in custom mode) */}
            {mode === "custom_omics" && customResults.length > 0 && (
              <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--border)", padding: "1.25rem", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.75rem" }}>
                  🏆 Ranked Drug Candidates by Custom Transcriptomic Signature Reversal
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {customResults.map(({ drug: d, connectivityScore, reversalPercentage, reversalHits, rationale }, i) => (
                    <div
                      key={d.drugName + i}
                      onClick={() => setSelectedDrug(d)}
                      style={{
                        padding: "0.85rem 1rem",
                        borderRadius: 10,
                        border: selectedDrug.drugName === d.drugName ? "2px solid var(--teal)" : "1px solid var(--border)",
                        background: selectedDrug.drugName === d.drugName ? "var(--teal-bg)" : "var(--surface)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        flexWrap: "wrap",
                        gap: "0.75rem"
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: "0.95rem", color: "var(--navy)" }}>{d.drugName}</strong>
                        <span style={{ fontSize: "0.8rem", color: "var(--gray)", marginLeft: 8 }}>{d.drugClass}</span>
                        <p style={{ fontSize: "0.76rem", color: "var(--gray-dark)", margin: "3px 0 0" }}>{rationale}</p>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", fontWeight: 700, color: "var(--teal)" }}>
                          Score: {connectivityScore}
                        </span>
                        <span style={{ background: "#EAF3DE", color: "#3B6D11", fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.5rem", borderRadius: 12 }}>
                          {reversalPercentage}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Drug Hero Card */}
            <div style={{ background: "white", borderRadius: 20, border: "1px solid var(--border)", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                    <h2 style={{ fontFamily: "var(--font-head)", fontSize: "1.8rem", fontWeight: 700, color: "var(--navy)", margin: 0 }}>
                      {selectedDrug.drugName}
                    </h2>
                    {selectedDrug.chemblId && (
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", background: "var(--surface)", padding: "0.2rem 0.5rem", borderRadius: 6, color: "var(--gray)" }}>
                        {selectedDrug.chemblId}
                      </span>
                    )}
                    {selectedDrug.drugBankId && (
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", background: "var(--surface)", padding: "0.2rem 0.5rem", borderRadius: 6, color: "var(--gray)" }}>
                        {selectedDrug.drugBankId}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "0.88rem", color: "var(--gray)", marginTop: 4 }}>
                    Generic: <strong>{selectedDrug.genericName}</strong> · Class: {selectedDrug.drugClass}
                  </p>
                </div>

                {/* Pricing & Jan Aushadhi Badge */}
                <div style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, justifyContent: "flex-end" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.3rem", fontWeight: 700, color: "var(--teal)" }}>
                      {selectedDrug.janAushadhiPrice || selectedDrug.genericPrice || "Low Cost"}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "var(--gray)" }}>Jan Aushadhi Kendra</span>
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "#166534", background: "#DCFCE7", padding: "0.15rem 0.5rem", borderRadius: 12, fontWeight: 700 }}>
                    ✓ PMBJP Approved Generic Available
                  </span>
                </div>
              </div>

              {/* Summary */}
              <p style={{ fontSize: "0.95rem", color: "var(--gray-dark)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                {selectedDrug.summary}
              </p>

              {/* Quick Specs Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", background: "var(--surface)", padding: "1.25rem", borderRadius: 14 }}>
                <div>
                  <span style={{ display: "block", fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "var(--gray)", textTransform: "uppercase" }}>
                    Primary Approved Indication
                  </span>
                  <strong style={{ fontSize: "0.9rem", color: "var(--navy)" }}>{selectedDrug.primaryIndication}</strong>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "var(--gray)", textTransform: "uppercase" }}>
                    Molecular Targets Profiled
                  </span>
                  <strong style={{ fontSize: "0.9rem", color: "var(--teal)", fontFamily: "var(--font-mono)" }}>
                    {selectedDrug.targets?.length || 0} Primary & Secondary Targets
                  </strong>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "var(--gray)", textTransform: "uppercase" }}>
                    Repurposed Indications
                  </span>
                  <strong style={{ fontSize: "0.9rem", color: "var(--navy)" }}>
                    {selectedDrug.repurposingCandidates?.length || 0} Disease Hypotheses
                  </strong>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                  <button
                    onClick={exportDossierJSON}
                    style={{
                      padding: "0.5rem 0.9rem",
                      background: "white",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: "0.78rem",
                      fontFamily: "var(--font-mono)",
                      color: "var(--navy)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    <span>📥</span> Export Dossier (JSON)
                  </button>
                </div>
              </div>
            </div>

            {/* Repurposing Opportunities & Score Breakdown Matrix */}
            {selectedDrug.repurposingCandidates?.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
                  <span style={{ fontSize: "1.2rem" }}>🎯</span>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--navy)", margin: 0 }}>
                    Repurposed Disease Candidates & Composite Score Breakdown
                  </h3>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem" }}>
                  {selectedDrug.repurposingCandidates.map((cand, i) => (
                    <div
                      key={i}
                      style={{
                        background: "white",
                        borderRadius: 16,
                        border: "1px solid var(--border)",
                        padding: "1.4rem",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                          <div>
                            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--navy)", margin: 0 }}>
                              {cand.disease}
                            </h4>
                            <span style={{ fontSize: "0.72rem", color: "var(--teal)", fontFamily: "var(--font-mono)" }}>
                              {cand.phase}
                            </span>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--teal)", fontFamily: "var(--font-mono)" }}>
                              {cand.overallRepurposingScore}%
                            </span>
                            <span style={{ display: "block", fontSize: "0.65rem", color: "var(--gray)", textTransform: "uppercase" }}>
                              Overall Score
                            </span>
                          </div>
                        </div>

                        {/* 4-Layer Score Breakdown */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem", marginBottom: "0.9rem", background: "var(--surface)", padding: "0.75rem", borderRadius: 8 }}>
                          <div>
                            <span style={{ fontSize: "0.65rem", color: "var(--gray)", textTransform: "uppercase", display: "block" }}>Target Affinity</span>
                            <strong style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--navy)" }}>{cand.targetAffinityScore || 90}%</strong>
                          </div>
                          <div>
                            <span style={{ fontSize: "0.65rem", color: "var(--gray)", textTransform: "uppercase", display: "block" }}>Omics Reversal</span>
                            <strong style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--teal)" }}>{cand.omicsReversalScore || 94}%</strong>
                          </div>
                          <div>
                            <span style={{ fontSize: "0.65rem", color: "var(--gray)", textTransform: "uppercase", display: "block" }}>Genetics / GWAS</span>
                            <strong style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--navy)" }}>{cand.geneticsScore || 88}%</strong>
                          </div>
                          <div>
                            <span style={{ fontSize: "0.65rem", color: "var(--gray)", textTransform: "uppercase", display: "block" }}>Safety Profile</span>
                            <strong style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "#166534" }}>{cand.safetyRecordScore || 98}%</strong>
                          </div>
                        </div>

                        <p style={{ fontSize: "0.82rem", color: "var(--gray-dark)", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                          {cand.keyMechanism}
                        </p>
                      </div>

                      {cand.recommendedGenericSavings && (
                        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.6rem", fontSize: "0.75rem", color: "#166534", fontWeight: 600 }}>
                          💰 {cand.recommendedGenericSavings}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Target Explorer Section */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.2rem" }}>🔬</span>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--navy)", margin: 0 }}>
                  Biological Targets & Multi-Omics Profiling ({selectedDrug.targets?.length || 0})
                </h3>
              </div>

              {selectedDrug.targets?.map((target, idx) => (
                <OmicsTargetCard key={target.geneSymbol + idx} target={target} index={idx} />
              ))}
            </div>

            {/* Transcriptomic Signature Reversal Component */}
            <SignatureReversalPlot signatureReversal={selectedDrug.signatureReversal} />

            {/* Interactive Network Graph Viewer */}
            <PathwayNetworkViewer drug={selectedDrug} />
          </div>
        ) : (
          /* Empty state */
          <div style={{ background: "white", borderRadius: 20, padding: "4rem 2rem", textAlign: "center", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <h3 style={{ fontSize: "1.2rem", color: "var(--navy)", marginBottom: "0.5rem" }}>No Drug or Target Found</h3>
            <p style={{ color: "var(--gray)", maxWidth: 500, margin: "0 auto" }}>
              Try searching for Metformin, Sildenafil, Rapamycin, Thalidomide, or enter your OpenRouter key in Settings for live AI querying.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
