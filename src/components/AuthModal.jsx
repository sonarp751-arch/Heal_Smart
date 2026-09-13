import React, { useState } from "react";
import { useApp } from "../App";

export default function AuthModal({ type, onClose }) {
  const { showToast } = useApp();
  const [tab, setTab] = useState("login"); // login | register

  const isUser  = type === "user";
  const isPharma = type === "pharma";

  return (
    <div className="hs-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="hs-modal">
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "1rem", right: "1rem",
            background: "var(--surface)", border: "none", borderRadius: 8,
            width: 32, height: 32, cursor: "pointer",
            fontSize: "1rem", color: "var(--gray)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >✕</button>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.5rem" }}>
          <div style={{
            width: 32, height: 32,
            background: "linear-gradient(135deg, var(--teal), var(--teal-light))",
            borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M10 8h4v3h3v4h-3v3h-4v-3H7v-4h3V8z" fill="white" />
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-head)", fontSize: "1.2rem", fontWeight: 600, color: "var(--teal)", fontStyle: "italic" }}>
            HealSmart
          </span>
        </div>

        {isUser && <UserAuthForm tab={tab} setTab={setTab} showToast={showToast} onClose={onClose} />}
        {isPharma && <PharmaForm showToast={showToast} onClose={onClose} />}
      </div>
    </div>
  );
}

function Field({ label, type = "text", placeholder }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 400, color: "var(--gray)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
        {label}
      </label>
      <input className="hs-input" type={type} placeholder={placeholder} />
    </div>
  );
}

function UserAuthForm({ tab, setTab, showToast, onClose }) {
  return (
    <>
      <h2 style={{ fontFamily: "var(--font-head)", fontSize: "1.5rem", fontWeight: 800, color: "var(--navy)", marginBottom: "0.25rem" }}>
        Welcome to HealSmart
      </h2>
      <p style={{ fontSize: "0.875rem", color: "var(--gray)", marginBottom: "1.5rem", fontWeight: 300 }}>
        Sign in or create an account to access medicine search, Jan Aushadhi locator, and more.
      </p>

      <div className="auth-toggle">
        <button className={tab === "login" ? "active" : ""} onClick={() => setTab("login")}>Sign In</button>
        <button className={tab === "register" ? "active" : ""} onClick={() => setTab("register")}>Register</button>
      </div>

      {tab === "login" ? (
        <>
          <Field label="Mobile Number or Email" placeholder="+91 9876543210 or email@example.com" />
          <button className="hs-btn hs-btn-solid hs-btn-lg" style={{ width: "100%", justifyContent: "center" }}
            onClick={() => { showToast("OTP sent! Check your mobile."); onClose(); }}>
            Send OTP
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1rem 0", color: "var(--gray)", fontSize: "0.8rem" }}>
            <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
            or continue with
            <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>
          <button className="hs-btn hs-btn-outline hs-btn-lg" style={{ width: "100%", justifyContent: "center" }}
            onClick={() => showToast("Google sign-in coming soon!")}>
            🔵 Continue with Google
          </button>
        </>
      ) : (
        <>
          <Field label="Full Name" placeholder="Your name" />
          <Field label="Mobile Number" type="tel" placeholder="+91 9876543210" />
          <Field label="Email (optional)" type="email" placeholder="email@example.com" />
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--gray)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Are you a
            </label>
            <select className="hs-input">
              <option>Patient</option>
              <option>Doctor / Physician</option>
              <option>Pharmacist</option>
              <option>Healthcare Researcher</option>
            </select>
          </div>
          <button className="hs-btn hs-btn-solid hs-btn-lg" style={{ width: "100%", justifyContent: "center" }}
            onClick={() => { showToast("OTP sent! Verify to complete registration."); onClose(); }}>
            Create Account & Send OTP
          </button>
        </>
      )}
    </>
  );
}

function PharmaForm({ showToast, onClose }) {
  return (
    <>
      <h2 style={{ fontFamily: "var(--font-head)", fontSize: "1.5rem", fontWeight: 800, color: "var(--navy)", marginBottom: "0.25rem" }}>
        Pharma Company Portal
      </h2>
      <p style={{ fontSize: "0.875rem", color: "var(--gray)", marginBottom: "1.5rem", fontWeight: 300 }}>
        Register your pharmaceutical company to access drug repurposing intelligence and pipeline analytics.
      </p>

      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {[0, 1, 2].map((i) => (
          <React.Fragment key={i}>
            <div style={{
              width: i === 0 ? 24 : 8, height: 8, borderRadius: i === 0 ? 4 : "50%",
              background: i === 0 ? "var(--teal)" : "var(--border)",
            }} />
            {i < 2 && <div style={{ flex: 1, height: 1, background: "var(--border)" }} />}
          </React.Fragment>
        ))}
      </div>

      <Field label="Company Name" placeholder="e.g. Sun Pharma Ltd." />
      <Field label="Official Company Email" type="email" placeholder="research@company.com" />
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--gray)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Your Role
        </label>
        <select className="hs-input">
          <option>Research Scientist</option>
          <option>R&D Director</option>
          <option>CTO / CSO</option>
          <option>Business Development</option>
          <option>Regulatory Affairs</option>
        </select>
      </div>
      <Field label="Primary Use Case" placeholder="Drug repurposing, competitive intelligence…" />
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--gray)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Purpose Statement
        </label>
        <textarea className="hs-input" style={{ resize: "vertical", minHeight: 72 }} placeholder="Briefly describe your research goals and intended use of HealSmart data..." />
      </div>

      <div className="upload-zone" style={{ marginBottom: "1rem" }}
        onClick={() => showToast("File upload enabled after account creation")}>
        <div style={{ fontSize: "1.5rem" }}>📄</div>
        <p style={{ fontSize: "0.8rem", color: "var(--gray)", marginTop: "0.5rem", fontWeight: 300 }}>
          Upload GST Certificate or Company Registration Proof
        </p>
      </div>

      <button className="hs-btn hs-btn-navy hs-btn-lg" style={{ width: "100%", justifyContent: "center" }}
        onClick={() => { showToast("Application submitted! Our team will review within 24 hours."); onClose(); }}>
        Submit Application
      </button>
      <p style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--gray)", marginTop: "0.75rem", fontWeight: 300 }}>
        By submitting, you agree to our Terms of Service. Company details are verified before access is granted.
      </p>
    </>
  );
}
