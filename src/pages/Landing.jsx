import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../App";
import { PHARMA_DATA } from "../data/mockData";

/* ────────────────────────────────────────────────────── */
/* Feature cards                                         */
const FEATURES = [
  {
    color: "teal",
    icon: "💊",
    title: "Medicine Search & Generic Alternatives",
    desc: "Search any medicine name or disease. Get comprehensive drug profiles, generic equivalents, and Jan Aushadhi store availability with real pricing.",
  },
  {
    color: "navy",
    icon: "🎯",
    title: "Gene & Disease Target Mapping",
    desc: "Map drug mechanisms to gene targets. Access OpenTargets, DisGeNET, and ChEMBL data to identify novel repurposing opportunities for pharma R&D teams.",
  },
  {
    color: "amber",
    icon: "📊",
    title: "Pharma Intelligence Dashboard",
    desc: "Competitive landscape analysis, pipeline benchmarking, repurposing opportunity scoring, and regulatory pathway optimisation for drug companies.",
  },
  {
    color: "teal",
    icon: "🏪",
    title: "Jan Aushadhi Store Locator",
    desc: "Real-time map of 8,800+ Pradhan Mantri Jan Aushadhi Kendras with live stock status and route navigation — saving patients up to 90% on medicines.",
  },
  {
    color: "navy",
    icon: "🔬",
    title: "AI Drug Repurposing",
    desc: "OpenRouter-powered AI analyses thousands of clinical trials and biomedical papers to surface high-confidence repurposing candidates with evidence scores.",
  },
  {
    color: "amber",
    icon: "📋",
    title: "Health Report Analysis",
    desc: "Upload your lab report or enter biomarkers. Get a risk assessment, educational medication awareness, and affordable generic options — instantly.",
  },
];

const HOW_STEPS = [
  { n: "1", title: "Enter your query", desc: "Type a medicine name (Metformin), disease (Type 2 Diabetes), or symptom cluster. Our NLP understands all formats." },
  { n: "2", title: "AI processes real data", desc: "We query OpenFDA, DrugBank, ChEMBL, PMJAY drug list, and Jan Aushadhi portal to compile verified, current information." },
  { n: "3", title: "Get medicine + cost + stores", desc: "Receive full medicine profiles, generic pricing, and a map of nearby Jan Aushadhi Kendras with live stock status." },
  { n: "4", title: "Explore repurposing opportunities", desc: "For pharma teams: AI-ranked repurposing candidates with gene target mappings, clinical evidence, and confidence scores." },
];
/* ────────────────────────────────────────────────────── */

