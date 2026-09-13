import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Cpu,
  Download,
  Layers,
  Pill,
  Server,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { DockingStrategyCard } from '../components/docking/DockingStrategyCard';
import { DockingSetupWorkflow } from '../components/docking/DockingSetupWorkflow';
import { DockingStatusPanel } from '../components/docking/DockingStatusPanel';
import { useResearchProject } from '../context/ResearchProjectContext';
import { DockingStrategy } from '../types';

export const DockingPlannerPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeDockingStrategy,
    setActiveDockingStrategy,
    selectedTarget,
    selectedStructure,
    selectedPocket,
    selectedMolecule,
    dockingConfig,
  } = useResearchProject();

  const strategies: DockingStrategy[] = [
    'comparative_repurposing',
    'redocking',
    'cross_docking',
    'virtual_screening',
  ];

  return (
    <div className="space-y-6 py-4 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              STAGE 07 • DOCKING PLANNER
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              AutoDock Vina Specification
            </span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-slate-100 mt-1">
            Molecular Docking Strategy & Protocol Planner
          </h1>
          <p className="text-xs text-slate-300 font-sans max-w-2xl">
            Configure target receptor preparation, define binding grid search space dimensions, parameterize
            exhaustiveness, and export executable Vina configuration files and shell runners.
          </p>
        </div>

        <button
          onClick={() => navigate('/repurposing')}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition-colors flex items-center gap-1.5 self-start md:self-auto shadow-lg shadow-cyan-500/20"
        >
          <span>Drug Repurposing Matrix</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Docking Strategies */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
          Select Docking Strategy & Methodology
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {strategies.map((st) => (
            <DockingStrategyCard
              key={st}
              strategy={st}
              isSelected={activeDockingStrategy === st}
              onSelect={setActiveDockingStrategy}
            />
          ))}
        </div>
      </div>

      {/* Pipeline Setup & Parameter Configuration */}
      <DockingSetupWorkflow
        selectedTarget={selectedTarget}
        selectedStructure={selectedStructure}
        selectedPocket={selectedPocket}
        selectedMolecule={selectedMolecule}
      />

      {/* Execution Status & Script Exporter */}
      <DockingStatusPanel config={dockingConfig} />
    </div>
  );
};
