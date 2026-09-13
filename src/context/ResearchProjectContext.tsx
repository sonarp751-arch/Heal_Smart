import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BindingPocket,
  DifferentialGene,
  DiseaseEntity,
  DockingSetupConfig,
  DockingStrategy,
  MoleculeEntity,
  OmicsExperiment,
  ProteinStructureEntity,
  TargetEntity,
  WorkflowStage,
} from '../types';
import { DEMO_DISEASES } from '../data/demoDiseases';
import { DEMO_DEGS, DEMO_OMICS_EXPERIMENT } from '../data/demoOmics';
import { DEMO_TARGETS } from '../data/demoTargets';
import { DEMO_POCKETS, DEMO_STRUCTURES } from '../data/demoStructures';
import { DEMO_MOLECULES } from '../data/demoDrugs';
import { generateVinaConfigFile, generateVinaShellScript } from '../services/dockingBackendService';

interface ResearchProjectState {
  disease: DiseaseEntity | null;
  omicsExperiment: OmicsExperiment | null;
  degs: DifferentialGene[];
  targets: TargetEntity[];
  selectedTarget: TargetEntity | null;
  selectedStructure: ProteinStructureEntity | null;
  selectedPocket: BindingPocket | null;
  selectedMolecule: MoleculeEntity | null;
  activeStage: WorkflowStage;
  activeDockingStrategy: DockingStrategy;
  dockingConfig: DockingSetupConfig | null;
  isDemoMode: boolean;

  // Actions
  setDisease: (disease: DiseaseEntity | null) => void;
  setOmicsExperiment: (exp: OmicsExperiment | null) => void;
  setDegs: (degs: DifferentialGene[]) => void;
  setTargets: (targets: TargetEntity[]) => void;
  setSelectedTarget: (target: TargetEntity | null) => void;
  setSelectedStructure: (structure: ProteinStructureEntity | null) => void;
  setSelectedPocket: (pocket: BindingPocket | null) => void;
  setSelectedMolecule: (molecule: MoleculeEntity | null) => void;
  setActiveStage: (stage: WorkflowStage) => void;
  setActiveDockingStrategy: (strategy: DockingStrategy) => void;
  updateDockingGrid: (center: { x: number; y: number; z: number }, size: { sizeX: number; sizeY: number; sizeZ: number }) => void;
  updateDockingParams: (params: { exhaustiveness?: number; energyRange?: number; numPoses?: number }) => void;
  loadDemoProject: (diseaseKey?: string) => void;
  resetProject: () => void;
}

const ResearchProjectContext = createContext<ResearchProjectState | undefined>(undefined);

