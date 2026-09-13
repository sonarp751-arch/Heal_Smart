import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  Play,
  RefreshCw,
  Server,
  ShieldAlert,
  Terminal,
} from 'lucide-react';
import { DockingSetupConfig } from '../../types';
import { checkDockingBackendHealth, DockingBackendStatus } from '../../services/dockingBackendService';

interface DockingStatusPanelProps {
  config: DockingSetupConfig | null;
  onRefreshBackend?: () => void;
}

export const DockingStatusPanel: React.FC<DockingStatusPanelProps> = ({ config }) => {
  const [copiedVina, setCopiedVina] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const [backendStatus, setBackendStatus] = useState<DockingBackendStatus>({
    connected: false,
    endpoint: 'http://localhost:8000/api/v1/dock',
    message: 'Docking preparation complete. Docking execution unavailable — no calculated affinity reported.',
  });
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckBackend = async () => {
    setIsChecking(true);
    const status = await checkDockingBackendHealth(config?.backendUrl || 'http://localhost:8000/api/v1/status');
    setBackendStatus(status);
    setIsChecking(false);
  };

  const handleCopyVina = () => {
    if (!config?.vinaConfigText) return;
    navigator.clipboard.writeText(config.vinaConfigText);
    setCopiedVina(true);
    setTimeout(() => setCopiedVina(false), 2000);
  };

  const handleCopyCli = () => {
    if (!config?.cliCommand) return;
    navigator.clipboard.writeText(config.cliCommand);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const handleDownloadFiles = () => {
    if (!config) return;
    // Download vina_config.txt
    const blob = new Blob([config.vinaConfigText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vina_config_${config.receptorPdbId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Scientific Integrity Status Banner */}
      <div className="glass-panel-glow rounded-xl p-5 border-cyan-500/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold font-mono text-slate-100">
                  DOCKING PREPARATION COMPLETE
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                  READY FOR EXECUTION
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Target receptor coordinates, active pocket grid box, and candidate ligand structures prepared.
              </p>
            </div>
          </div>

          <button
            onClick={handleCheckBackend}
            disabled={isChecking}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>Check Backend Worker</span>
          </button>
        </div>

        {/* Scientific Integrity Mandatory Notice */}
        <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs font-mono text-amber-200 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <ShieldAlert className="w-4 h-4" />
            SCIENTIFIC INTEGRITY ENFORCEMENT
          </div>
          <p className="leading-relaxed">
            InSilicoRepurposer <strong>never fabricates simulated docking scores or mock AutoDock Vina affinities</strong>.
            When a local or remote computational backend worker (e.g. AutoDock Vina / Smina FastAPI daemon) is not connected,
            we report preparation status truthfully without invented numbers.
          </p>
          <div className="text-[11px] text-amber-400/90 pt-1">
            Status: <span className="font-semibold text-slate-100">{backendStatus.message}</span>
          </div>
        </div>
      </div>

      {/* Generated AutoDock Vina Configuration (vina_config.txt) */}
      <div className="glass-panel rounded-xl p-5 border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold font-mono text-slate-100 uppercase tracking-wider">
              AutoDock Vina Configuration File (vina_config.txt)
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyVina}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              <span>{copiedVina ? 'Copied!' : 'Copy Config'}</span>
            </button>
            <button
              onClick={handleDownloadFiles}
              className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono border border-cyan-500/40 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Files</span>
            </button>
          </div>
        </div>

        <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-xs text-cyan-300/90 overflow-x-auto leading-relaxed">
          {config?.vinaConfigText || '# No configuration generated yet.'}
        </pre>
      </div>

      {/* Automated Shell Script for Terminal Execution */}
      <div className="glass-panel rounded-xl p-5 border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold font-mono text-slate-100 uppercase tracking-wider">
              Reproducible Command-Line Execution Script (run_docking.sh)
            </h4>
          </div>

          <button
            onClick={handleCopyCli}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5 text-emerald-400" />
            <span>{copiedCli ? 'Copied!' : 'Copy Bash Script'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-xs text-emerald-300/90 overflow-x-auto leading-relaxed">
          {config?.cliCommand || '# Shell script ready once target and ligand are selected.'}
        </pre>
      </div>
    </div>
  );
};
