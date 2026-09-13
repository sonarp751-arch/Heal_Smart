import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Dna,
  FileCheck2,
  Pill,
  ShieldAlert,
  Sparkles,
  TestTube2,
} from 'lucide-react';
import { DEMO_NEXT_EXPERIMENTS } from '../data/demoDrugs';
import { useResearchProject } from '../context/ResearchProjectContext';

export const NextBestExperimentPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedTarget, selectedMolecule } = useResearchProject();

  return (
    <div className="space-y-6 py-4 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            STAGE 12 • NEXT-BEST EXPERIMENT
          </span>
          <h1 className="text-2xl font-bold font-mono text-slate-100 mt-1">
            Preclinical Experimental Decision Roadmap
          </h1>
          <p className="text-xs text-slate-300 font-sans max-w-2xl">
            Structured decision roadmap outlining recommended wet-lab and biophysical assays to validate
            computational repurposing hypotheses (SPR binding kinetics, 3D neurosphere synergy, BBB permeability).
          </p>
        </div>

        <button
          onClick={() => navigate('/report')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 text-slate-950 font-bold font-mono text-xs transition-colors flex items-center gap-1.5 self-start md:self-auto shadow-lg shadow-cyan-500/20"
        >
          <span>Compile Research Dossier</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mandatory Research Label Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs font-mono text-amber-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
        <div>
          <strong className="text-amber-300 block mb-0.5">RESEARCH EXPERIMENTAL RECOMMENDATIONS</strong>
          <span>
            These recommendations represent computational biological hypotheses intended for preclinical wet-lab protocol design.
            They do <strong>not constitute clinical treatment recommendations or medical advice</strong>.
          </span>
        </div>
      </div>

      {/* Tiered Experiments Cards Grid */}
      <div className="space-y-4">
        {DEMO_NEXT_EXPERIMENTS.map((exp, idx) => {
          const isTier1 = exp.priority.includes('Tier 1');
          const isTier2 = exp.priority.includes('Tier 2');

          return (
            <div
              key={idx}
              className={`glass-panel rounded-2xl p-6 border space-y-4 transition-all ${
                isTier1 ? 'border-cyan-500/40 bg-slate-900/60' : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                      isTier1
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : isTier2
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {exp.priority}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                    {exp.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Estimated Turnaround: <strong className="text-slate-200">{exp.estimatedTurnaround}</strong></span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold font-mono text-slate-100">{exp.title}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{exp.methodology}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-sans text-slate-300">
                <div className="font-mono text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                  Recommended Experimental Protocol:
                </div>
                <p className="leading-relaxed">{exp.recommendedAssay}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Expected Readout</span>
                  <strong className="text-cyan-300">{exp.expectedReadout}</strong>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Success Benchmark</span>
                  <strong className="text-emerald-300">{exp.successCriteria}</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2">
                <span>
                  Candidate Molecules: <strong className="text-slate-200">{exp.candidateMolecules.join(', ')}</strong>
                </span>
                <span className="text-slate-500 text-[11px]">{exp.disclaimer}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
