import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Atom,
  CheckCircle2,
  Compass,
  Cpu,
  Dna,
  ExternalLink,
  Layers,
  Pill,
  Search,
  Sparkles,
  TestTube,
} from 'lucide-react';
import { DEMO_MOLECULES, DEMO_REPURPOSING_HYPOTHESES } from '../data/demoDrugs';
import { MoleculeCard } from '../components/molecule/MoleculeCard';
import { useResearchProject } from '../context/ResearchProjectContext';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';

export const DrugFirstRepurposingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedMolecule, selectedMolecule } = useResearchProject();
  const [activeDrug, setActiveDrug] = useState(selectedMolecule || DEMO_MOLECULES[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const hypotheses = DEMO_REPURPOSING_HYPOTHESES.filter((h) => h.drugId === activeDrug?.id);

  const handleSelectDrug = (drug: any) => {
    setActiveDrug(drug);
    setSelectedMolecule(drug);
  };

  return (
    <div className="space-y-6 py-4 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
              DRUG-FIRST REPURPOSING ENGINE
            </span>
            <ProvenanceBadge meta={activeDrug?.provenance} />
          </div>
          <h1 className="text-2xl font-bold font-mono text-slate-100 mt-1">
            Drug → Targets → Pathways → Alternative Diseases
          </h1>
          <p className="text-xs text-slate-300 font-sans max-w-2xl">
            Query existing approved drugs or clinical assets to systematically discover new disease indications,
            off-target mechanistic vulnerabilities, and structural docking readiness.
          </p>
        </div>

        <button
          onClick={() => navigate('/docking')}
          className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold font-mono text-xs transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <span>Dock Drug Candidate</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Drug Selection Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
          Select Candidate Drug Asset
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEMO_MOLECULES.map((mol) => {
            const isSelected = activeDrug?.id === mol.id;
            return (
              <MoleculeCard
                key={mol.id}
                molecule={mol}
                isSelected={isSelected}
                onSelect={handleSelectDrug}
              />
            );
          })}
        </div>
      </div>

      {/* Repurposing Evidence Breakdown for Selected Drug */}
      {activeDrug && (
        <div className="glass-panel-glow rounded-2xl p-6 border-purple-500/30 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  REPURPOSING DOSSIER
                </span>
                <span className="text-xs font-mono text-slate-400">{activeDrug.id}</span>
              </div>
              <h3 className="text-xl font-bold font-mono text-slate-100 mt-1">
                {activeDrug.name} ({activeDrug.genericName})
              </h3>
            </div>

            <div className="text-right text-xs font-mono text-slate-400">
              <div>Primary Indication: <strong className="text-slate-200">{activeDrug.originalIndications.join(', ')}</strong></div>
              <div>Primary Targets: <strong className="text-cyan-300">{activeDrug.primaryTargets.join(', ')}</strong></div>
            </div>
          </div>

          {/* Repurposing Hypotheses */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Computational Repurposing Hypotheses
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hypotheses.map((hyp) => (
                <div key={hyp.targetGene} className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-base font-bold text-slate-100">Target: {hyp.targetGene}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                          {hyp.structuralReadiness}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">UniProt: {hyp.targetUniprot}</p>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-[10px] text-slate-400 block">Fit Score</span>
                      <span className="text-lg font-bold text-purple-300">{hyp.repurposingScore.toFixed(1)} / 100</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {hyp.hypothesisRationale}
                  </p>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-400">
                    <strong className="text-slate-200">Clinical Precedent:</strong> {hyp.clinicalPrecedent}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Evidence: {hyp.evidenceType}</span>
                    <button
                      onClick={() => navigate('/docking')}
                      className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
                    >
                      Configure Docking <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
