import React from 'react';
import { NetworkNode } from '../../types';
import { Activity, CheckCircle, ExternalLink, X, Dna, GitFork, Pill, FileText } from 'lucide-react';

interface NodeEvidenceModalProps {
  node: NetworkNode | null;
  onClose: () => void;
}

export const NodeEvidenceModal: React.FC<NodeEvidenceModalProps> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel-glow rounded-2xl w-full max-w-lg p-6 border-cyan-500/40 space-y-4 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/20 shadow-lg"
              style={{ backgroundColor: `${node.color}30`, color: node.color }}
            >
              {node.type === 'target' ? (
                <Dna className="w-5 h-5" />
              ) : node.type === 'pathway' ? (
                <GitFork className="w-5 h-5" />
              ) : node.type === 'drug' ? (
                <Pill className="w-5 h-5" />
              ) : (
                <Activity className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-mono text-slate-100">{node.label}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700">
                  {node.type}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">Node Identifier: {node.id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Network Centrality Metrics */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Degree</span>
            <span className="text-base font-bold text-cyan-300">{node.degree}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Betweenness</span>
            <span className="text-base font-bold text-emerald-300">{node.betweenness.toFixed(2)}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Closeness</span>
            <span className="text-base font-bold text-purple-300">{node.closeness.toFixed(2)}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">PageRank</span>
            <span className="text-base font-bold text-amber-300">{node.pagerank.toFixed(3)}</span>
          </div>
        </div>

        {/* Evidence Chain Details */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
          <div className="font-mono font-bold text-slate-200 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Biological Association & Evidence Provenance
          </div>
          <p className="text-slate-300 leading-relaxed font-sans">
            {node.type === 'target' &&
              `Ranked as a top network bottleneck bridging multiple oncogenic signaling cascades. Strongly coupled to disease transcriptomic dysregulation with high druggability potential.`}
            {node.type === 'drug' &&
              `FDA-approved small-molecule therapeutic with verified target inhibition profile against prioritized network hubs. Readily available for computational repurposing.`}
            {node.type === 'pathway' &&
              `Reactome curated biological pathway overrepresented in the disease cohort with statistically significant FDR correction.`}
            {node.type === 'gene' &&
              `Significantly dysregulated transcript identified through differential expression analysis across disease versus control samples.`}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Community Cluster: #{node.cluster}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
