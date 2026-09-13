import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  Atom,
  Binary,
  BookOpen,
  Boxes,
  Compass,
  Cpu,
  Database,
  Dna,
  FileCheck2,
  GitFork,
  HelpCircle,
  Menu,
  Network,
  Pill,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  TestTube2,
  X,
} from 'lucide-react';
import { useResearchProject } from '../../context/ResearchProjectContext';
import { DemoDataBadge } from './ProvenanceBadge';

export const ScientificHeader: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { disease, selectedTarget, selectedMolecule, isDemoMode, loadDemoProject, resetProject } = useResearchProject();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/disease?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#070B14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 flex items-center justify-between">
      {/* Brand & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#070B14] rounded-[10px] flex items-center justify-center">
              <Atom className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-base tracking-tight text-slate-100">
                InSilico<span className="text-cyan-400">Repurposer</span>
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                v2.0
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
              Computational Drug Repurposing
            </div>
          </div>
        </Link>
      </div>

      {/* Active Project Breadcrumb / State Pills */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono">
        <span className="text-slate-400">Active Disease:</span>
        <span className="text-cyan-300 font-semibold truncate max-w-[150px]">
          {disease ? disease.name : 'None Selected'}
        </span>
        {selectedTarget && (
          <>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Target:</span>
            <span className="text-emerald-300 font-semibold">{selectedTarget.geneSymbol}</span>
          </>
        )}
        {selectedMolecule && (
          <>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Drug:</span>
            <span className="text-purple-300 font-semibold">{selectedMolecule.name}</span>
          </>
        )}
      </div>

      {/* Quick Search */}
      <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative w-64">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Disease, Target, SMILES..."
          className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
        />
      </form>

      {/* Right Action Icons & Controls */}
      <div className="flex items-center gap-2">
        {isDemoMode && <DemoDataBadge label="DEMO MODE" />}

        <button
          onClick={() => loadDemoProject('GBM')}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
          title="Reload Curated TCGA-GBM Demo Dataset"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Load Demo</span>
        </button>

        <Link
          to="/report"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Report</span>
        </Link>

        <Link
          to="/settings"
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all"
          title="API & Docking Engine Settings"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
};

export const ResearchSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const navGroups = [
    {
      group: 'COMMAND & DISCOVERY',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: Database, badge: 'Overview' },
        { label: 'Disease Discovery', path: '/disease', icon: Compass },
        { label: 'Drug-First Repurposing', path: '/drug-first', icon: Pill, badge: 'New' },
      ],
    },
    {
      group: 'OMICS & TARGETS',
      items: [
        { label: 'Omics Analysis', path: '/omics', icon: Binary },
        { label: 'Target Explorer', path: '/targets', icon: Dna },
        { label: 'Network Biology', path: '/network', icon: Network },
        { label: 'Pathway Explorer', path: '/pathways', icon: GitFork },
      ],
    },
    {
      group: 'STRUCTURE & DOCKING',
      items: [
        { label: '3D Structure Explorer', path: '/structures', icon: Boxes },
        { label: 'Docking Planner', path: '/docking', icon: Cpu, badge: 'Vina Prep' },
        { label: 'Molecule Discovery', path: '/molecules', icon: Atom },
        { label: 'Molecular Optimization', path: '/optimization', icon: Sparkles },
      ],
    },
    {
      group: 'TRANSLATIONAL VALIDATION',
      items: [
        { label: 'ADMET Profiling', path: '/admet', icon: Activity },
        { label: 'Literature Intelligence', path: '/literature', icon: BookOpen },
        { label: 'Next-Best Experiment', path: '/experiments', icon: TestTube2 },
        { label: 'Research Report', path: '/report', icon: FileCheck2 },
        { label: 'Engine Settings', path: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-[#090F1C] border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((grp) => (
            <div key={grp.group} className="space-y-1">
              <div className="px-3 text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                {grp.group}
              </div>
              <div className="space-y-0.5 mt-1">
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isCurrent = window.location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-colors ${
                        isCurrent
                          ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isCurrent ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Scientific Engine Active
          </span>
          <span className="text-slate-400">Homo sapiens</span>
        </div>
      </aside>
    </>
  );
};