export default function Landing() {
  const navigate     = useNavigate();
  const { openAuth } = useApp();

  return (
    <div style={{ paddingTop: 64 }}>

      {/* ══════════ HERO ══════════ */}
      <section style={{ padding: 0 }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "4rem", alignItems: "center",
          padding: "120px 2rem 80px",
        }}
          className="hero-grid"
        >
          {/* Left */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "var(--teal-bg)", color: "var(--teal)",
              padding: "0.35rem 0.85rem", borderRadius: 20,
              fontSize: "0.75rem", fontWeight: 400,
              marginBottom: "1.25rem",
              fontFamily: "var(--font-mono)", letterSpacing: "0.06em",
            }}>
              <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="var(--teal)" /></svg>
              AI-Powered Drug Repurposing Platform
            </div>

            <h1 style={{
              fontFamily: "var(--font-head)", fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
              fontWeight: 600, lineHeight: 1.08, color: "var(--navy)",
              marginBottom: "1.25rem", letterSpacing: "-0.01em", fontStyle: "italic",
            }}>
              Smarter Drugs.<br />
              Better <span style={{ color: "var(--teal)", fontStyle: "normal", fontWeight: 300 }}>Outcomes.</span><br />
              Lower Costs.
            </h1>

            <p style={{ fontSize: "1rem", color: "var(--gray)", lineHeight: 1.8, marginBottom: "2rem", fontWeight: 300 }}>
              HealSmart connects patients, doctors, and pharmaceutical companies with real-time medicine data,
              generic cost optimisation, nearby Jan Aushadhi stores, and AI-powered drug repurposing intelligence.
            </p>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                className="hs-btn hs-btn-solid hs-btn-lg"
                onClick={() => navigate("/omics-discovery")}
                style={{ background: "linear-gradient(135deg, #0D9488 0%, #115E59 100%)", boxShadow: "0 4px 14px rgba(13,148,136,0.3)" }}
              >
                🧬 Omics Target Engine
              </button>
              <button
                className="hs-btn hs-btn-outline hs-btn-lg"
                onClick={() => navigate("/drug-insights")}
              >
                Search Medicine / Disease
              </button>
              <button
                className="hs-btn hs-btn-navy hs-btn-lg"
                onClick={() => openAuth("pharma")}
              >
                Pharma R&D
              </button>
            </div>

            {/* Hero stats */}
            <div style={{ display: "flex", gap: "2rem", marginTop: "2.5rem", paddingTop: "2rem", borderTop: "1px solid var(--border)", flexWrap: "wrap" }}>
              {[
                { num: "12,000+", lbl: "Medicines indexed" },
                { num: "8,800+",  lbl: "Jan Aushadhi stores" },
                { num: "3,200+",  lbl: "Repurposing candidates" },
              ].map((s) => (
                <div key={s.lbl}>
                  <div style={{ fontFamily: "var(--font-head)", fontSize: "1.8rem", fontWeight: 600, color: "var(--teal)", fontStyle: "italic" }}>
                    {s.num}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--gray)", marginTop: 2, fontFamily: "var(--font-body)", letterSpacing: "0.03em" }}>
                    {s.lbl}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — interactive search preview */}
          <HeroVisual navigate={navigate} />
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section className="hs-section" style={{ background: "white" }}>
        <div className="hs-container">
          <div className="hs-section-head">
            <div className="hs-eyebrow">What we offer</div>
            <h2 className="hs-h2">Everything healthcare needs, in one platform</h2>
            <p className="hs-lead">
              From individual patients searching for affordable generics to pharma R&D teams hunting for repurposing leads —
              HealSmart serves the entire healthcare ecosystem.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="hs-section" id="how">
        <div className="hs-container">
          <div className="hs-section-head">
            <div className="hs-eyebrow">How It Works</div>
            <h2 className="hs-h2">From query to insight in seconds</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {HOW_STEPS.map((s) => (
                <div key={s.n} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "var(--teal)", color: "white",
                    fontFamily: "var(--font-head)", fontWeight: 600, fontSize: "1.1rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, fontStyle: "italic",
                  }}>
                    {s.n}
                  </div>
                  <div>
                    <h4 style={{ fontFamily: "var(--font-sub)", fontWeight: 700, color: "var(--navy)", marginBottom: "0.25rem", fontSize: "0.95rem" }}>
                      {s.title}
                    </h4>
                    <p style={{ fontSize: "0.875rem", color: "var(--gray)", lineHeight: 1.7, fontWeight: 300 }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Demo panel */}
            <DemoPanel />
          </div>
        </div>
      </section>

      {/* ══════════ PHARMA DASHBOARD PREVIEW ══════════ */}
      <PharmaDashboardSection navigate={navigate} openAuth={openAuth} />

      {/* ══════════ AUDIENCE ══════════ */}
      <AudienceSection navigate={navigate} openAuth={openAuth} />

      {/* ══════════ CTA STRIP ══════════ */}
      <section className="hs-section" style={{ background: "var(--navy)", textAlign: "center" }}>
        <div className="hs-container">
          <h2 style={{ fontFamily: "var(--font-head)", fontSize: "2.5rem", fontWeight: 600, color: "white", fontStyle: "italic", marginBottom: "1rem" }}>
            Ready to transform drug discovery?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "2rem", fontWeight: 300 }}>
            Join patients, doctors, and pharma companies already using HealSmart.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              className="hs-btn hs-btn-solid hs-btn-lg"
              style={{ background: "var(--teal-mid)", color: "white" }}
              onClick={() => navigate("/upload-report")}
            >
              Upload Health Report
            </button>
            <button
              className="hs-btn hs-btn-lg"
              style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.4)", color: "white" }}
              onClick={() => openAuth("pharma")}
            >
              Pharma Company Access
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; padding: 100px 1.5rem 60px !important; gap: 2rem !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Sub-components ── */

