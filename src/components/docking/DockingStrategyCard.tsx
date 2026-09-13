import React from 'react';
import { DockingStrategy } from '../../types';
import { Cpu, CheckCircle2, Copy, Layers, ShieldCheck, Sparkles } from 'lucide-react';

interface DockingStrategyCardProps {
  strategy: DockingStrategy;
  isSelected: boolean;
  onSelect: (strategy: DockingStrategy) => void;
}

const STRATEGY_DETAILS: Record<
  DockingStrategy,
  {
    title: string;
    subtitle: string;
    description: string;
    useCase: string;
    badge: string;
  }
> = {
  redocking: {
    title: 'Molecular Redocking',
    subtitle: 'Protocol Validation & Pose Reproduction',
    description:
      'Extracts the co-crystallized ligand from the target receptor and docks it back into the experimental binding cleft to validate scoring function accuracy and calculate RMSD.',
    useCase: 'Best for verifying that grid box settings reproduce the experimental crystal pose (< 2.0 Å RMSD).',
    badge: 'Validation Protocol',
  },
  cross_docking: {
    title: 'Cross-Docking',
    subtitle: 'Ensemble & Conformation Robustness',
    description:
      'Docks ligands into alternative receptor conformations, apo-structures, or AlphaFold predicted models to account for target conformational flexibility and induced-fit effects.',
    useCase: 'Best when evaluating multiple PDB crystal structures of the same target.',
    badge: 'Conformational Screen',
  },
  virtual_screening: {
    title: 'Focused Virtual Screening',
    subtitle: 'Target-Centric Library Screening',
    description:
      'Screens a curated library of small molecules or approved pharmacophores against a defined target binding pocket to identify top steric and electrostatic binders.',
    useCase: 'Best for screening larger libraries (>50 compounds) against an active site.',
    badge: 'Library Screening',
  },
  comparative_repurposing: {
    title: 'Comparative Repurposing Docking',
    subtitle: 'Cross-Target Drug Repurposing',
    description:
      'Systematically compares existing FDA-approved drugs against prioritized disease targets to identify repurposable off-target or mechanistic binding opportunities.',
    useCase: 'Recommended for InSilicoRepurposer disease-first and drug-first workflows.',
    badge: 'Repurposing Workflow',
  },
};

export const DockingStrategyCard: React.FC<DockingStrategyCardProps> = ({
  strategy,
  isSelected,
  onSelect,
}) => {
  const info = STRATEGY_DETAILS[strategy];

  return (
    <div
      onClick={() => onSelect(strategy)}
      className={`rounded-xl p-5 cursor-pointer transition-all border flex flex-col justify-between ${
        isSelected
          ? 'glass-panel-glow border-cyan-400/60'
          : 'glass-card border-slate-800 hover:border-slate-700'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
            {info.badge}
          </span>
          {isSelected && (
            <span className="flex items-center gap-1 text-xs font-mono text-cyan-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              ACTIVE
            </span>
          )}
        </div>

        <h4 className="text-sm font-bold font-mono text-slate-100">{info.title}</h4>
        <p className="text-xs text-cyan-300/80 font-mono mt-0.5">{info.subtitle}</p>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">{info.description}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
        <strong className="text-slate-300">Use Case:</strong> {info.useCase}
      </div>
    </div>
  );
};
