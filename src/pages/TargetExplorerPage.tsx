import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Boxes, CheckCircle2, Dna, Layers, ShieldAlert, Sparkles } from 'lucide-react';
import { TargetScoreCard, WhyThisTarget } from '../components/target/TargetScoreCard';
import { useResearchProject } from '../context/ResearchProjectContext';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';
import { TargetEntity } from '../types';

export const TargetExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const { targets, selectedTarget, setSelectedTarget, setSelectedStructure, setSelectedPocket } = useResearchProject();

  const handleSelectTarget = (target: TargetEntity) => {
    setSelectedTarget(target);
  };

  const handleProceedToStructure = () => {
    navigate('/structures');
  };

  return (
    <div className="space-y-6 py-4 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              STAGE 03 • TARGET EXPLORER
            </span>
            <ProvenanceBadge meta={selectedTarget?.provenance} />
          </div>
          <h1 className="text-2xl font-bold font-mono text-slate-100 mt-1">
            Transparent Target Prioritization & Evidence Chains
          </h1>
          <p className="text-xs text-slate-300 font-sans max-w-2xl">
            Rank potential drug targets using a composite multi-evidence score out of 100.
            Every score provides an explainable provenance breakdown connecting omics, interactome centrality,
            pathways, disease genetic evidence, druggability, and 3D crystal structures.
          </p>
        </div>

        <button
          onClick={handleProceedToStructure}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition-colors flex items-center gap-1.5 self-start md:self-auto shadow-lg shadow-cyan-500/20"
        >
          <span>3D Structure & Pocket</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Prominent WHY THIS TARGET? Evidence Chain */}
      {selectedTarget && <WhyThisTarget target={selectedTarget} />}

      {/* Target Candidates Ranking Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Dna className="w-4 h-4 text-cyan-400" />
            Prioritized Target Entities ({targets.length})
          </h3>
          <span className="text-xs font-mono text-slate-400">Ranked by Composite Evidence Score</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {targets.map((tgt) => (
            <TargetScoreCard
              key={tgt.id}
              target={tgt}
              isSelected={selectedTarget?.id === tgt.id}
              onSelect={handleSelectTarget}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
