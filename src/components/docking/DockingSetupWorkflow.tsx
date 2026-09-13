import React from 'react';
import { Boxes, Cpu, Dna, Layers, Pill, Sliders, Sparkles } from 'lucide-react';
import { BindingPocket, MoleculeEntity, ProteinStructureEntity, TargetEntity } from '../../types';
import { useResearchProject } from '../../context/ResearchProjectContext';

interface DockingSetupWorkflowProps {
  selectedTarget: TargetEntity | null;
  selectedStructure: ProteinStructureEntity | null;
  selectedPocket: BindingPocket | null;
  selectedMolecule: MoleculeEntity | null;
}

export const DockingSetupWorkflow: React.FC<DockingSetupWorkflowProps> = ({
  selectedTarget,
  selectedStructure,
  selectedPocket,
  selectedMolecule,
}) => {
  const { dockingConfig, updateDockingParams } = useResearchProject();

  const steps = [
    {
      id: 1,
      title: 'Target Selection',
      icon: Dna,
      val: selectedTarget ? `${selectedTarget.geneSymbol} (${selectedTarget.uniprotId})` : 'None',
      status: selectedTarget ? 'Complete' : 'Pending',
      color: 'text-cyan-400',
    },
    {
      id: 2,
      title: 'Receptor Structure',
      icon: Boxes,
      val: selectedStructure ? `PDB ${selectedStructure.pdbId} (${selectedStructure.resolution || 'AF2'})` : 'None',
      status: selectedStructure ? 'Complete' : 'Pending',
      color: 'text-emerald-400',
    },
    {
      id: 3,
      title: 'Binding Pocket & Grid',
      icon: Layers,
      val: selectedPocket ? selectedPocket.pocketName : 'None',
      status: selectedPocket ? 'Complete' : 'Pending',
      color: 'text-amber-400',
    },
    {
      id: 4,
      title: 'Candidate Ligand',
      icon: Pill,
      val: selectedMolecule ? selectedMolecule.name : 'None',
      status: selectedMolecule ? 'Complete' : 'Pending',
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="glass-panel rounded-xl p-5 border-slate-800 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold font-mono text-slate-100 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          Docking Protocol Setup & Parameterization
        </h3>
        <span className="text-xs font-mono text-emerald-400 font-semibold">4 / 4 Stages Defined</span>
      </div>

      {/* 4 Pipeline Milestones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((st) => {
          const Icon = st.icon;
          return (
            <div key={st.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Step 0{st.id}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {st.status}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono font-bold text-xs text-slate-200">
                <Icon className={`w-3.5 h-3.5 ${st.color}`} />
                <span>{st.title}</span>
              </div>
              <div className="text-xs font-mono text-slate-300 truncate">{st.val}</div>
            </div>
          );
        })}
      </div>

      {/* Search Parameters Form */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Vina Search & Sampling Parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Exhaustiveness:</span>
              <strong className="text-cyan-300">{dockingConfig?.exhaustiveness || 16}</strong>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              step="4"
              value={dockingConfig?.exhaustiveness || 16}
              onChange={(e) => updateDockingParams({ exhaustiveness: parseInt(e.target.value, 10) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Higher values increase global conformational search depth</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Energy Range (kcal/mol):</span>
              <strong className="text-emerald-300">{dockingConfig?.energyRange || 3.0}</strong>
            </div>
            <input
              type="range"
              min="1.0"
              max="6.0"
              step="0.5"
              value={dockingConfig?.energyRange || 3.0}
              onChange={(e) => updateDockingParams({ energyRange: parseFloat(e.target.value) })}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Max energy difference from top pose to output</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Number of Modes / Poses:</span>
              <strong className="text-purple-300">{dockingConfig?.numPoses || 9}</strong>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={dockingConfig?.numPoses || 9}
              onChange={(e) => updateDockingParams({ numPoses: parseInt(e.target.value, 10) })}
              className="w-full accent-purple-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Output binding poses ranked by predicted score</span>
          </div>
        </div>
      </div>
    </div>
  );
};
