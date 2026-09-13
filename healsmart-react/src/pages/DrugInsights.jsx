import React, { useState, useEffect } from "react";
import { searchDrugInsight } from "../api/openrouter";
import { findMockDrug, QUICK_TAGS } from "../data/mockData";
import { useApp } from "../App";
import DrugResultCard from "../components/DrugResultCard";
import { LoadingDots, ErrorBanner } from "../components/Feedback";

const TABS = [
  { key: "medicine",   icon: "💊", label: "Medicine"   },
  { key: "disease",    icon: "🦠", label: "Disease"    },
  { key: "symptoms",   icon: "🩺", label: "Symptoms"   },
  { key: "repurpose",  icon: "🔬", label: "Repurposing" },
];

export default function DrugInsights() {
  const { apiKey } = useApp();
  const [tab,      setTab]      = useState("medicine");
  const [query,    setQuery]    = useState("");
  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [searched, setSearched] = useState(false);
  const [aiUsed,   setAiUsed]   = useState(false);

  /* Show all mock data on mount */
  useEffect(() => {
    setResults(Object.values(require("../data/mockData").MOCK_DRUGS));
  }, []);

  const runSearch = async (q = query) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    setSearched(true);
    setLoading(true);
    setError(null);
    setAiUsed(false);

    try {
      let data = null;
      if (apiKey) {
        setAiUsed(true);
        data = await searchDrugInsight(trimmed, apiKey);
      }
      if (data?.length) {
        setResults(data);
      } else {
        setAiUsed(false);
        setResults(findMockDrug(trimmed));
      }
    } catch (e) {
      setAiUsed(false);
      setError(e.message);
      setResults(findMockDrug(trimmed));
    } finally {
      setLoading(false);
    }
  };

  const setSearch = (val) => {
    setQuery(val);
    runSearch(val);
  };

  const placeholder = {
    medicine:  "Type a medicine name (e.g. Metformin, Sildenafil)…",
    disease:   "Type a disease (e.g. Breast Cancer, Alzheimer's)…",
    symptoms:  "Describe symptoms (e.g. joint pain + morning stiffness)…",
    repurpose: "Enter drug or target for repurposing analysis…",
  }[tab];

  return (
    <div style={{ paddingTop: 64 }}>
      <section className="hs-section">
        <div className="hs-container">

          {/* Header */}
          <div className="hs-section-head">
            <div className="hs-eyebrow">Live AI Search</div>
            <h1 className="hs-h2">Drug & Disease Insights</h1>
            <p className="hs-lead">
              Search any medicine, disease, or symptom cluster. Get comprehensive profiles,
              repurposing opportunities, and nearby Jan Aushadhi store availability.
              {!apiKey && (
                <span style={{ display: "block", color: "var(--amber)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  Showing curated mock data — add your OpenRouter key in Settings for live AI results.
                </span>
              )}
            </p>
          </div>

          {/* Search app card */}
          <div style={{ background: "white", borderRadius: 24, padding: "2.5rem", border: "1px solid var(--border)", maxWidth: 1100, margin: "0 auto" }}>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", background: "var(--surface)", borderRadius: 12, padding: "0.4rem" }}>
              {TABS.map((t) => (
                <button
                  key={t.key}
                  className={`app-tab ${tab === t.key ? "active" : ""}`}
                  onClick={() => setTab(t.key)}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* Search bar */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <input
                className="hs-input"
                style={{ flex: 1, fontSize: "1rem", padding: "0.85rem 1rem", borderRadius: 12 }}
                value={query}
                placeholder={placeholder}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runSearch()}
              />
              <button className="hs-btn hs-btn-solid hs-btn-lg" onClick={() => runSearch()}>
                Search
              </button>
            </div>

            {/* Quick tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--gray)" }}>Try:</span>
              {QUICK_TAGS.map(({ label, type }) => (
                <span
                  key={label}
                  className={`tag tag-${type}`}
                  onClick={() => setSearch(label)}
                >
                  {label}
                </span>
              ))}
              {aiUsed && !loading && (
                <span style={{
                  marginLeft: "auto",
                  display: "flex", alignItems: "center", gap: 5,
                  fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--teal)",
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--teal)", display: "inline-block" }} />
                  OpenRouter AI
                </span>
              )}
            </div>

            {/* Error */}
            {error && <ErrorBanner error={error} onRetry={() => runSearch()} />}

            {/* Results area */}
            <div style={{ minHeight: 200 }}>
              {loading ? (
                <LoadingDots message="Searching HealSmart database with AI…" />
              ) : results.length > 0 ? (
                <>
                  <div style={{ fontSize: "0.75rem", color: "var(--gray)", marginBottom: "1rem", textAlign: "right", fontFamily: "var(--font-mono)" }}>
                    {results.length} result{results.length !== 1 ? "s" : ""} found
                    {searched && query && ` for "${query}"`}
                  </div>
                  {results.map((drug, i) => (
                    <DrugResultCard key={drug.drugName + i} drug={drug} index={i} />
                  ))}
                </>
              ) : searched ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "var(--gray)" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
                  <p style={{ fontWeight: 300 }}>No results found for "{query}". Try Metformin or Alzheimer's.</p>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "3rem", color: "var(--gray)" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
                  <p style={{ fontWeight: 300 }}>Search for any medicine, disease, or symptom above to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
