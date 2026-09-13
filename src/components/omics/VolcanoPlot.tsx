import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts';
import { DifferentialGene } from '../../types';
import { Sliders, Filter } from 'lucide-react';

interface VolcanoPlotProps {
  degs: DifferentialGene[];
  onSelectGene?: (gene: DifferentialGene) => void;
  selectedGeneSymbol?: string;
}

export const VolcanoPlot: React.FC<VolcanoPlotProps> = ({
  degs,
  onSelectGene,
  selectedGeneSymbol,
}) => {
  const [log2FcCutoff, setLog2FcCutoff] = useState<number>(1.5);
  const [fdrCutoff, setFdrCutoff] = useState<number>(0.01);

  // Transform data for Volcano plot (-log10 p-value)
  const plotData = useMemo(() => {
    return degs.map((d) => {
      const pval = Math.max(d.pvalue, 1e-30);
      const negLogPval = -Math.log10(pval);
      const isUp = d.log2FoldChange >= log2FcCutoff && d.padj <= fdrCutoff;
      const isDown = d.log2FoldChange <= -log2FcCutoff && d.padj <= fdrCutoff;

      let status: 'UP' | 'DOWN' | 'NS' = 'NS';
      if (isUp) status = 'UP';
      if (isDown) status = 'DOWN';

      return {
        ...d,
        x: d.log2FoldChange,
        y: negLogPval,
        status,
      };
    });
  }, [degs, log2FcCutoff, fdrCutoff]);

  const upCount = plotData.filter((d) => d.status === 'UP').length;
  const downCount = plotData.filter((d) => d.status === 'DOWN').length;
  const nsCount = plotData.filter((d) => d.status === 'NS').length;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: any = payload[0].payload;
      return (
        <div className="glass-panel p-3 rounded-lg border border-slate-700 text-xs font-mono shadow-xl space-y-1">
          <div className="font-bold text-slate-100 flex items-center justify-between gap-4">
            <span className="text-cyan-300 text-sm">{data.geneSymbol}</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] ${
                data.status === 'UP'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : data.status === 'DOWN'
                  ? 'bg-rose-500/20 text-rose-300'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {data.status}
            </span>
          </div>
          <div className="text-slate-300">
            Log2FC: <strong className="text-slate-100">{data.log2FoldChange.toFixed(2)}</strong>
          </div>
          <div className="text-slate-300">
            Adj. p-value: <strong className="text-slate-100">{data.padj.toExponential(2)}</strong>
          </div>
          <div className="text-slate-400 text-[11px] truncate max-w-[200px]">
            {data.druggabilityClass || 'Gene record'}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-xl p-5 border-slate-800 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold font-mono text-slate-100 flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-400" />
            Transcriptomic Volcano Plot (Differential Expression)
          </h3>
          <p className="text-xs text-slate-400">
            Statistical significance (-log₁₀ p-val) vs Magnitude of change (log₂ fold change)
          </p>
        </div>

        {/* Dynamic Filters */}
        <div className="flex items-center gap-3 text-xs font-mono bg-slate-900/90 p-2 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">|log₂FC|:</span>
            <input
              type="number"
              step="0.1"
              min="0.5"
              max="5.0"
              value={log2FcCutoff}
              onChange={(e) => setLog2FcCutoff(parseFloat(e.target.value) || 1.0)}
              className="w-14 bg-slate-950 border border-slate-700 rounded px-1 py-0.5 text-center text-cyan-300"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">FDR:</span>
            <select
              value={fdrCutoff}
              onChange={(e) => setFdrCutoff(parseFloat(e.target.value))}
              className="bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-emerald-300"
            >
              <option value={0.05}>&lt; 0.05</option>
              <option value={0.01}>&lt; 0.01</option>
              <option value={0.001}>&lt; 0.001</option>
            </select>
          </div>
        </div>
      </div>

      {/* Legend & Stats Pills */}
      <div className="flex items-center gap-4 text-xs font-mono pt-1">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          Upregulated: <strong>{upCount}</strong>
        </span>
        <span className="flex items-center gap-1.5 text-rose-400">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
          Downregulated: <strong>{downCount}</strong>
        </span>
        <span className="flex items-center gap-1.5 text-slate-500">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
          Not Significant: <strong>{nsCount}</strong>
        </span>
      </div>

      {/* Recharts Scatter Chart */}
      <div className="w-full h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <XAxis
              type="number"
              dataKey="x"
              name="log2FC"
              unit=""
              domain={[-5, 5]}
              stroke="#64748B"
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              label={{ value: 'log₂ Fold Change (Case vs Control)', position: 'insideBottom', offset: -10, fill: '#64748B', fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="-log10(p)"
              domain={[0, 30]}
              stroke="#64748B"
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              label={{ value: '-log₁₀ (p-value)', angle: -90, position: 'insideLeft', fill: '#64748B', fontSize: 11 }}
            />
            <ZAxis range={[60, 60]} />
            <Tooltip content={<CustomTooltip />} />
            
            <ReferenceLine x={log2FcCutoff} stroke="#334155" strokeDasharray="3 3" />
            <ReferenceLine x={-log2FcCutoff} stroke="#334155" strokeDasharray="3 3" />
            <ReferenceLine y={-Math.log10(fdrCutoff)} stroke="#334155" strokeDasharray="3 3" />

            <Scatter
              data={plotData}
              onClick={(e: any) => onSelectGene && onSelectGene(e.payload)}
              cursor="pointer"
            >
              {plotData.map((entry, index) => {
                let color = '#475569';
                if (entry.status === 'UP') color = '#10B981';
                if (entry.status === 'DOWN') color = '#F43F5E';
                if (entry.geneSymbol === selectedGeneSymbol) color = '#22D3EE';

                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={color}
                    stroke={entry.geneSymbol === selectedGeneSymbol ? '#FFFFFF' : 'transparent'}
                    strokeWidth={1.5}
                    opacity={entry.status === 'NS' ? 0.35 : 0.9}
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
