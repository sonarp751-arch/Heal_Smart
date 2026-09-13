import React from "react";
import { useNavigate } from "react-router-dom";

export function LoadingDots({ message = "Analysing with AI…" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "2rem", justifyContent: "center", color: "var(--gray)" }}>
      <div style={{ display: "flex", gap: 6 }}>
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
      </div>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 300 }}>{message}</span>
    </div>
  );
}

export function ErrorBanner({ error, onRetry }) {
  const navigate = useNavigate();
  const isKeyError = error === "NO_KEY" || error?.includes("401") || error?.includes("403") || error?.includes("API key");

  return (
    <div style={{
      background: "var(--red-light)", border: "1px solid rgba(163,45,45,0.2)",
      borderRadius: 12, padding: "1.25rem 1.5rem", margin: "1rem 0",
    }}>
      <div style={{ fontWeight: 600, color: "var(--red)", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
        {isKeyError ? "⚙️ OpenRouter API Key Required" : "⚠️ Request Failed"}
      </div>
      <p style={{ fontSize: "0.83rem", color: "var(--gray)", lineHeight: 1.6, marginBottom: "0.875rem", fontWeight: 300 }}>
        {isKeyError
          ? "Add your free OpenRouter API key to enable live AI results. The platform will use mock data in the meantime."
          : (error || "An unexpected error occurred.")}
      </p>
      <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
        {isKeyError && (
          <button className="hs-btn hs-btn-solid" onClick={() => navigate("/settings")}>
            Configure API Key →
          </button>
        )}
        {onRetry && (
          <button className="hs-btn hs-btn-outline" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
