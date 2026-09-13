import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Binary,
  Boxes,
  Compass,
  Cpu,
  Database,
  Dna,
  FileCheck2,
  GitFork,
  Network,
  Pill,
  RefreshCw,
  Sparkles,
  TestTube2,
} from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';
import { ResearchPipeline } from '../components/common/ResearchPipeline';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';
import { useResearchProject } from '../context/ResearchProjectContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    disease,
    omicsExperiment,
    degs,
    targets,
    selectedTarget,
    selectedStructure,
    selectedPocket,
    selectedMolecule,
    loadDemoProject,
  } = useResearchProject();

  const handleOpenStage = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-6 py-4 pb-16">
      {/* Top Banner & Project Overview */}
      <div className="glass-panel-glow rounded-2xl p-6 border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              ACTIVE RESEARCH PROJECT
            </span>
            <span className="text-xs font-mono text-slate-400">ID: PRJ_GBM_2026_01</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100">
            {disease ? disease.name : 'No Disease Selected'}
          </h1>
          <p className="text-xs text-slate-300 font-sans max-w-2xl">
            {disease?.description || 'Select a disease phenotype or upload custom omics to initialize the pipeline.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => loadDemoProject('GBM')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset Demo</span>
          </button>
          <button
            onClick={() => navigate('/report')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 text-slate-950 font-bold text-xs font-mono shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>View Dossier</span>
          </button>
        </div>
      </div>

      {/* Interactive Pipeline Ribbon */}
      <div className="glass-panel rounded-xl p-3 border-slate-800">
        <div className="text-xs font-mono text-slate-400 mb-2 px-2 flex items-center justify-between">
          <span className="font-bold text-slate-200 uppercase tracking-wider">Interactive Research Workflow</span>
          <span>Click any stage to inspect computational workspace</span>
        </div>
        <ResearchPipeline activeStage="disease" />
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Disease Genes"
          value={disease?.associatedGenesCount || 0}
          unit="genes"
          subValue={disease?.ontology || 'EFO'}
          icon={Compass}
          color="cyan"
          footnote="Open Targets Platform"
        />
        <MetricCard
          label="Differential DEGs"
          value={omicsExperiment?.significantDegsCount || 0}
          unit="significant"
          subValue="p-adj < 0.05, |FC| > 1.5"
          icon={Binary}
          color="emerald"
          trend="up"
          trendValue="+2,480"
          footnote="TCGA-GBM RNA-seq"
        />
        <MetricCard
          label="Prioritized Targets"
          value={targets.length}
          unit="ranked"
          subValue={`Top: ${selectedTarget?.geneSymbol || 'EGFR'}`}
          icon={Dna}
          color="purple"
          footnote="Score > 80/100"
        />
        <MetricCard
          label="Repurposing Matches"
          value="4"
          unit="candidates"
          subValue={`Top: ${selectedMolecule?.name || 'Erlotinib'}`}
          icon={Pill}
          color="amber"
          footnote="FDA Approved Drugs"
        />
      </div>

      {/* Two-Column Research Layout: Target Prioritization + Structural & Docking Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top Prioritized Targets */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-mono text-slate-100 flex items-center gap-2">
                <Dna className="w-5 h-5 text-cyan-400" />
                Target Prioritization Leaderboard
              </h3>
              <p className="text-xs text-slate-400">
                Transparent multi-omics and network centrality scoring (0-100)
              </p>
            </div>
            <button
              onClick={() => handleOpenStage('/targets')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              All Targets <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {targets.map((tgt) => (
              <div
                key={tgt.id}
                onClick={() => navigate('/targets')}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-slate-100">{tgt.geneSymbol}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                      {tgt.targetClass}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{tgt.uniprotId}</span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-1">{tgt.targetName}</p>
                </div>

                <div className="text-right font-mono flex-shrink-0">
                  <div className="text-sm font-bold text-cyan-300">{tgt.compositeScore.toFixed(1)} / 100</div>
                  <div className="text-[10px] text-slate-400">PDB: {tgt.bestPdbId || 'Available'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Structure & Docking Readiness */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border-slate-800 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold font-mono text-slate-100 flex items-center gap-2">
                <Boxes className="w-5 h-5 text-emerald-400" />
                Structural & Docking Status
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                PREP READY
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Receptor PDB:</span>
                <strong className="text-slate-200">
                  {selectedStructure?.pdbId} ({selectedStructure?.resolution})
                </strong>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Binding Pocket:</span>
                <strong className="text-cyan-300 truncate max-w-[180px]">
                  {selectedPocket?.pocketName}
                </strong>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Pocket Volume:</span>
                <strong className="text-slate-200">{selectedPocket?.volumeA3} Å³</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Candidate Drug:</span>
                <strong className="text-purple-300">{selectedMolecule?.name}</strong>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => navigate('/docking')}
              className="w-full py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 font-mono font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              <span>Open Docking Planner</span>
            </button>

            <button
              onClick={() => navigate('/experiments')}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs transition-colors flex items-center justify-center gap-2"
            >
              <TestTube2 className="w-4 h-4 text-emerald-400" />
              <span>Next-Best Experiment Roadmap</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
