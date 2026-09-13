import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Binary,
  BookOpen,
  Boxes,
  ChevronRight,
  Compass,
  Cpu,
  Dna,
  FileCheck2,
  GitFork,
  Network,
  Pill,
  Sparkles,
} from 'lucide-react';
import { WorkflowStage } from '../../types';
import { useResearchProject } from '../../context/ResearchProjectContext';

interface PipelineStep {
  id: WorkflowStage;
  label: string;
  short: string;
  path: string;
  icon: React.ElementType;
}

export const PIPELINE_STEPS: PipelineStep[] = [
  { id: 'disease', label: 'Disease Discovery', short: 'DISEASE', path: '/disease', icon: Compass },
  { id: 'omics', label: 'Omics Analysis', short: 'OMICS', path: '/omics', icon: Binary },
  { id: 'targets', label: 'Target Explorer', short: 'TARGETS', path: '/targets', icon: Dna },
  { id: 'network', label: 'Network Biology', short: 'NETWORK', path: '/network', icon: Network },
  { id: 'pathways', label: 'Pathways', short: 'PATHWAYS', path: '/pathways', icon: GitFork },
  { id: 'structures', label: '3D Structures & Pockets', short: 'STRUCTURES', path: '/structures', icon: Boxes },
  { id: 'docking', label: 'Docking Planner', short: 'DOCKING', path: '/docking', icon: Cpu },
  { id: 'molecules', label: 'Drug Repurposing', short: 'REPURPOSING', path: '/repurposing', icon: Pill },
  { id: 'admet', label: 'ADMET Profiling', short: 'ADMET', path: '/admet', icon: Activity },
  { id: 'optimization', label: 'Analogue Design', short: 'ANALOGUES', path: '/optimization', icon: Sparkles },
  { id: 'experiments', label: 'Next Experiment', short: 'EXPERIMENT', path: '/experiments', icon: BookOpen },
  { id: 'report', label: 'Research Report', short: 'REPORT', path: '/report', icon: FileCheck2 },
];

export const ResearchPipeline: React.FC<{ activeStage?: WorkflowStage; compact?: boolean }> = ({
  activeStage = 'disease',
  compact = false,
}) => {
  const navigate = useNavigate();
  const { disease, selectedTarget, selectedMolecule } = useResearchProject();

  const handleStepClick = (step: PipelineStep) => {
    navigate(step.path);
  };

  return (
    <div className={`w-full overflow-x-auto pb-1 ${compact ? 'py-1' : 'py-3'}`}>
      <div className="flex items-center gap-1.5 min-w-max px-2">
        {PIPELINE_STEPS.map((step, idx) => {
          const isActive = step.id === activeStage;
          const Icon = step.icon;

          // Determine stage completion or context info
          let contextBadge = '';
          if (step.id === 'disease' && disease) contextBadge = disease.name.split(' ')[0];
          if (step.id === 'targets' && selectedTarget) contextBadge = selectedTarget.geneSymbol;
          if (step.id === 'molecules' && selectedMolecule) contextBadge = selectedMolecule.name;

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => handleStepClick(step)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 border ${
                  isActive
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10 font-bold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
                title={step.label}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{step.short}</span>
                {contextBadge && (
                  <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-cyan-300/90 font-mono border border-slate-700 max-w-[80px] truncate">
                    {contextBadge}
                  </span>
                )}
              </button>

              {idx < PIPELINE_STEPS.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
