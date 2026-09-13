import React, { useState } from "react";
import { useApp } from "../App";
import { callOpenRouter } from "../api/openrouter";

const MODELS = [
  { id: "mistralai/mistral-7b-instruct", label: "Mistral 7B Instruct",     note: "Free tier · Fast",         free: true  },
  { id: "google/gemma-2-9b-it:free",     label: "Gemma 2 9B (Google)",     note: "Free tier · Good quality", free: true  },
  { id: "meta-llama/llama-3-8b-instruct:free", label: "Llama 3 8B (Meta)", note: "Free tier · Popular",      free: true  },
  { id: "anthropic/claude-3-haiku",      label: "Claude 3 Haiku",           note: "Paid · Best quality",      free: false },
  { id: "openai/gpt-3.5-turbo",          label: "GPT-3.5 Turbo",           note: "Paid · Very good",         free: false },
];

export default function ApiSettings() {
  const { apiKey, saveApiKey, showToast } = useApp();
  const [input,   setInput]   = useState(apiKey || "");
  const [saved,   setSaved]   = useState(false);
  const [testing, setTesting] = useState(false);
  const [testMsg, setTestMsg] = useState(null);
  const [model,   setModel]   = useState(
    process.env.REACT_APP_OPENROUTER_MODEL || "mistralai/mistral-7b-instruct"
  );

  const save = () => {
    saveApiKey(input.trim());
    setSaved(true);
    showToast("API key saved!");
    setTimeout(() => setSaved(false), 2500);
  };

  const testKey = async () => {
    if (!input.trim()) { setTestMsg({ ok: false, text: "Please enter an API key first." }); return; }
    setTesting(true);
    setTestMsg(null);
    try {
      const res = await callOpenRouter("You are a concise assistant.", "Reply with exactly: HealSmart connection OK", input.trim());
      setTestMsg({ ok: true, text: res || "Connected successfully!" });
    } catch (e) {
      setTestMsg({ ok: false, text: e.message || "Connection failed." });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{ paddingTop: 64 }}>
      <div className="hs-section">
        <div className="hs-container" style={{ maxWidth: 740 }}>

          <div style={{ marginBottom: "2.5rem" }}>
            <h1 style={{ fontFamily: "var(--font-head)", fontSize: "2.4rem", fontWeight: 600, color: "var(--navy)", fontStyle: "italic", marginBottom: "0.5rem" }}>
              ⚙️ API Settings
            </h1>
            <p style={{ color: "var(--gray)", fontWeight: 300 }}>
              Connect HealSmart to OpenRouter to enable live AI drug insights, health analysis, and repurposing intelligence.
            </p>
          </div>

          {/* How to get key */}
          <div style={{ background: "var(--teal-bg)", border: "1px solid rgba(15,110,86,0.2)", borderRadius: 12, padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.75rem", color: "var(--teal)", fontFamily: "var(--font-sub)" }}>
              🔑 How to get your free OpenRouter API key
            </div>
            <ol style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {[
                <span>Visit <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" style={{ color: "var(--teal)", fontWeight: 500 }}>openrouter.ai/keys</a></span>,
                "Sign up or log in (free account)",
                "Click "Create Key" and copy the key",
                "Paste it below and click Save",
              ].map((step, i) => (
                <li key={i} style={{ fontSize: "0.875rem", color: "var(--gray)", lineHeight: 1.6 }}>
                  {step}
                </li>
              ))}
            </ol>
            <p style={{ marginTop: "0.75rem", fontSize: "0.78rem", color: "var(--teal)", fontFamily: "var(--font-mono)", background: "rgba(255,255,255,0.5)", padding: "0.4rem 0.75rem", borderRadius: 6 }}>
              Mistral 7B, Gemma 2, and Llama 3 are completely free to use.
            </p>
          </div>

          {/* Key input card */}
          <div style={{ background: "white", borderRadius: 16, padding: "2rem", border: "1px solid var(--border)", marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--gray)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              OpenRouter API Key
            </label>
            <div style={{ display: "flex", gap: "0.625rem", marginBottom: "0.875rem" }}>
              <input
                className="hs-input"
                type="password"
                value={input}
                placeholder="sk-or-v1-…"
                onChange={(e) => { setInput(e.target.value); setSaved(false); setTestMsg(null); }}
                style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}
              />
              <button
                className="hs-btn hs-btn-outline"
                onClick={testKey}
                disabled={testing}
                style={{ whiteSpace: "nowrap" }}
              >
                {testing ? "Testing…" : "Test Key"}
              </button>
            </div>

            {testMsg && (
              <div style={{
                padding: "0.75rem 1rem", borderRadius: 8, marginBottom: "0.875rem",
                background: testMsg.ok ? "var(--teal-bg)" : "var(--red-light)",
                border: `1px solid ${testMsg.ok ? "rgba(15,110,86,0.2)" : "rgba(163,45,45,0.2)"}`,
                color: testMsg.ok ? "var(--teal)" : "var(--red)",
                fontSize: "0.83rem",
              }}>
                {testMsg.ok ? "✓ " : "✗ "}{testMsg.text}
              </div>
            )}

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                className="hs-btn hs-btn-solid"
                onClick={save}
                style={saved ? { background: "#3B6D11" } : {}}
              >
                {saved ? "✓ Saved!" : "Save API Key"}
              </button>
              {apiKey && (
                <button
                  className="hs-btn"
                  style={{ background: "var(--red-light)", color: "var(--red)", border: "1px solid rgba(163,45,45,0.2)" }}
                  onClick={() => { setInput(""); saveApiKey(""); showToast("API key removed."); }}
                >
                  Remove Key
                </button>
              )}
            </div>

            <p style={{ fontSize: "0.72rem", color: "var(--gray)", marginTop: "0.875rem", fontFamily: "var(--font-mono)" }}>
              Your key is stored only in your browser's localStorage — never sent to our servers.
            </p>
          </div>

          {/* Model selector */}
          <div style={{ background: "white", borderRadius: 16, padding: "2rem", border: "1px solid var(--border)", marginBottom: "1.25rem" }}>
            <h4 style={{ fontFamily: "var(--font-head)", fontSize: "1.1rem", fontWeight: 600, color: "var(--navy)", fontStyle: "italic", marginBottom: "0.25rem" }}>
              🤖 AI Model
            </h4>
            <p style={{ fontSize: "0.8rem", color: "var(--gray)", marginBottom: "1rem", fontWeight: 300 }}>
              Set <code style={{ background: "var(--surface)", padding: "0.1rem 0.3rem", borderRadius: 4, fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>REACT_APP_OPENROUTER_MODEL</code> in your .env to change permanently.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {MODELS.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setModel(m.id)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "0.875rem 1rem", borderRadius: 8, cursor: "pointer",
                    background: model === m.id ? "var(--teal-bg)" : "var(--surface)",
                    border: `1px solid ${model === m.id ? "rgba(15,110,86,0.3)" : "var(--border)"}`,
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{
                      width: 14, height: 14, borderRadius: "50%",
                      border: `2px solid ${model === m.id ? "var(--teal)" : "var(--border)"}`,
                      background: model === m.id ? "var(--teal)" : "transparent",
                      transition: "all 0.15s",
                    }} />
                    <div>
                      <div style={{ fontSize: "0.875rem", fontWeight: model === m.id ? 500 : 400 }}>{m.label}</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--gray)", marginTop: 2 }}>{m.id}</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: "0.68rem", padding: "0.2rem 0.5rem", borderRadius: 4, fontWeight: 600,
                    background: m.free ? "var(--teal-bg)" : "var(--amber-light)",
                    color: m.free ? "var(--teal)" : "var(--amber)",
                  }}>
                    {m.note}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* .env snippet */}
          <div style={{ background: "white", borderRadius: 16, padding: "2rem", border: "1px solid var(--border)" }}>
            <h4 style={{ fontFamily: "var(--font-head)", fontSize: "1.1rem", fontWeight: 600, color: "var(--navy)", fontStyle: "italic", marginBottom: "1rem" }}>
              📄 .env File Configuration
            </h4>
            <pre style={{
              background: "var(--navy)", color: "var(--teal-mid)",
              borderRadius: 10, padding: "1.25rem", fontSize: "0.82rem",
              fontFamily: "var(--font-mono)", overflowX: "auto", lineHeight: 1.75,
            }}>
{`REACT_APP_OPENROUTER_API_KEY=sk-or-v1-your-key-here
REACT_APP_OPENROUTER_MODEL=${model}
REACT_APP_SITE_URL=http://localhost:3000
REACT_APP_SITE_NAME=HealSmart`}
            </pre>
            <p style={{ fontSize: "0.72rem", color: "var(--gray)", marginTop: "0.75rem", fontFamily: "var(--font-mono)" }}>
              ⚠ Never commit your .env file to Git — it's already in .gitignore.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
