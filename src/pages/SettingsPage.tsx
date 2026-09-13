import React, { useState } from 'react';
import {
  CheckCircle2,
  Cpu,
  Database,
  Key,
  RefreshCw,
  Save,
  Server,
  Settings,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { checkDockingBackendHealth } from '../services/dockingBackendService';

export const SettingsPage: React.FC = () => {
  const {
    openRouterModel,
    setOpenRouterModel,
    dockingBackendUrl,
    setDockingBackendUrl,
    enableLiveExternalApis,
    setEnableLiveExternalApis,
    resetToDefaults,
    uniprotEndpoint,
    rcsbPdbEndpoint,
    europePmcEndpoint,
    chemblEndpoint,
  } = useSettings();

  const [savedNotice, setSavedNotice] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleTestBackend = async () => {
    setIsTesting(true);
    const status = await checkDockingBackendHealth(dockingBackendUrl);
    setTestResult(status.message);
    setIsTesting(false);
  };

  return (
    <div className="space-y-6 py-4 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              SYSTEM CONFIGURATION
            </span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-slate-100 mt-1">
            API Keys, Docking Backend & Scientific Sources
          </h1>
          <p className="text-xs text-slate-300 font-sans">
            Manage OpenRouter LLM keys, local AutoDock Vina computational daemons, and public scientific service endpoints.
          </p>
        </div>

        <button
          onClick={resetToDefaults}
          className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700 transition-colors"
        >
          Reset Defaults
        </button>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Configuration saved to secure browser local storage.</span>
        </div>
      )}

      {/* OpenRouter AI Reasoning Layer */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-base font-bold font-mono text-slate-100">
            OpenRouter LLM Interpretation Layer
          </h3>
        </div>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          OpenRouter provides contextual interpretation over retrieved biological evidence. In accordance with platform integrity,
          the reasoning layer is strictly constrained never to hallucinate scientific facts or fake docking scores.
        </p>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
            The OpenRouter key is configured on the Vercel server and is never sent to this browser.
          </div>
          <div className="space-y-1">
            <label className="text-slate-400 block">Default LLM Model:</label>
            <input
              type="text"
              value={openRouterModel}
              onChange={(e) => setOpenRouterModel(e.target.value)}
              placeholder="meta-llama/llama-3.3-70b-instruct:free"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* AutoDock Vina Execution Backend */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold font-mono text-slate-100">
              AutoDock Vina Computational Worker Daemon
            </h3>
          </div>
          <button
            onClick={handleTestBackend}
            disabled={isTesting}
            className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono border border-cyan-500/40 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
            <span>Test Connection</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          Provide the local or remote HTTP endpoint running a FastAPI / AutoDock Vina executor (e.g. `http://localhost:8000/api/v1/dock`).
        </p>

        <div className="space-y-1 font-mono text-xs">
          <label className="text-slate-400 block">Docking Worker Endpoint:</label>
          <input
            type="text"
            value={dockingBackendUrl}
            onChange={(e) => setDockingBackendUrl(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        {testResult && (
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300">
            {testResult}
          </div>
        )}
      </div>

      {/* Public Scientific Data Adapters */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5">
          <Database className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold font-mono text-slate-100">
            Authoritative Scientific Data Adapters
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">UniProtKB REST API</span>
            <span className="text-emerald-300 truncate block">{uniprotEndpoint}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">RCSB PDB Coordinates API</span>
            <span className="text-emerald-300 truncate block">{rcsbPdbEndpoint}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Europe PMC Search API</span>
            <span className="text-emerald-300 truncate block">{europePmcEndpoint}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">ChEMBL Compound API</span>
            <span className="text-emerald-300 truncate block">{chemblEndpoint}</span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2 flex items-center justify-end gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 text-slate-950 font-bold font-mono text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Configuration</span>
        </button>
      </div>
    </div>
  );
};
