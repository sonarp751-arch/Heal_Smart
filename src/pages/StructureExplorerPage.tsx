import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Boxes,
  Cpu,
  Database,
  Dna,
  ExternalLink,
  Layers,
  RefreshCw,
  Search,
  Sparkles,
  TestTube,
} from 'lucide-react';
import { ProteinViewer3D } from '../components/structure/ProteinViewer3D';
import { PocketPanel } from '../components/structure/PocketPanel';
import { DEMO_POCKETS, DEMO_STRUCTURES } from '../data/demoStructures';
import { useResearchProject } from '../context/ResearchProjectContext';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';
import { BindingPocket, ProteinStructureEntity } from '../types';

export const StructureExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedTarget,
    selectedStructure,
    setSelectedStructure,
    selectedPocket,
    setSelectedPocket,
  } = useResearchProject();

  const [activeGene, setActiveGene] = useState<string>(selectedTarget?.geneSymbol || 'EGFR');
  const [pdbSearch, setPdbSearch] = useState<string>('');

  const currentStructure = selectedStructure || DEMO_STRUCTURES[activeGene] || DEMO_STRUCTURES.EGFR;
  const currentPockets = DEMO_POCKETS[activeGene] || DEMO_POCKETS.EGFR || [];

  const handleSelectPocket = (pkt: BindingPocket) => {
    setSelectedPocket(pkt);
  };

  const handleTargetChange = (gene: string) => {
    setActiveGene(gene);
    if (DEMO_STRUCTURES[gene]) {
      setSelectedStructure(DEMO_STRUCTURES[gene]);
    }
    if (DEMO_POCKETS[gene]) {
      setSelectedPocket(DEMO_POCKETS[gene][0]);
    }
  };

  return (
    <div className="space-y-6 py-4 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              STAGE 06 • 3D STRUCTURE & BINDING POCKETS
            </span>
            <ProvenanceBadge meta={currentStructure?.provenance} />
          </div>
          <h1 className="text-2xl font-bold font-mono text-slate-100 mt-1">
            Macromolecular 3D Structure & Pocket Preparation
          </h1>
          <p className="text-xs text-slate-300 font-sans max-w-2xl">
            Visualize experimentally resolved X-ray / Cryo-EM crystal structures (RCSB PDB) and AlphaFold models.
            Inspect active catalytic binding clefts, calculate Cartesian bounding coordinates, and prepare the receptor for docking.
          </p>
        </div>

        <button
          onClick={() => navigate('/docking')}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition-colors flex items-center gap-1.5 self-start md:self-auto shadow-lg shadow-cyan-500/20"
        >
          <span>Docking Planner</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Target & PDB Switcher Ribbon */}
      <div className="glass-panel rounded-xl p-3 border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold">Target Protein:</span>
          {['EGFR', 'PARP1', 'CDK4', 'HDAC1'].map((gene) => (
            <button
              key={gene}
              onClick={() => handleTargetChange(gene)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                activeGene === gene
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {gene}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span>PDB ID: <strong className="text-cyan-300">{currentStructure?.pdbId}</strong></span>
          <span>Method: <strong className="text-slate-200">{currentStructure?.experimentalMethod}</strong></span>
          {currentStructure?.resolution && <span>Resolution: <strong className="text-emerald-300">{currentStructure.resolution}</strong></span>}
        </div>
      </div>

      {/* Main 3Dmol.js Workspace and Pocket Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Real 3Dmol.js WebGL Viewer */}
        <div className="lg:col-span-7 space-y-4">
          <ProteinViewer3D
            structure={currentStructure}
            activePocket={selectedPocket}
            height="500px"
          />

          {/* Bound Ligand Information */}
          {currentStructure?.boundLigands && currentStructure.boundLigands.length > 0 && (
            <div className="p-4 rounded-xl glass-panel border border-slate-800 text-xs font-mono flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TestTube className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 font-bold">Co-crystallized Ligand:</span>
                <span className="text-emerald-300 font-semibold">{currentStructure.boundLigands[0].name}</span>
                <span className="text-slate-400">({currentStructure.boundLigands[0].id})</span>
              </div>
              <span className="text-slate-400">{currentStructure.boundLigands[0].formula}</span>
            </div>
          )}
        </div>

        {/* Right 5 Columns: Pocket Inspector and Grid Parameters */}
        <div className="lg:col-span-5 space-y-4">
          <PocketPanel
            pockets={currentPockets}
            selectedPocket={selectedPocket}
            onSelectPocket={handleSelectPocket}
          />
        </div>
      </div>
    </div>
  );
};
