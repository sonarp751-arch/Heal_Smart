import React from 'react';
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

export const MAPlot: React.FC<{ degs: DifferentialGene[]; onSelectGene?: (gene: DifferentialGene) => void }> = ({
  degs,
  onSelectGene,
}) => {
  const plotData = degs.map((d) => ({
    ...d,
    x: d.baseMean,
    y: d.log2FoldChange,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-3 rounded-lg border border-slate-700 text-xs font-mono shadow-xl space-y-1">
          <div className="font-bold text-cyan-300">{data.geneSymbol}</div>
          <div>Mean Expr (A): {data.baseMean.toFixed(2)}</div>
          <div>log₂FC (M): {data.log2FoldChange.toFixed(2)}</div>
          <div>padj: {data.padj.toExponential(2)}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-xl p-5 border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold font-mono text-slate-100">
          MA Plot (log₂ Intensity Ratio vs Average Log Count)
        </h3>
        <span className="text-xs font-mono text-slate-400">M = log₂(Case/Ctrl), A = Mean</span>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <XAxis
              type="number"
              dataKey="x"
              domain={[6, 18]}
              stroke="#64748B"
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              label={{ value: 'Average Expression (log₂ CPM)', position: 'insideBottom', offset: -10, fill: '#64748B', fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[-4, 4]}
              stroke="#64748B"
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              label={{ value: 'Minus vs Add (log₂ Fold Change)', angle: -90, position: 'insideLeft', fill: '#64748B', fontSize: 11 }}
            />
            <ZAxis range={[50, 50]} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />

            <Scatter data={plotData} onClick={(e: any) => onSelectGene && onSelectGene(e.payload)} cursor="pointer">
              {plotData.map((entry, index) => {
                const color = entry.log2FoldChange > 1 ? '#10B981' : entry.log2FoldChange < -1 ? '#F43F5E' : '#64748B';
                return <Cell key={`cell-ma-${index}`} fill={color} opacity={0.8} />;
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const ExpressionHeatmap: React.FC<{ degs: DifferentialGene[] }> = ({ degs }) => {
  // Simulated normalized z-scores across 6 tumor samples & 4 normal controls for top genes
  const samples = ['Tumor_01', 'Tumor_02', 'Tumor_03', 'Tumor_04', 'Tumor_05', 'Tumor_06', 'Norm_01', 'Norm_02', 'Norm_03', 'Norm_04'];
  const topGenes = degs.slice(0, 8);

  const getZScoreColor = (gene: DifferentialGene, isTumor: boolean) => {
    const isUp = gene.log2FoldChange > 0;
    if (isTumor) {
      return isUp ? 'bg-emerald-500/80 text-slate-950 font-bold' : 'bg-rose-500/80 text-slate-950 font-bold';
    } else {
      return isUp ? 'bg-slate-800 text-slate-400' : 'bg-emerald-500/70 text-slate-950 font-bold';
    }
  };

  return (
    <div className="glass-panel rounded-xl p-5 border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold font-mono text-slate-100">
            Expression Heatmap (Clustered Relative Abundance)
          </h3>
          <p className="text-xs text-slate-400">Hierarchical clustering of top prioritized biomarkers</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-3 h-3 bg-emerald-500 rounded"></span> +2.5 Z-score
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <span className="w-3 h-3 bg-slate-800 rounded"></span> 0.0
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-3 h-3 bg-rose-500 rounded"></span> -2.5 Z-score
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-slate-400">Gene</th>
              {samples.map((s) => (
                <th key={s} className="p-2 text-center text-slate-400 text-[10px]">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {topGenes.map((gene) => (
              <tr key={gene.geneSymbol}>
                <td className="p-2 font-bold text-slate-200">{gene.geneSymbol}</td>
                {samples.map((s, idx) => {
                  const isTumor = idx < 6;
                  return (
                    <td key={s} className="p-1 text-center">
                      <div className={`py-1.5 px-1 rounded text-[10px] ${getZScoreColor(gene, isTumor)}`}>
                        {isTumor ? (gene.log2FoldChange > 0 ? '+1.8' : '-1.5') : (gene.log2FoldChange > 0 ? '-1.2' : '+1.6')}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
