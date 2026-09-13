import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Database,
  Dna,
  ExternalLink,
  GitFork,
  Pill,
  Search,
  Sparkles,
} from 'lucide-react';
import { DEMO_DISEASES } from '../data/demoDiseases';
import { useResearchProject } from '../context/ResearchProjectContext';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';

export const DiseaseDiscoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const { disease, setDisease, loadDemoProject } = useResearchProject();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDiseases = DEMO_DISEASES.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.therapeuticArea.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (d: any) => {
    setDisease(d);
    loadDemoProject(d.name.includes('Glioblastoma') ? 'GBM' : d.name);
  };

  return (
    <div className="space-y-6 py-4 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              STAGE 01 • DISEASE DISCOVERY
            </span>
            <ProvenanceBadge meta={disease?.provenance} />
          </div>
          <h1 className="text-2xl font-bold font-mono text-slate-100 mt-1">
            Disease Ontology & Clinical Associations
          </h1>
          <p className="text-xs text-slate-300 font-sans max-w-2xl">
            Input a disease, phenotype, or ontology term (EFO / MONDO / ICD-11) to discover associated genes,
            mechanistic targets, dysregulated pathways, and existing pharmacotherapies.
          </p>
        </div>

        <button
          onClick={() => navigate('/omics')}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <span>Proceed to Omics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="glass-panel rounded-xl p-4 border-slate-800 flex items-center gap-3">
        <Search className="w-5 h-5 text-cyan-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search disease by name (e.g. Glioblastoma, Alzheimer's, IPF), EFO ID, or therapeutic area..."
          className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 font-mono focus:outline-none"
        />
      </div>

      {/* Active Disease Card */}
      {disease && (
        <div className="glass-panel-glow rounded-2xl p-6 border-cyan-500/40 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  CURRENTLY ACTIVE COHORT
                </span>
                <span className="text-xs font-mono text-slate-400">{disease.id}</span>
                <span className="text-xs font-mono text-emerald-400">{disease.ontology}</span>
              </div>
              <h2 className="text-2xl font-bold font-mono text-slate-100">{disease.name}</h2>
              <p className="text-xs text-slate-300 font-mono">{disease.therapeuticArea}</p>
            </div>

            <div className="text-right text-xs font-mono text-slate-400">
              <div>Approved Therapeutics: <strong className="text-emerald-300">{disease.approvedDrugsCount}</strong></div>
              <div>Clinical Trials: <strong className="text-cyan-300">{disease.clinicalTrialsCount}</strong></div>
            </div>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed font-sans">{disease.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Associated Genes</span>
              <strong className="text-base text-cyan-300">{disease.associatedGenesCount}</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Known Targets</span>
              <strong className="text-base text-emerald-300">{disease.knownTargetsCount}</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Active Trials</span>
              <strong className="text-base text-purple-300">{disease.clinicalTrialsCount}</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Approved Drugs</span>
              <strong className="text-base text-amber-300">{disease.approvedDrugsCount}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Disease Cohort Selection Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold font-mono text-slate-200 uppercase tracking-wider">
          Curated Disease Database Records ({filteredDiseases.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDiseases.map((d) => {
            const isActive = disease?.id === d.id;
            return (
              <div
                key={d.id}
                onClick={() => handleSelect(d)}
                className={`p-5 rounded-xl cursor-pointer transition-all border flex flex-col justify-between ${
                  isActive
                    ? 'glass-panel-glow border-cyan-400/60'
                    : 'glass-panel border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                    <span className="text-cyan-400 font-bold">{d.id}</span>
                    <span>{d.therapeuticArea}</span>
                  </div>
                  <h4 className="text-base font-bold font-mono text-slate-100">{d.name}</h4>
                  <p className="text-xs text-slate-300 mt-2 font-sans line-clamp-2 leading-relaxed">
                    {d.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">
                    Genes: <strong className="text-slate-200">{d.associatedGenesCount}</strong> • Targets: <strong className="text-slate-200">{d.knownTargetsCount}</strong>
                  </span>
                  <button className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1">
                    {isActive ? 'Active Cohort' : 'Select Cohort'} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
