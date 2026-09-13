import React from 'react';
import { Database, ExternalLink, ShieldAlert, Sparkles, TestTube } from 'lucide-react';
import { ProvenanceMeta } from '../../types';

interface ProvenanceBadgeProps {
  meta?: ProvenanceMeta;
  className?: string;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({ meta, className = '' }) => {
  if (!meta) return null;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-slate-900/80 border border-slate-700/60 text-slate-300 ${className}`}>
      {meta.isDemo ? (
        <span className="flex items-center gap-1 text-amber-400 font-semibold">
          <ShieldAlert className="w-3.5 h-3.5" />
          DEMO
        </span>
      ) : meta.isExperimental ? (
        <span className="flex items-center gap-1 text-emerald-400">
          <TestTube className="w-3.5 h-3.5" />
          EXP
        </span>
      ) : meta.isPredicted ? (
        <span className="flex items-center gap-1 text-purple-400">
          <Sparkles className="w-3.5 h-3.5" />
          PRED
        </span>
      ) : (
        <span className="flex items-center gap-1 text-cyan-400">
          <Database className="w-3.5 h-3.5" />
          DB
        </span>
      )}

      <span className="text-slate-400">|</span>
      <span className="text-slate-200 font-medium">{meta.source}</span>
      {meta.recordId && <span className="text-cyan-400/90 font-mono">[{meta.recordId}]</span>}

      {meta.sourceUrl && (
        <a
          href={meta.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-cyan-300 ml-0.5 transition-colors"
          title="Open Primary Data Source"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
};

export const DemoDataBadge: React.FC<{ label?: string }> = ({ label = 'DEMO DATA' }) => {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
      {label}
    </span>
  );
};
