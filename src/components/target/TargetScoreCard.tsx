import React from 'react';
import { TargetEntity } from '../../types';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { CheckCircle2, ChevronRight, Dna, FileText, HelpCircle, Layers, Sparkles, Star } from 'lucide-react';

interface TargetScoreCardProps {
  target: TargetEntity;
  isSelected?: boolean;
  onSelect?: (target: TargetEntity) => void;
}

export const TargetScoreCard: React.FC<TargetScoreCardProps> = ({
  target,
  isSelected = false,
  onSelect,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 70) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-slate-400 border-slate-700 bg-slate-800';
  };

  const categories = [
    { label: 'Disease Association', val: target.scores.diseaseAssociation },
    { label: 'Omics Evidence', val: target.scores.omicsEvidence },
    { label: 'Network Centrality', val: target.scores.networkCentrality },
    { label: 'Pathway Relevance', val: target.scores.pathwayRelevance },
    { label: 'Druggability Score', val: target.scores.druggability },
    { label: 'Structural Coverage', val: target.scores.structuralEvidence },
    { label: 'Literature Precedent', val: target.scores.literatureSupport },
  ];

  return (
    <div
      onClick={() => onSelect && onSelect(target)}
      className={`rounded-xl p-5 cursor-pointer transition-all border ${
        isSelected
          ? 'glass-panel-glow border-cyan-400/60'
          : 'glass-card border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold font-mono text-slate-100">{target.geneSymbol}</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
              {target.targetClass}
            </span>
            <span className="text-xs font-mono text-slate-400">{target.uniprotId}</span>
          </div>
          <p className="text-xs text-slate-300 font-medium">{target.targetName}</p>
        </div>

        {/* Composite Score Circle */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Target Score</span>
          <div className={`px-3 py-1 rounded-lg border font-mono font-bold text-lg mt-0.5 ${getScoreColor(target.compositeScore)}`}>
            {target.compositeScore.toFixed(1)} <span className="text-xs font-normal text-slate-400">/100</span>
          </div>
        </div>
      </div>

      {/* Score Breakdown Bars */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs font-mono">
        {categories.map((cat) => (
          <div key={cat.label} className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{cat.label}</span>
              <span className="text-slate-200 font-semibold">{cat.val}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${cat.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3 text-slate-400">
          <span>PDBs: <strong className="text-cyan-300">{target.pdbCount}</strong></span>
          <span>Papers: <strong className="text-slate-200">{target.literatureCount}</strong></span>
          {target.bestPdbId && <span>Best PDB: <strong className="text-amber-300">{target.bestPdbId} ({target.resolution})</strong></span>}
        </div>

        <ProvenanceBadge meta={target.provenance} />
      </div>
    </div>
  );
};

export const WhyThisTarget: React.FC<{ target: TargetEntity }> = ({ target }) => {
  const steps = [
    {
      title: '1. Omics & Differential Expression',
      summary: target.omicsSummary,
      score: target.scores.omicsEvidence,
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    },
    {
      title: '2. Biological Network Centrality',
      summary: target.networkSummary,
      score: target.scores.networkCentrality,
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    },
    {
      title: '3. Pathway Relevance & Cascades',
      summary: target.pathwaySummary,
      score: target.scores.pathwayRelevance,
      color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    },
    {
      title: '4. Genetic & Phenotypic Disease Association',
      summary: target.diseaseAssociationSummary,
      score: target.scores.diseaseAssociation,
      color: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
    },
    {
      title: '5. Small-Molecule Druggability',
      summary: target.druggabilitySummary,
      score: target.scores.druggability,
      color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    },
    {
      title: '6. Macromolecular 3D Structure Resolution',
      summary: target.structuralSummary,
      score: target.scores.structuralEvidence,
      color: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    },
  ];

  return (
    <div className="glass-panel rounded-xl p-6 border-cyan-500/30 space-y-5 bg-gradient-to-b from-[#0D1527] to-[#070B14]">
      <div className="flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            TRANSPARENT EVIDENCE CHAIN
          </div>
          <h3 className="text-xl font-bold font-mono text-slate-100">
            WHY PRIORITIZE <span className="text-cyan-400">{target.geneSymbol}</span>?
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {target.rationale}
          </p>
        </div>

        <div className="text-right font-mono">
          <div className="text-xs text-slate-400">Total Prioritization</div>
          <div className="text-3xl font-extrabold text-gradient-cyan">
            {target.compositeScore.toFixed(1)} <span className="text-sm text-slate-400 font-normal">/ 100</span>
          </div>
        </div>
      </div>

      {/* Interactive Evidence Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {steps.map((step) => (
          <div key={step.title} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-slate-200">{step.title}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${step.color}`}>
                  {step.score}%
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{step.summary}</p>
            </div>
            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Validated Source
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
