import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Database, Dna, ExternalLink, GitFork, Search, Sparkles } from 'lucide-react';
import { DEMO_PATHWAYS } from '../data/demoNetworks';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';

export const PathwayExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPathways = DEMO_PATHWAYS.filter((pw) =>
    pw.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pw.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pw.overlapGenes.some((g) => g.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 py-4 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            STAGE 05 • PATHWAY EXPLORER
          </span>
          <h1 className="text-2xl font-bold font-mono text-slate-100 mt-1">
            Reactome & Canonical Signaling Pathways
          </h1>
          <p className="text-xs text-slate-300 font-sans max-w-2xl">
            Map prioritized targets and differentially expressed genes onto Reactome biological cascades.
            Evaluate statistical enrichment ratios, hyper-geometric p-values, and disease target overlap.
          </p>
        </div>

        <button
          onClick={() => navigate('/structures')}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <span>3D Structure Explorer</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel rounded-xl p-4 border-slate-800 flex items-center gap-3">
        <Search className="w-5 h-5 text-cyan-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter pathways by name, ID (e.g. R-HSA-177929), or overlapping gene symbols..."
          className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 font-mono focus:outline-none"
        />
      </div>

      {/* Pathways List Grid */}
      <div className="space-y-4">
        {filteredPathways.map((pw) => (
          <div
            key={pw.id}
            className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4 hover:border-cyan-500/40 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">{pw.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30">
                    {pw.database}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{pw.category}</span>
                </div>
                <h3 className="text-lg font-bold font-mono text-slate-100">{pw.name}</h3>
              </div>

              <div className="text-right font-mono flex-shrink-0">
                <span className="text-xs text-slate-400 block">Enrichment Ratio</span>
                <span className="text-xl font-bold text-emerald-300">{pw.enrichmentRatio}x</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Total Genes</span>
                <strong className="text-slate-200">{pw.geneCount}</strong>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">DEG Overlap</span>
                <strong className="text-cyan-300">{pw.overlapCount} Genes</strong>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">p-value</span>
                <strong className="text-emerald-300">{pw.pValue.toExponential(2)}</strong>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">FDR (Benjamini)</span>
                <strong className="text-purple-300">{pw.fdr.toExponential(2)}</strong>
              </div>
            </div>

            {/* Overlap Gene Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-400 font-bold">Overlapping Target Genes:</span>
                {pw.overlapGenes.map((gene) => (
                  <span
                    key={gene}
                    onClick={() => navigate(`/targets`)}
                    className="px-2 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 cursor-pointer transition-colors"
                  >
                    {gene}
                  </span>
                ))}
              </div>

              <ProvenanceBadge meta={pw.provenance} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