export const ResearchProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [disease, setDisease] = useState<DiseaseEntity | null>(() => DEMO_DISEASES[0]);
  const [omicsExperiment, setOmicsExperiment] = useState<OmicsExperiment | null>(() => DEMO_OMICS_EXPERIMENT);
  const [degs, setDegs] = useState<DifferentialGene[]>(() => DEMO_DEGS);
  const [targets, setTargets] = useState<TargetEntity[]>(() => DEMO_TARGETS);
  const [selectedTarget, setSelectedTarget] = useState<TargetEntity | null>(() => DEMO_TARGETS[0]);
  const [selectedStructure, setSelectedStructure] = useState<ProteinStructureEntity | null>(() => DEMO_STRUCTURES.EGFR);
  const [selectedPocket, setSelectedPocket] = useState<BindingPocket | null>(() => DEMO_POCKETS.EGFR[0]);
  const [selectedMolecule, setSelectedMolecule] = useState<MoleculeEntity | null>(() => DEMO_MOLECULES[0]);
  const [activeStage, setActiveStage] = useState<WorkflowStage>('disease');
  const [activeDockingStrategy, setActiveDockingStrategy] = useState<DockingStrategy>('comparative_repurposing');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  const [dockingConfig, setDockingConfig] = useState<DockingSetupConfig | null>(() => {
    const defaultCenter = DEMO_POCKETS.EGFR[0].centerCoords;
    const defaultSize = DEMO_POCKETS.EGFR[0].boxDimensions;
    const vinaText = generateVinaConfigFile({
      receptorPdbqt: '1M17_prepared.pdbqt',
      ligandPdbqt: 'CHEMBL482_erlotinib.pdbqt',
      gridCenter: defaultCenter,
      gridSize: defaultSize,
      exhaustiveness: 16,
      energyRange: 3.0,
      numModes: 9,
    });
    const shellScript = generateVinaShellScript({
      receptorPdbId: '1M17',
      ligandId: 'CHEMBL482_erlotinib',
      configFile: 'vina_config.txt',
    });

    return {
      id: 'DOCK_CFG_01',
      strategy: 'comparative_repurposing',
      receptorTargetId: 'TGT_EGFR',
      receptorPdbId: '1M17',
      pocketId: 'PKT_EGFR_ATP_01',
      gridCenter: defaultCenter,
      gridSize: defaultSize,
      exhaustiveness: 16,
      energyRange: 3.0,
      numPoses: 9,
      selectedLigandIds: ['CHEMBL482'],
      receptorPrepared: true,
      ligandsPrepared: true,
      backendConnected: false,
      backendUrl: 'http://localhost:8000/api/v1/dock',
      vinaConfigText: vinaText,
      cliCommand: shellScript,
    };
  });

  // Keep docking config synchronized when target or pocket changes
  useEffect(() => {
    if (selectedTarget && selectedPocket) {
      const pdbId = selectedStructure?.pdbId || selectedTarget.bestPdbId || '1M17';
      const ligandId = selectedMolecule?.id || 'CHEMBL482';
      const center = selectedPocket.centerCoords;
      const size = selectedPocket.boxDimensions;

      const vinaText = generateVinaConfigFile({
        receptorPdbqt: `${pdbId}_prepared.pdbqt`,
        ligandPdbqt: `${ligandId}_prepared.pdbqt`,
        gridCenter: center,
        gridSize: size,
        exhaustiveness: dockingConfig?.exhaustiveness || 16,
        energyRange: dockingConfig?.energyRange || 3.0,
        numModes: dockingConfig?.numPoses || 9,
      });

      const shellScript = generateVinaShellScript({
        receptorPdbId: pdbId,
        ligandId: ligandId,
        configFile: 'vina_config.txt',
      });

      setDockingConfig((prev) => ({
        id: prev?.id || 'DOCK_CFG_AUTO',
        strategy: activeDockingStrategy,
        receptorTargetId: selectedTarget.id,
        receptorPdbId: pdbId,
        pocketId: selectedPocket.pocketId,
        gridCenter: center,
        gridSize: size,
        exhaustiveness: prev?.exhaustiveness || 16,
        energyRange: prev?.energyRange || 3.0,
        numPoses: prev?.numPoses || 9,
        selectedLigandIds: selectedMolecule ? [selectedMolecule.id] : ['CHEMBL482'],
        receptorPrepared: true,
        ligandsPrepared: true,
        backendConnected: false,
        backendUrl: prev?.backendUrl || 'http://localhost:8000/api/v1/dock',
        vinaConfigText: vinaText,
        cliCommand: shellScript,
      }));
    }
  }, [selectedTarget, selectedStructure, selectedPocket, selectedMolecule, activeDockingStrategy]);

  const updateDockingGrid = (
    center: { x: number; y: number; z: number },
    size: { sizeX: number; sizeY: number; sizeZ: number }
  ) => {
    if (!dockingConfig) return;
    const pdbId = selectedStructure?.pdbId || '1M17';
    const ligandId = selectedMolecule?.id || 'CHEMBL482';

    const vinaText = generateVinaConfigFile({
      receptorPdbqt: `${pdbId}_prepared.pdbqt`,
      ligandPdbqt: `${ligandId}_prepared.pdbqt`,
      gridCenter: center,
      gridSize: size,
      exhaustiveness: dockingConfig.exhaustiveness,
      energyRange: dockingConfig.energyRange,
      numModes: dockingConfig.numPoses,
    });

    setDockingConfig({
      ...dockingConfig,
      gridCenter: center,
      gridSize: size,
      vinaConfigText: vinaText,
    });
  };

  const updateDockingParams = (params: { exhaustiveness?: number; energyRange?: number; numPoses?: number }) => {
    if (!dockingConfig) return;
    const exhaustiveness = params.exhaustiveness ?? dockingConfig.exhaustiveness;
    const energyRange = params.energyRange ?? dockingConfig.energyRange;
    const numPoses = params.numPoses ?? dockingConfig.numPoses;
    const pdbId = selectedStructure?.pdbId || '1M17';
    const ligandId = selectedMolecule?.id || 'CHEMBL482';

    const vinaText = generateVinaConfigFile({
      receptorPdbqt: `${pdbId}_prepared.pdbqt`,
      ligandPdbqt: `${ligandId}_prepared.pdbqt`,
      gridCenter: dockingConfig.gridCenter,
      gridSize: dockingConfig.gridSize,
      exhaustiveness,
      energyRange,
      numModes: numPoses,
    });

    setDockingConfig({
      ...dockingConfig,
      exhaustiveness,
      energyRange,
      numPoses,
      vinaConfigText: vinaText,
    });
  };

  const loadDemoProject = (diseaseKey: string = 'GBM') => {
    const foundDisease = DEMO_DISEASES.find((d) => d.name.includes(diseaseKey)) || DEMO_DISEASES[0];
    setDisease(foundDisease);
    setOmicsExperiment(DEMO_OMICS_EXPERIMENT);
    setDegs(DEMO_DEGS);
    setTargets(DEMO_TARGETS);
    setSelectedTarget(DEMO_TARGETS[0]);
    setSelectedStructure(DEMO_STRUCTURES.EGFR);
    setSelectedPocket(DEMO_POCKETS.EGFR[0]);
    setSelectedMolecule(DEMO_MOLECULES[0]);
    setIsDemoMode(true);
    setActiveStage('disease');
  };

  const resetProject = () => {
    setDisease(null);
    setOmicsExperiment(null);
    setDegs([]);
    setTargets([]);
    setSelectedTarget(null);
    setSelectedStructure(null);
    setSelectedPocket(null);
    setSelectedMolecule(null);
    setDockingConfig(null);
    setIsDemoMode(false);
    setActiveStage('disease');
  };

  return (
    <ResearchProjectContext.Provider
      value={{
        disease,
        omicsExperiment,
        degs,
        targets,
        selectedTarget,
        selectedStructure,
        selectedPocket,
        selectedMolecule,
        activeStage,
        activeDockingStrategy,
        dockingConfig,
        isDemoMode,
        setDisease,
        setOmicsExperiment,
        setDegs,
        setTargets,
        setSelectedTarget,
        setSelectedStructure,
        setSelectedPocket,
        setSelectedMolecule,
        setActiveStage,
        setActiveDockingStrategy,
        updateDockingGrid,
        updateDockingParams,
        loadDemoProject,
        resetProject,
      }}
    >
      {children}
    </ResearchProjectContext.Provider>
  );
};

export function useResearchProject() {
  const context = useContext(ResearchProjectContext);
  if (!context) {
    throw new Error('useResearchProject must be used within a ResearchProjectProvider');
  }
  return context;
}
