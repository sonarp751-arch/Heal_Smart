import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ChevronRight, CheckCircle2, Dna, ExternalLink } from 'lucide-react';
import { DifferentialGene } from '../../types';

interface DegTableProps {
  degs: DifferentialGene[];
  selectedGene?: string;
  onSelectGene: (gene: DifferentialGene) => void;
  onPromoteToTarget?: (gene: DifferentialGene) => void;
}

export const DegTable: React.FC<DegTableProps> = ({
  degs,
  selectedGene,
  onSelectGene,
  onPromoteToTarget,
}) => {
  const [search, setSearch] = useState('');
  const [filterRegulation, setFilterRegulation] = useState<'ALL' | 'UP' | 'DOWN'>('ALL');
  const [sortField, setSortField] = useState<keyof DifferentialGene>('padj');
  const [sortAsc, setSortAsc] = useState(true);

  const filteredDegs = useMemo(() => {
    return degs
      .filter((d) => {
        if (filterRegulation !== 'ALL' && d.regulation !== filterRegulation) return false;
        if (
          search &&
          !d.geneSymbol.toLowerCase().includes(search.toLowerCase()) &&
          !d.ensemblId.toLowerCase().includes(search.toLowerCase())
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA === undefined || valB === undefined) return 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
  }, [degs, search, filterRegulation, sortField, sortAsc]);

  const handleSort = (field: keyof DifferentialGene) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === 'geneSymbol' || field === 'padj');
    }
  };

  return (
    <div className="glass-panel rounded-xl border-slate-800 overflow-hidden flex flex-col">
      {/* Controls Bar */}
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60">
        <div className="flex items-center gap-2 w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by gene symbol or Ensembl ID..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end text-xs font-mono">
          <button
            onClick={() => setFilterRegulation('ALL')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filterRegulation === 'ALL'
                ? 'bg-slate-700 text-slate-100 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({degs.length})
          </button>
          <button
            onClick={() => setFilterRegulation('UP')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filterRegulation === 'UP'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            Up (log₂FC &gt; 0)
          </button>
          <button
            onClick={() => setFilterRegulation('DOWN')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filterRegulation === 'DOWN'
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            Down (log₂FC &lt; 0)
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400">
              <th
                onClick={() => handleSort('geneSymbol')}
                className="p-3 cursor-pointer hover:text-slate-200"
              >
                <div className="flex items-center gap-1">
                  <span>Gene Symbol</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('log2FoldChange')}
                className="p-3 cursor-pointer hover:text-slate-200"
              >
                <div className="flex items-center gap-1">
                  <span>log₂FC</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('padj')}
                className="p-3 cursor-pointer hover:text-slate-200"
              >
                <div className="flex items-center gap-1">
                  <span>Adj. p-value (FDR)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('baseMean')}
                className="p-3 cursor-pointer hover:text-slate-200 hidden md:table-cell"
              >
                <div className="flex items-center gap-1">
                  <span>Mean Expr</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3 hidden lg:table-cell">Druggability & Class</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredDegs.map((gene) => {
              const isSelected = selectedGene === gene.geneSymbol;

              return (
                <tr
                  key={gene.geneSymbol}
                  onClick={() => onSelectGene(gene)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-cyan-500/10 text-cyan-200' : 'hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <td className="p-3 font-semibold text-slate-100 flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        gene.regulation === 'UP'
                          ? 'bg-emerald-400'
                          : gene.regulation === 'DOWN'
                          ? 'bg-rose-400'
                          : 'bg-slate-600'
                      }`}
                    />
                    <span>{gene.geneSymbol}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{gene.ensemblId}</span>
                  </td>
                  <td className="p-3 font-bold">
                    <span className={gene.log2FoldChange > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {gene.log2FoldChange > 0 ? `+${gene.log2FoldChange.toFixed(2)}` : gene.log2FoldChange.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">{gene.padj.toExponential(2)}</td>
                  <td className="p-3 text-slate-400 hidden md:table-cell">{gene.baseMean.toFixed(1)}</td>
                  <td className="p-3 text-slate-400 hidden lg:table-cell truncate max-w-xs">
                    {gene.druggabilityClass || 'Standard transcript'}
                  </td>
                  <td className="p-3 text-right">
                    {onPromoteToTarget && gene.isDrugTarget && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPromoteToTarget(gene);
                        }}
                        className="px-2.5 py-1 rounded bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-[11px] transition-colors inline-flex items-center gap-1"
                      >
                        <Dna className="w-3 h-3" />
                        <span>Prioritize</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
