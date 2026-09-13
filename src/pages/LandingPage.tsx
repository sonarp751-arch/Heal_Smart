import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Atom,
  Binary,
  BookOpen,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Compass,
  Cpu,
  Database,
  Dna,
  FileCheck2,
  GitFork,
  Layers,
  Network,
  Pill,
  ShieldCheck,
  Sparkles,
  TestTube2,
} from 'lucide-react';
import { HeroMolecularVisual } from '../components/landing/HeroMolecularVisual';
import { useResearchProject } from '../context/ResearchProjectContext';
import { DEMO_DISEASES } from '../data/demoDiseases';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loadDemoProject, setDisease } = useResearchProject();

  const handleSelectDisease = (disease: any) => {
    setDisease(disease);
    navigate('/disease');
  };

  const workflowSteps = [
    { step: '01', title: 'DISEASE', desc: 'Ontology & Clinical Phenotype' },
    { step: '02', title: 'OMICS', desc: 'RNA-seq Differential Expression' },
    { step: '03', title: 'TARGET', desc: 'Centrality & Score Prioritization' },
    { step: '04', title: 'PATHWAY', desc: 'Reactome Signaling Cascades' },
    { step: '05', title: 'STRUCTURE', desc: '3D PDB / AlphaFold Coordinates' },
    { step: '06', title: 'POCKET', desc: 'Active Cleft & Catalytic Residues' },
    { step: '07', title: 'MOLECULE', desc: 'Small-Molecule Chemical Space' },
    { step: '08', title: 'DOCKING', desc: 'Vina Protocol Preparation' },
    { step: '09', title: 'REPURPOSING', desc: 'Phenotypic & Mechanistic Fit' },
  ];

  return (
    <div className="space-y-16 py-6 pb-20">
      {/* Hero Section */}
      <section className="relative pt-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              <Atom className="w-4 h-4 text-cyan-400 animate-spin-slow" />
              <span>InSilicoRepurposer v2.0 • Computational Biology Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-sans text-slate-100 leading-tight">
              Discover what <span className="text-gradient-cyan">existing drugs</span> could target next.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-xl">
              Integrate disease biology, omics, networks, pathways, structural biology, molecular docking,
              literature and chemical intelligence into one reproducible computational workflow.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  loadDemoProject('GBM');
                  navigate('/disease');
                }}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold font-mono text-sm shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Start Disease Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/drug-first')}
                className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold font-mono text-sm border border-slate-700 transition-all flex items-center gap-2"
              >
                <Pill className="w-4 h-4 text-purple-400" />
                <span>Explore Drug Repurposing</span>
              </button>
            </div>

            {/* Scientific Integrity Bullet Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real Public APIs (UniProt, PDB, ChEMBL)
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> No Fabricated Docking Scores
              </span>
            </div>
          </div>

          {/* Right Hero Visual (Simulated 3D Molecular Pocket) */}
          <div className="lg:col-span-6">
            <HeroMolecularVisual />
          </div>
        </div>
      </section>

      {/* Visual Scientific Pipeline Workflow */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            END-TO-END COMPUTATIONAL PIPELINE
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold font-mono text-slate-100">
            From Disease Biology to Repurposed Drugs — In Silico.
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
          {workflowSteps.map((ws, i) => (
            <div
              key={ws.step}
              className="glass-card rounded-xl p-3.5 border border-slate-800 text-center space-y-1 group relative hover:border-cyan-500/40 transition-all"
            >
              <div className="text-[10px] font-mono text-cyan-400 font-bold">STEP {ws.step}</div>
              <div className="text-xs font-bold font-mono text-slate-100 group-hover:text-cyan-300">
                {ws.title}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">{ws.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Workflow Pillars Grid */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              CORE COMPUTATIONAL MODULES
            </span>
            <h3 className="text-2xl font-bold font-mono text-slate-100 mt-1">
              Rigorous Pharmaceutical R&D Capabilities
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono max-w-md">
            Built for computational biologists, structural bioinformaticians, and translational oncology teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-3 hover:border-cyan-500/30 transition-all">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 w-fit">
              <Binary className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold font-mono text-slate-100">Omics Differential Expression</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Analyze RNA-seq, microarrays, and proteomics. Interactive Volcano and MA plots with live log₂FC and FDR filtering.
            </p>
            <Link to="/omics" className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 pt-2">
              Launch Omics Suite <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-3 hover:border-cyan-500/30 transition-all">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 w-fit">
              <Network className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold font-mono text-slate-100">Biological Multi-Partite Networks</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Interactome graph topology connecting disease phenotypes, bottleneck targets, signaling cascades, and approved drugs.
            </p>
            <Link to="/network" className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 pt-2">
              Inspect Network Graph <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-3 hover:border-cyan-500/30 transition-all">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 w-fit">
              <Boxes className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold font-mono text-slate-100">3Dmol.js Molecular Visualization</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              WebGL macromolecular viewer supporting PDB & AlphaFold coordinates, cartoon/surface modes, and binding pocket grid boxes.
            </p>
            <Link to="/structures" className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 pt-2">
              Open 3D Structure Lab <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-3 hover:border-cyan-500/30 transition-all">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 w-fit">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold font-mono text-slate-100">Docking Planner & Vina Preparation</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              4 docking strategies: Redocking, Cross-Docking, Virtual Screening, Repurposing. Automatic `vina_config.txt` generation.
            </p>
            <Link to="/docking" className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-2">
              Configure Docking Run <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-3 hover:border-cyan-500/30 transition-all">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 w-fit">
              <Activity className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold font-mono text-slate-100">ADMET Pharmacokinetics & Safety</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Evaluate BBB permeability, Caco-2 flux, CYP metabolism, and hERG liability with experimental vs predicted tags.
            </p>
            <Link to="/admet" className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1 pt-2">
              View ADMET Profiles <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-3 hover:border-cyan-500/30 transition-all">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 w-fit">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold font-mono text-slate-100">Reproducible Research Report</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Generate full 21-section pharmaceutical dossiers with traceable provenance, exportable to Markdown, JSON, and PDF.
            </p>
            <Link to="/report" className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 pt-2">
              Generate Research Report <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Preset Curated Disease Cohorts */}
      <section className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            CURATED BENCHMARK COHORTS
          </span>
          <h3 className="text-xl font-bold font-mono text-slate-100">
            Select a Gold-Standard Research Project to Explore
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEMO_DISEASES.map((d) => (
            <div
              key={d.id}
              onClick={() => handleSelectDisease(d)}
              className="glass-panel rounded-xl p-5 border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-all space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                  <span>{d.id}</span>
                  <span className="text-cyan-400">{d.therapeuticArea}</span>
                </div>
                <h4 className="text-sm font-bold font-mono text-slate-100">{d.name}</h4>
                <p className="text-xs text-slate-300 mt-2 line-clamp-3 font-sans leading-relaxed">
                  {d.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Targets: <strong className="text-cyan-300">{d.knownTargetsCount}</strong></span>
                <span className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold">
                  Load <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
