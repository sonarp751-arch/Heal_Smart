import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react';
import { searchEuropePmcLiterature } from '../services/europePmcService';
import { LiteratureCard } from '../components/literature/LiteratureCard';
import { useResearchProject } from '../context/ResearchProjectContext';
import { LiteratureArticle } from '../types';

export const LiteratureIntelligencePage: React.FC = () => {
  const navigate = useNavigate();
  const { disease, selectedTarget, selectedMolecule } = useResearchProject();

  const defaultQuery = `${disease?.name ? disease.name.split(' ')[0] : 'Glioblastoma'} ${selectedTarget?.geneSymbol || 'EGFR'}`;
  const [searchTerm, setSearchTerm] = useState(defaultQuery);
  const [articles, setArticles] = useState<LiteratureArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLiterature = async (queryStr: string) => {
    setIsLoading(true);
    const results = await searchEuropePmcLiterature(queryStr, 8);
    setArticles(results);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLiterature(defaultQuery);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    fetchLiterature(searchTerm.trim());
  };

  return (
    <div className="space-y-6 py-4 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            STAGE 11 • LITERATURE INTELLIGENCE
          </span>
          <h1 className="text-2xl font-bold font-mono text-slate-100 mt-1">
            Peer-Reviewed Scientific Literature & Clinical Precedent
          </h1>
          <p className="text-xs text-slate-300 font-sans max-w-2xl">
            Live biomedical literature indexing via Europe PMC & PubMed / NCBI E-utilities.
            Every result displays full titles, author lists, journals, publication years, PMIDs, and DOIs.
          </p>
        </div>

        <button
          onClick={() => navigate('/experiments')}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition-colors flex items-center gap-1.5 self-start md:self-auto shadow-lg shadow-cyan-500/20"
        >
          <span>Next-Best Experiment</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Live Search Bar */}
      <form onSubmit={handleSearch} className="glass-panel rounded-xl p-4 border-slate-800 flex items-center gap-3">
        <Search className="w-5 h-5 text-cyan-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search PubMed / Europe PMC by disease, target, drug, or clinical assay..."
          className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 font-mono focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Query Europe PMC</span>
        </button>
      </form>

      {/* Articles Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Found {articles.length} peer-reviewed publications</span>
          <span>Open Access & PubMed Indexed</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs font-mono text-cyan-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin" />
            <span>Retrieving literature metadata from Europe PMC REST API...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map((art) => (
              <LiteratureCard key={art.id} article={art} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
