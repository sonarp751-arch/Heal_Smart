import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../App";

const NAV_LINKS = [
  { label: "Home",                  path: "/"                },
  { label: "🧬 Omics Target Engine", path: "/omics-discovery" },
  { label: "Drug Insights",         path: "/drug-insights"   },
  { label: "Upload Report",         path: "/upload-report"   },
];

export default function Navbar() {
  const navigate      = useNavigate();
  const { pathname }  = useLocation();
  const { openAuth, apiKey } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const logoClick = () => navigate("/");

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.96)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 2rem",
        transition: "box-shadow 0.2s",
        boxShadow: scrolled ? "0 2px 16px rgba(15,110,86,0.07)" : "none",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>

        {/* ── Logo ── */}
        <button onClick={logoClick} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer" }}>
          <div style={{
            width: 36, height: 36,
            background: "linear-gradient(135deg, var(--teal), var(--teal-light))",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" fill="rgba(255,255,255,0.3)" />
              <path d="M10 8h4v3h3v4h-3v3h-4v-3H7v-4h3V8z" fill="white" />
              <circle cx="17" cy="7" r="2.5" fill="#5DCAA5" />
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-head)", fontSize: "1.55rem", fontWeight: 600, color: "var(--teal)", fontStyle: "italic" }}>
            Heal<span style={{ color: "var(--navy)", fontStyle: "normal", fontWeight: 300 }}>Smart</span>
          </span>
        </button>

        {/* ── Desktop nav links ── */}
        <div className="hide-mobile" style={{ display: "flex", gap: "1.75rem", alignItems: "center" }}>
          {NAV_LINKS.map((l) => (
            <button
              key={l.path}
              onClick={() => navigate(l.path)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "var(--font-body)", fontSize: "0.82rem",
                fontWeight: 400, letterSpacing: "0.04em",
                color: pathname === l.path ? "var(--teal)" : "var(--gray)",
                borderBottom: pathname === l.path ? "1.5px solid var(--teal)" : "1.5px solid transparent",
                paddingBottom: 2, transition: "color 0.2s",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* ── CTA buttons ── */}
        <div className="hide-mobile" style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {/* API key status pill */}
          <button
            onClick={() => navigate("/settings")}
            title={apiKey ? "API key configured" : "Configure OpenRouter key"}
            style={{
              background: apiKey ? "var(--teal-bg)" : "var(--amber-light)",
              border: `1px solid ${apiKey ? "rgba(15,110,86,0.25)" : "rgba(186,117,23,0.3)"}`,
              color: apiKey ? "var(--teal)" : "var(--amber)",
              fontFamily: "var(--font-mono)", fontSize: "0.68rem",
              padding: "0.3rem 0.75rem", borderRadius: 20,
              cursor: "pointer", fontWeight: 400, letterSpacing: "0.06em",
              display: "flex", alignItems: "center", gap: 5,
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: apiKey ? "var(--teal)" : "var(--amber)",
              display: "inline-block",
            }} />
            {apiKey ? "AI Active" : "Set API Key"}
          </button>

          <button className="hs-btn hs-btn-outline" onClick={() => openAuth("user")}>Sign In</button>
          <button className="hs-btn hs-btn-navy"    onClick={() => openAuth("pharma")}>Pharma Portal</button>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: "none", background: "none",
            border: "1px solid var(--border)", borderRadius: 8,
            padding: "0.4rem 0.65rem", cursor: "pointer", fontSize: "1rem",
          }}
          className="mobile-menu-btn"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      {mobileOpen && (
        <div style={{
          padding: "1rem 2rem 1.5rem",
          background: "white",
          borderTop: "1px solid var(--border)",
          display: "flex", flexDirection: "column", gap: "0.75rem",
        }}>
          {NAV_LINKS.map((l) => (
            <button
              key={l.path}
              onClick={() => navigate(l.path)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "var(--font-body)", fontSize: "0.9rem",
                color: pathname === l.path ? "var(--teal)" : "var(--gray-dark)",
                textAlign: "left", padding: "0.5rem 0",
              }}
            >
              {l.label}
            </button>
          ))}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", paddingTop: "0.5rem" }}>
            <button className="hs-btn hs-btn-outline" onClick={() => openAuth("user")}>Sign In</button>
            <button className="hs-btn hs-btn-navy"    onClick={() => openAuth("pharma")}>Pharma Portal</button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
