import React from 'react';
import { MoleculeEntity } from '../../types';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { Atom, CheckCircle2, Copy, ExternalLink, Pill, ShieldAlert, Sparkles } from 'lucide-react';

interface MoleculeCardProps {
  molecule: MoleculeEntity;
  isSelected?: boolean;
  onSelect?: (molecule: MoleculeEntity) => void;
}

export const MoleculeCard: React.FC<MoleculeCardProps> = ({
  molecule,
  isSelected = false,
  onSelect,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopySmiles = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(molecule.smiles);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={() => onSelect && onSelect(molecule)}
      className={`rounded-xl p-5 cursor-pointer transition-all border flex flex-col justify-between ${
        isSelected
          ? 'glass-panel-glow border-cyan-400/60'
          : 'glass-card border-slate-800 hover:border-slate-700'
      }`}
    >
      <div>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold font-mono text-slate-100">{molecule.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {molecule.highestDevelopmentPhase}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">{molecule.id} • {molecule.availability}</p>
          </div>

          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
            <Pill className="w-5 h-5" />
          </div>
        </div>

        {/* Mechanism of Action */}
        <p className="text-xs text-slate-300 mt-2.5 leading-relaxed font-medium">
          {molecule.mechanismOfAction}
        </p>

        {/* SMILES with Quick Copy */}
        <div className="mt-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-2 text-xs font-mono">
          <span className="text-slate-400 truncate max-w-[220px]" title={molecule.smiles}>
            {molecule.smiles}
          </span>
          <button
            onClick={handleCopySmiles}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors flex-shrink-0"
            title="Copy SMILES string"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Physicochemical & Lipinski Properties Grid */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">MW (g/mol)</span>
            <span className="font-bold text-slate-200">{molecule.molecularWeight.toFixed(1)}</span>
          </div>
          <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">cLogP</span>
            <span className="font-bold text-cyan-300">{molecule.logP.toFixed(2)}</span>
          </div>
          <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">TPSA (Å²)</span>
            <span className="font-bold text-emerald-300">{molecule.tpsa.toFixed(1)}</span>
          </div>
        </div>

        {/* Rule of 5 and Primary Targets */}
        <div className="mt-2.5 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">
            HBD/HBA/RotB: <strong className="text-slate-200">{molecule.hBondDonors}/{molecule.hBondAcceptors}/{molecule.rotatableBonds}</strong>
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] ${
              molecule.lipinskiRuleViolations === 0
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
            }`}
          >
            Ro5: {molecule.lipinskiRuleViolations === 0 ? 'Passed' : `${molecule.lipinskiRuleViolations} Violations`}
          </span>
        </div>
      </div>

      {/* Footer Provenance */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400 truncate max-w-[150px]">
          Orig: {molecule.originalIndications.join(', ')}
        </span>
        <ProvenanceBadge meta={molecule.provenance} />
      </div>
    </div>
  );
};

export const AnalogueHypothesisExplorer: React.FC<{
  analogues: any[];
  parentDrugName: string;
}> = ({ analogues, parentDrugName }) => {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs font-mono text-amber-200 flex items-start gap-2.5">
        <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
        <div>
          <strong className="text-amber-300 block mb-0.5">COMPUTATIONAL ANALOGUE HYPOTHESES</strong>
          <span>
            These molecular modifications are in silico design hypotheses for exploration (e.g. bioisosteric substitution,
            scaffold hopping, polarity tuning). They are <strong>not approved drugs or validated therapeutics</strong>.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analogues.map((an) => (
          <div key={an.analogueId} className="glass-panel rounded-xl p-5 border-slate-800 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold font-mono text-slate-100">{an.analogueId}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    {an.modificationType}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-400 mt-0.5">Parent: {parentDrugName}</div>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Fit: {an.predictedTargetCompatibility}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">{an.rationale}</p>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 truncate">
              SMILES: <span className="text-cyan-300">{an.smiles}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">MW</span>
                <span className="font-bold text-slate-200">{an.molecularWeight.toFixed(1)}</span>
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">cLogP</span>
                <span className="font-bold text-cyan-300">{an.logP.toFixed(2)}</span>
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">TPSA</span>
                <span className="font-bold text-emerald-300">{an.tpsa.toFixed(1)} Å²</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
