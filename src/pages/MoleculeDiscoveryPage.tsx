import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Atom,
  CheckCircle2,
  ExternalLink,
  Filter,
  Pill,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react';
import { DEMO_MOLECULES } from '../data/demoDrugs';
import { MoleculeCard } from '../components/molecule/MoleculeCard';
import { useResearchProject } from '../context/ResearchProjectContext';
import { fetchPubChemCompound } from '../services/pubchemService';
import { MoleculeEntity } from '../types';

export const MoleculeDiscoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedMolecule, setSelectedMolecule } = useResearchProject();
  const [molecules, setMolecules] = useState<MoleculeEntity[]>(DEMO_MOLECULES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [searchMsg, setSearchMsg] = useState<string | null>(null);

  const handleLiveSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearchingLive(true);
    setSearchMsg(null);

    const liveResult = await fetchPubChemCompound(searchTerm.trim());
    if (liveResult) {
      setMolecules([liveResult, ...molecules.filter((m) => m.name !== liveResult.name)]);
      setSelectedMolecule(liveResult);
      setSearchMsg(`Found live PubChem compound: ${liveResult.name} (CID: ${liveResult.id})`);
    } else {
      setSearchMsg(`No PubChem entry found for "${searchTerm}". Showing local candidate database.`);
    }
    setIsSearchingLive(false);
  };

  const handleSelect = (mol: MoleculeEntity) => {
    setSelectedMolecule(mol);
  };

  return (
    <div className="space-y-6 py-4 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            STAGE 08 • MOLECULE DISCOVERY & CHEMINFORMATICS
          </span>
          <h1 className="text-2xl font-bold font-mono text-slate-100 mt-1">
            Chemical Intelligence & Pharmacophore Space
          </h1>
          <p className="text-xs text-slate-300 font-sans max-w-2xl">
            Query small-molecule libraries, calculate Lipinski Rule of 5 descriptors (MW, cLogP, TPSA, HBD, HBA, RotB),
            and retrieve real PubChem / ChEMBL structures.
          </p>
        </div>

        <button
          onClick={() => navigate('/optimization')}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <span>Analogue Optimization</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* PubChem Live Query Search Bar */}
      <form onSubmit={handleLiveSearch} className="glass-panel rounded-xl p-4 border-slate-800 flex items-center gap-3">
        <Search className="w-5 h-5 text-cyan-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search compound name or SMILES (e.g. Erlotinib, Olaparib, Gefitinib, Imatinib)..."
          className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 font-mono focus:outline-none"
        />
        <button
          type="submit"
          disabled={isSearchingLive}
          className="px-4 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSearchingLive ? 'animate-spin' : ''}`} />
          <span>PubChem Search</span>
        </button>
      </form>

      {searchMsg && (
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
          {searchMsg}
        </div>
      )}

      {/* Molecule Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
          Pharmacological Small-Molecule Assets ({molecules.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {molecules.map((mol) => (
            <MoleculeCard
              key={mol.id}
              molecule={mol}
              isSelected={selectedMolecule?.id === mol.id}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
