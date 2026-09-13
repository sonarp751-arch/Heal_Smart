import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Atom,
  CheckCircle2,
  Copy,
  Layers,
  Pill,
  ShieldAlert,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { DEMO_ANALOGUES } from '../data/demoDrugs';
import { AnalogueHypothesisExplorer } from '../components/molecule/MoleculeCard';
import { useResearchProject } from '../context/ResearchProjectContext';

export const MolecularOptimizationPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedMolecule } = useResearchProject();

  const parentName = selectedMolecule?.name || 'Erlotinib';

  return (
    <div className="space-y-6 py-4 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            STAGE 09 • MOLECULAR OPTIMIZATION
          </span>
          <h1 className="text-2xl font-bold font-mono text-slate-100 mt-1">
            Computational Analogue Design & Scaffold Exploration
          </h1>
          <p className="text-xs text-slate-300 font-sans max-w-2xl">
            Explore computational analogue hypotheses generated through bioisosteric replacement, scaffold hopping,
            and polarity tuning to optimize target engagement and pharmacokinetic properties.
          </p>
        </div>

        <button
          onClick={() => navigate('/admet')}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <span>ADMET Profiling</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Analogue Explorer Component */}
      <AnalogueHypothesisExplorer
        analogues={DEMO_ANALOGUES}
        parentDrugName={parentName}
      />
    </div>
  );
};