function FeatureCard({ color, icon, title, desc }) {
  const borderColors = { teal: "var(--teal)", navy: "var(--navy)", amber: "var(--amber)" };
  const iconBgs      = { teal: "var(--teal-bg)", navy: "var(--navy-light)", amber: "var(--amber-light)" };

  return (
    <div className="hs-card" style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${borderColors[color]}, ${borderColors[color]}99)` }} />
      <div style={{ width: 44, height: 44, borderRadius: 12, background: iconBgs[color], display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem", fontSize: "1.3rem" }}>
        {icon}
      </div>
      <h3 style={{ fontFamily: "var(--font-sub)", fontSize: "1rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.5rem" }}>{title}</h3>
      <p style={{ fontSize: "0.875rem", color: "var(--gray)", lineHeight: 1.7, fontWeight: 300 }}>{desc}</p>
    </div>
  );
}

function DemoPanel() {
  return (
    <div style={{ background: "white", borderRadius: 20, border: "1px solid var(--border)", overflow: "hidden" }}>
      <div style={{ background: "var(--teal)", padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: 8 }}>
        {[0,1,2].map(i => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />)}
        <span style={{ color: "white", fontSize: "0.8rem", fontWeight: 600, marginLeft: 8 }}>HealSmart — Live Query: "Metformin"</span>
      </div>
      <div style={{ padding: "1.5rem" }}>
        <div style={{ background: "var(--teal-bg)", borderRadius: 10, padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.85rem", color: "var(--teal)", fontWeight: 500 }}>
          🔍 Searching: "Metformin" — Found as medicine
        </div>
        {[
          { name: "Glycomet 500mg (Sun Pharma)", price: "₹35", sub: "Generic: Metformin HCl · Class: Biguanide · Rx Required", tags: ["Jan Aushadhi ₹8/strip", "Repurposing: PCOS, Cancer", "3 stores nearby"] },
          { name: "Glucophage 500mg (Merck)", price: "₹52", sub: "Same API · Brand premium 48% · Switch saves ₹44/strip", tags: ["FDA Approved 1994", "AMPK activator"] },
        ].map((item) => (
          <div key={item.name} style={{ background: "var(--surface)", borderRadius: 10, padding: "0.75rem", border: "1px solid var(--border)", marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--navy)" }}>{item.name}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--teal)", fontWeight: 600 }}>{item.price}</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--gray)", marginTop: 2 }}>{item.sub}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.4rem" }}>
              {item.tags.map(t => (
                <span key={t} style={{ fontSize: "0.7rem", padding: "0.15rem 0.4rem", borderRadius: 4, fontWeight: 600, background: "var(--teal-bg)", color: "var(--teal)" }}>{t}</span>
              ))}
            </div>
          </div>
        ))}
        <div style={{ marginTop: "0.75rem", background: "var(--teal-bg)", borderRadius: 8, padding: "0.75rem", fontSize: "0.8rem", color: "var(--teal)" }}>
          <strong>🏪 PMJAK Store #447</strong> — Rajajinagar, Bengaluru · 1.2km · <strong>In Stock</strong>
        </div>
      </div>
    </div>
  );
}

function HeroVisual({ navigate }) {
  const [searchVal, setSearchVal] = useState("Metformin");
  return (
    <div style={{ position: "relative" }}>
      {/* Floating chips */}
      <div className="animate-float" style={{ position: "absolute", top: -20, right: 20, background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: "0.6rem 0.85rem", fontSize: "0.75rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 16px rgba(0,0,0,0.06)", color: "var(--teal)", zIndex: 2 }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 1l1.5 3h3l-2.5 2 1 3L6 7.5 3 9l1-3L1.5 4h3z" /></svg>
        AI Analysis Active
      </div>
      <div className="animate-float2" style={{ position: "absolute", bottom: -10, left: -10, background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: "0.6rem 0.85rem", fontSize: "0.75rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 16px rgba(0,0,0,0.06)", color: "var(--amber)", zIndex: 2 }}>
        🏪 8,800+ Jan Aushadhi stores
      </div>
      <div className="animate-float3" style={{ position: "absolute", top: "50%", right: -30, background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: "0.6rem 0.85rem", fontSize: "0.75rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 16px rgba(0,0,0,0.06)", color: "var(--navy-mid)", zIndex: 2 }}>
        💊 Save up to 90%
      </div>

      {/* Main card */}
      <div style={{ background: "white", borderRadius: 20, padding: "1.75rem", border: "1px solid var(--border)", boxShadow: "0 20px 60px rgba(15,110,86,0.08)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 600, color: "var(--gray)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
          Quick Search
        </div>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <input
            className="hs-input"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && navigate("/drug-insights")}
            placeholder="Drug name or disease…"
          />
          <button className="hs-btn hs-btn-solid" onClick={() => navigate("/drug-insights")}>
            Search
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
          {[{ l: "Metformin", t: "tag-med" }, { l: "Breast Cancer", t: "tag-dis" }, { l: "Joint Pain", t: "tag-sym" }, { l: "Sildenafil", t: "tag-med" }].map(({ l, t }) => (
            <span key={l} className={`tag ${t}`} onClick={() => { setSearchVal(l); navigate("/drug-insights"); }}>{l}</span>
          ))}
        </div>
        <div style={{ background: "var(--surface)", borderRadius: 12, padding: "1rem", border: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "var(--font-head)", fontSize: "1.05rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.5rem", fontStyle: "italic" }}>
            Metformin 500mg
          </div>
          {[
            { name: "Glycomet (Sun Pharma)", cost: "₹35", badge: "Jan Aushadhi" },
            { name: "Metformin (Generic)", cost: "₹8",  badge: "Repurposing" },
            { name: "Glucophage (Merck)", cost: "₹52",  badge: "Brand" },
          ].map((r) => (
            <div key={r.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.4rem 0", borderBottom: "1px solid var(--border)", fontSize: "0.8rem" }}>
              <span style={{ color: "var(--gray-dark)", fontWeight: 500 }}>{r.name}</span>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--teal)" }}>{r.cost}</span>
                <span style={{ padding: "0.15rem 0.4rem", borderRadius: 4, fontSize: "0.68rem", fontWeight: 600, background: "var(--teal-bg)", color: "var(--teal)" }}>{r.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PharmaDashboardSection({ navigate, openAuth }) {
  return (
    <section className="hs-section" id="pharma" style={{ background: "white" }}>
      <div className="hs-container">
        <div className="hs-section-head">
          <div className="hs-eyebrow">Pharma Intelligence</div>
          <h2 className="hs-h2">Drug Repurposing for Pharma Companies</h2>
          <p className="hs-lead">
            Access gene target data, disease associations, pipeline intelligence, and AI-powered repurposing candidates for your R&amp;D team.
          </p>
        </div>
        <div style={{ background: "white", borderRadius: 20, border: "1px solid var(--border)", overflow: "hidden" }}>
          {/* Pharma header bar */}
          <div style={{ background: "linear-gradient(135deg, var(--navy), #185FA5)", padding: "2rem", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h3 style={{ fontFamily: "var(--font-head)", fontSize: "1.6rem", fontWeight: 600, fontStyle: "italic" }}>
                Pharma Intelligence Dashboard
              </h3>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)", marginTop: "0.25rem", fontWeight: 300 }}>
                Sample view — Register your company for full access
              </p>
            </div>
            <button
              className="hs-btn"
              style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.4)", color: "white" }}
              onClick={() => openAuth("pharma")}
            >
              Register Company →
            </button>
          </div>

          <div style={{ padding: "2rem" }}>
            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
              {PHARMA_DATA.kpis.map((kpi) => {
                const color = { teal: "var(--teal)", navy: "var(--navy-mid)", amber: "var(--amber)" }[kpi.color];
                return (
                  <div key={kpi.label} style={{ background: "var(--surface)", borderRadius: 12, padding: "1rem", border: "1px solid var(--border)", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-head)", fontSize: "1.6rem", fontWeight: 800, color }}>{kpi.value}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--gray)", marginTop: 4 }}>{kpi.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Leads + Gene targets */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1rem" }}>
              <div style={{ background: "var(--surface)", borderRadius: 12, padding: "1.25rem", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <h5 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "0.9rem", color: "var(--navy)" }}>🎯 Top Repurposing Leads</h5>
                  <span style={{ background: "var(--teal-bg)", color: "var(--teal)", padding: "0.2rem 0.5rem", borderRadius: 4, fontSize: "0.7rem", fontWeight: 700 }}>AI Ranked</span>
                </div>
                {PHARMA_DATA.leads.map((lead) => (
                  <div key={lead.drug} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", background: "white", borderRadius: 10, border: "1px solid var(--border)", marginBottom: "0.5rem" }}>
                    <span className={`phase-badge ${lead.phase}`}>{lead.label}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{lead.drug} → {lead.target}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--gray)" }}>{lead.pathway} · {lead.confidence}% confidence</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "var(--surface)", borderRadius: 12, padding: "1.25rem", border: "1px solid var(--border)" }}>
                <h5 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "0.9rem", color: "var(--navy)", marginBottom: "0.75rem" }}>🧬 Gene Target Insights</h5>
                {PHARMA_DATA.geneTargets.map((g) => (
                  <div key={g.gene} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", minWidth: 48 }}>{g.gene}</span>
                    <div style={{ flex: 1 }}>
                      <div className="conf-bar-track">
                        <div className="conf-bar-fill" style={{ width: `${g.confidence}%` }} />
                      </div>
                    </div>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--gray)", minWidth: 32 }}>{g.confidence}%</span>
                    <span style={{ fontSize: "0.72rem", color: "var(--gray)" }}>{g.diseases} dis · {g.drugs} drugs</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AudienceSection({ navigate, openAuth }) {
  const [activeTab, setActiveTab] = useState("user");
  const isUser = activeTab === "user";

  return (
    <section className="hs-section">
      <div className="hs-container">
        <div className="hs-section-head">
          <div className="hs-eyebrow">Who Uses HealSmart</div>
          <h2 className="hs-h2">Built for everyone in healthcare</h2>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "3rem" }}>
          {[{ key: "user", label: "👤 Patients & Doctors" }, { key: "pharma", label: "🏢 Pharma Companies" }].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                padding: "0.6rem 1.5rem", borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
                fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.9rem",
                background: activeTab === t.key ? "var(--teal)" : "white",
                border: activeTab === t.key ? "1.5px solid var(--teal)" : "1.5px solid var(--border)",
                color: activeTab === t.key ? "white" : "var(--gray)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
          {/* Info */}
          <div>
            <h3 style={{ fontFamily: "var(--font-head)", fontSize: "2rem", fontWeight: 600, color: "var(--navy)", marginBottom: "1rem", fontStyle: "italic", lineHeight: 1.15 }}>
              {isUser ? "Find affordable medicines near you" : "R&D intelligence for pharma teams"}
            </h3>
            <p style={{ color: "var(--gray)", lineHeight: 1.7, fontWeight: 300, marginBottom: "1.5rem" }}>
              {isUser
                ? "Whether you're a patient or a doctor, HealSmart gives you real pricing and real stores."
                : "Access gene target mappings, pipeline data, competitive analysis, and AI-powered repurposing candidates."}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {(isUser
                ? ["Search by medicine name, disease, or symptoms", "See generic alternatives saving up to 90%", "Find nearest Jan Aushadhi store with stock", "Get AI-powered medicine information"]
                : ["Full drug repurposing candidate database", "Gene target and disease association maps", "Pipeline benchmarking and competitive intel", "AI-ranked repurposing leads with evidence"]
              ).map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.9rem", color: "var(--gray-dark)" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--teal-bg)", color: "var(--teal)", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 700 }}>✓</div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* CTA card */}
          <div style={{ background: "white", borderRadius: 16, padding: "2rem", border: "1px solid var(--border)" }}>
            <h4 style={{ fontFamily: "var(--font-head)", fontSize: "1.35rem", fontWeight: 600, color: "var(--navy)", marginBottom: "1.25rem", fontStyle: "italic" }}>
              {isUser ? "👤 Create Patient / Doctor Account" : "🏢 Pharma Company Registration"}
            </h4>
            {isUser ? (
              <>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--gray)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Mobile Number</label>
                  <input className="hs-input" type="tel" placeholder="+91 98765 43210" />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--gray)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Your Name</label>
                  <input className="hs-input" type="text" placeholder="Full name" />
                </div>
                <button className="hs-btn hs-btn-solid hs-btn-lg" style={{ width: "100%", justifyContent: "center" }} onClick={() => openAuth("user")}>
                  Get Started →
                </button>
              </>
            ) : (
              <>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--gray)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Company Name</label>
                  <input className="hs-input" placeholder="e.g. Sun Pharma, Cipla, Dr. Reddy's" />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--gray)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Official Company Email</label>
                  <input className="hs-input" type="email" placeholder="you@yourcompany.com" />
                </div>
                <button className="hs-btn hs-btn-navy hs-btn-lg" style={{ width: "100%", justifyContent: "center" }} onClick={() => openAuth("pharma")}>
                  Submit for Verification →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .hs-section > .hs-container > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
