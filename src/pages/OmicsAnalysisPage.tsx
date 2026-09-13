import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Binary,
  CheckCircle2,
  Database,
  Dna,
  FileSpreadsheet,
  Filter,
  Layers,
  RefreshCw,
  Upload,
} from 'lucide-react';
import { VolcanoPlot } from '../components/omics/VolcanoPlot';
import { MAPlot, ExpressionHeatmap } from '../components/omics/MAPlot';
import { DegTable } from '../components/omics/DegTable';
import { useResearchProject } from '../context/ResearchProjectContext';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';
import { DifferentialGene } from '../types';

export const OmicsAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { omicsExperiment, degs, setDegs, setSelectedTarget, targets } = useResearchProject();
  const [selectedGene, setSelectedGene] = useState<string>('EGFR');
  const [activeTab, setActiveTab] = useState<'volcano' | 'ma' | 'heatmap'>('volcano');
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const handleSelectGene = (gene: DifferentialGene) => {
    setSelectedGene(gene.geneSymbol);
  };

  const handlePromoteToTarget = (gene: DifferentialGene) => {
    const matchedTarget = targets.find((t) => t.geneSymbol === gene.geneSymbol);
    if (matchedTarget) {
      setSelectedTarget(matchedTarget);
    }
    navigate('/targets');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        if (lines.length < 2) throw new Error('File has insufficient lines.');

        // Parse simple CSV/TSV format: geneSymbol,log2FC,pvalue,padj,baseMean
        const parsedDegs: DifferentialGene[] = [];
        const isTsv = lines[0].includes('\t');
        const sep = isTsv ? '\t' : ',';

        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(sep).map((p) => p.trim().replace(/^["']|["']$/g, ''));
          if (parts.length >= 4) {
            const sym = parts[0].toUpperCase();
            const fc = parseFloat(parts[1]) || 0;
            const pval = parseFloat(parts[2]) || 0.05;
            const padj = parseFloat(parts[3]) || 0.05;
            const mean = parts[4] ? parseFloat(parts[4]) : 10.0;

            parsedDegs.push({
              geneSymbol: sym,
              ensemblId: `ENSG_USER_${sym}`,
              log2FoldChange: fc,
              pvalue: pval,
              padj: padj,
              baseMean: mean,
              regulation: fc >= 1.0 && padj <= 0.05 ? 'UP' : fc <= -1.0 && padj <= 0.05 ? 'DOWN' : 'NS',
              isDrugTarget: true,
              druggabilityClass: 'Uploaded user transcript',
            });
          }
        }

        if (parsedDegs.length > 0) {
          setDegs(parsedDegs);
          setUploadNotice(`Successfully loaded ${parsedDegs.length} differential transcripts from ${file.name}`);
        }
      } catch (err: any) {
        setUploadNotice(`Error parsing expression file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 py-4 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              STAGE 02 • OMICS ANALYSIS
            </span>
            <ProvenanceBadge meta={omicsExperiment?.provenance} />
          </div>
          <h1 className="text-2xl font-bold font-mono text-slate-100 mt-1">
            Differential Transcriptomic Expression & Biomarkers
          </h1>
          <p className="text-xs text-slate-300 font-sans max-w-2xl">
            Inspect RNA-seq / microarray log₂ fold changes, adjusted p-values (FDR), and base mean counts.
            Filter differentially expressed genes (DEGs) and promote prioritized transcripts into the target queue.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          {/* Custom File Upload */}
          <label className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono transition-colors flex items-center gap-2 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload DEG Matrix (CSV/TSV)</span>
            <input type="file" accept=".csv,.tsv,.txt" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={() => navigate('/targets')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition-colors flex items-center gap-1.5"
          >
            <span>Target Prioritization</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {uploadNotice && (
        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center justify-between">
          <span>{uploadNotice}</span>
          <button onClick={() => setUploadNotice(null)} className="text-slate-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Omics Experiment Meta Box */}
      <div className="glass-panel rounded-xl p-4 border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <Binary className="w-5 h-5 text-cyan-400" />
          <div>
            <span className="font-bold text-slate-100">{omicsExperiment?.name}</span>
            <div className="text-slate-400 text-[11px]">
              Platform: {omicsExperiment?.platform} • Species: {omicsExperiment?.species}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span>Case: <strong className="text-rose-300">{omicsExperiment?.sampleGroupCase}</strong></span>
          <span>Control: <strong className="text-emerald-300">{omicsExperiment?.sampleGroupControl}</strong></span>
          <span>DEGs: <strong className="text-cyan-300">{degs.length}</strong></span>
        </div>
      </div>

      {/* Plot Tabs Toggle */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab('volcano')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'volcano'
              ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Volcano Plot (-log₁₀p vs log₂FC)
        </button>
        <button
          onClick={() => setActiveTab('ma')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'ma'
              ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          MA Plot (log₂CPM vs log₂FC)
        </button>
        <button
          onClick={() => setActiveTab('heatmap')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'heatmap'
              ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Clustered Heatmap
        </button>
      </div>

      {/* Active Plot Workspace */}
      {activeTab === 'volcano' && (
        <VolcanoPlot degs={degs} onSelectGene={handleSelectGene} selectedGeneSymbol={selectedGene} />
      )}
      {activeTab === 'ma' && <MAPlot degs={degs} onSelectGene={handleSelectGene} />}
      {activeTab === 'heatmap' && <ExpressionHeatmap degs={degs} />}

      {/* DEG Data Table */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold font-mono text-slate-200 uppercase tracking-wider">
          Differential Expression Gene Table ({degs.length} Transcripts)
        </h3>
        <DegTable
          degs={degs}
          selectedGene={selectedGene}
          onSelectGene={handleSelectGene}
          onPromoteToTarget={handlePromoteToTarget}
        />
      </div>
    </div>
  );
};
