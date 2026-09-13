import React, { createContext, useContext, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar       from "./components/Navbar";
import Footer       from "./components/Footer";
import Toast        from "./components/Toast";
import AuthModal    from "./components/AuthModal";

import Landing      from "./pages/Landing";
import UploadReport from "./pages/UploadReport";
import DrugInsights from "./pages/DrugInsights";
import ApiSettings  from "./pages/ApiSettings";

/* ── Global context: toast + modal ── */
export const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

export default function App() {
  const [toast,     setToast]     = useState(null);
  const [authModal, setAuthModal] = useState(null); // null | "user" | "pharma"
  const [apiKey,    setApiKey]    = useState(
    () => localStorage.getItem("hs_openrouter_key") || ""
  );

  const showToast = useCallback((msg, duration = 3500) => {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  }, []);

  const openAuth  = useCallback((type) => setAuthModal(type), []);
  const closeAuth = useCallback(() => setAuthModal(null), []);

  const saveApiKey = useCallback((key) => {
    setApiKey(key);
    localStorage.setItem("hs_openrouter_key", key);
  }, []);

  return (
    <AppContext.Provider value={{ showToast, openAuth, apiKey, saveApiKey }}>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/"              element={<Landing />} />
          <Route path="/upload-report" element={<UploadReport />} />
          <Route path="/drug-insights" element={<DrugInsights />} />
          <Route path="/settings"      element={<ApiSettings />} />
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>

        <Footer />

        {toast     && <Toast message={toast} />}
        {authModal && <AuthModal type={authModal} onClose={closeAuth} />}
      </BrowserRouter>
    </AppContext.Provider>
  );
}
