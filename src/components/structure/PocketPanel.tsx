import React from 'react';
import { Box, Check, Compass, Edit3, Layers, Sparkles, TestTube } from 'lucide-react';
import { BindingPocket } from '../../types';
import { useResearchProject } from '../../context/ResearchProjectContext';

interface PocketPanelProps {
  pockets: BindingPocket[];
  selectedPocket: BindingPocket | null;
  onSelectPocket: (pocket: BindingPocket) => void;
}

export const PocketPanel: React.FC<PocketPanelProps> = ({
  pockets,
  selectedPocket,
  onSelectPocket,
}) => {
  const { updateDockingGrid } = useResearchProject();

  const handleCoordinateChange = (
    axis: 'x' | 'y' | 'z',
    val: number,
    isCenter: boolean = true
  ) => {
    if (!selectedPocket) return;
    const newCenter = { ...selectedPocket.centerCoords };
    const newSize = { ...selectedPocket.boxDimensions };

    if (isCenter) {
      newCenter[axis] = val;
    } else {
      if (axis === 'x') newSize.sizeX = val;
      if (axis === 'y') newSize.sizeY = val;
      if (axis === 'z') newSize.sizeZ = val;
    }

    updateDockingGrid(newCenter, newSize);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold font-mono text-slate-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          Binding Pockets & Catalytic Clefts ({pockets.length})
        </h3>
        <span className="text-xs font-mono text-slate-400">Cartesian Coordinates (Å)</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {pockets.map((pkt) => {
          const isSelected = selectedPocket?.pocketId === pkt.pocketId;

          return (
            <div
              key={pkt.pocketId}
              onClick={() => onSelectPocket(pkt)}
              className={`p-4 rounded-xl cursor-pointer transition-all border ${
                isSelected
                  ? 'glass-panel-glow border-cyan-400/60'
                  : 'glass-card border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-slate-100">{pkt.pocketName}</span>
                    {pkt.isExperimental ? (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <TestTube className="w-3 h-3" />
                        EXP CO-CRYSTAL
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        PREDICTED ({pkt.predictionMethod || 'DoGSite'})
                      </span>
                    )}
                  </div>
                  {pkt.knownLigandInPocket && (
                    <div className="text-xs text-slate-400 mt-1">
                      Co-crystallized Ligand: <span className="text-amber-300 font-mono">{pkt.knownLigandInPocket}</span>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono text-slate-400">Druggability</div>
                  <div className="text-sm font-bold font-mono text-cyan-300">
                    {(pkt.druggabilityScore * 100).toFixed(0)} / 100
                  </div>
                </div>
              </div>

              {/* Volume & Key Residues */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-3 font-mono text-slate-400">
                  <span>Volume: <strong className="text-slate-200">{pkt.volumeA3} Å³</strong></span>
                  <span>Polarity: <strong className="text-slate-200">{pkt.surfacePolarity}</strong></span>
                </div>

                <div className="flex items-center gap-1 flex-wrap">
                  {pkt.keyResidues.slice(0, 5).map((res) => (
                    <span
                      key={res}
                      className="px-1.5 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-slate-300 border border-slate-800"
                    >
                      {res}
                    </span>
                  ))}
                  {pkt.keyResidues.length > 5 && (
                    <span className="text-[10px] font-mono text-slate-400">
                      +{pkt.keyResidues.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              {/* Selected Pocket Grid Adjustment Form */}
              {isSelected && (
                <div
                  className="mt-3 pt-3 border-t border-cyan-500/20 grid grid-cols-2 gap-3 text-xs font-mono"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-1">
                    <span className="text-slate-400 text-[11px] block">Grid Box Center (x, y, z):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.1"
                        value={pkt.centerCoords.x}
                        onChange={(e) => handleCoordinateChange('x', parseFloat(e.target.value) || 0, true)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-1.5 py-1 text-cyan-300 text-center text-xs"
                      />
                      <input
                        type="number"
                        step="0.1"
                        value={pkt.centerCoords.y}
                        onChange={(e) => handleCoordinateChange('y', parseFloat(e.target.value) || 0, true)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-1.5 py-1 text-cyan-300 text-center text-xs"
                      />
                      <input
                        type="number"
                        step="0.1"
                        value={pkt.centerCoords.z}
                        onChange={(e) => handleCoordinateChange('z', parseFloat(e.target.value) || 0, true)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-1.5 py-1 text-cyan-300 text-center text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 text-[11px] block">Search Box Size (Å):</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="1"
                        value={pkt.boxDimensions.sizeX}
                        onChange={(e) => handleCoordinateChange('x', parseFloat(e.target.value) || 10, false)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-1.5 py-1 text-emerald-300 text-center text-xs"
                      />
                      <input
                        type="number"
                        step="1"
                        value={pkt.boxDimensions.sizeY}
                        onChange={(e) => handleCoordinateChange('y', parseFloat(e.target.value) || 10, false)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-1.5 py-1 text-emerald-300 text-center text-xs"
                      />
                      <input
                        type="number"
                        step="1"
                        value={pkt.boxDimensions.sizeZ}
                        onChange={(e) => handleCoordinateChange('z', parseFloat(e.target.value) || 10, false)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-1.5 py-1 text-emerald-300 text-center text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
