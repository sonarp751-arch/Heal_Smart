import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Database,
  ExternalLink,
  Pill,
  ShieldCheck,
  Sparkles,
  TestTube,
} from 'lucide-react';
import { DEMO_ADMET_PROFILES } from '../data/demoDrugs';
import { useResearchProject } from '../context/ResearchProjectContext';

export const AdmetWorkspacePage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedMolecule } = useResearchProject();

  const drugKey = selectedMolecule?.id && DEMO_ADMET_PROFILES[selectedMolecule.id]
    ? selectedMolecule.id
    : 'CHEMBL482';

  const admet = DEMO_ADMET_PROFILES[drugKey] || DEMO_ADMET_PROFILES.CHEMBL482;

  const categories = ['Absorption', 'Distribution', 'Metabolism', 'Excretion', 'Toxicity'] as const;

  return (
    <div className="space-y-6 py-4 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            STAGE 10 • ADMET PROFILING
          </span>
          <h1 className="text-2xl font-bold font-mono text-slate-100 mt-1">
            Absorption, Distribution, Metabolism, Excretion & Toxicity
          </h1>
          <p className="text-xs text-slate-300 font-sans max-w-2xl">
            Evaluate drug-likeness and pharmacokinetic parameters. Explicitly labels experimental data (ChEMBL),
            curated database records (DrugBank), and QSAR in silico predictions.
          </p>
        </div>

        <button
          onClick={() => navigate('/literature')}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <span>Literature Intelligence</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ADMET Radar Metrics Summary */}
      <div className="glass-panel-glow rounded-2xl p-6 border-cyan-500/30 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold font-mono text-slate-100">{admet.drugName}</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              {admet.drugId}
            </span>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">Favorable Drug-Likeness Profile</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Lipophilicity</span>
            <span className="text-base font-bold text-cyan-300">{admet.radarMetrics.lipophilicity}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Solubility</span>
            <span className="text-base font-bold text-emerald-300">{admet.radarMetrics.solubility}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Permeability</span>
            <span className="text-base font-bold text-purple-300">{admet.radarMetrics.permeability}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Metabolic Stab</span>
            <span className="text-base font-bold text-amber-300">{admet.radarMetrics.metabolicStability}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Safety Margin</span>
            <span className="text-base font-bold text-blue-300">{admet.radarMetrics.safetyMargin}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Bioavailability</span>
            <span className="text-base font-bold text-teal-300">{admet.radarMetrics.bioavailability}%</span>
          </div>
        </div>
      </div>

      {/* Categorized Detailed ADMET Table */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-6">
        <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          Detailed Pharmacokinetic & Toxicological Assays
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="p-3">Category</th>
                <th className="p-3">Property / Parameter</th>
                <th className="p-3">Experimental / Predicted Value</th>
                <th className="p-3">Interpretation</th>
                <th className="p-3">Evidence Source & Provenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {admet.properties.map((prop, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-cyan-400">{prop.category}</td>
                  <td className="p-3 font-semibold text-slate-200">{prop.property}</td>
                  <td className="p-3 font-bold text-slate-100">{prop.value}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        prop.interpretation === 'Favorable'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : prop.interpretation === 'Unfavorable'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {prop.interpretation}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 text-[11px]">{prop.dataSource}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
