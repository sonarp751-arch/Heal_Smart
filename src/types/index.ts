// ==========================================
// InSilicoRepurposer — Type Definitions
// ==========================================

export type WorkflowStage =
  | 'disease'
  | 'omics'
  | 'targets'
  | 'network'
  | 'pathways'
  | 'structures'
  | 'pockets'
  | 'docking'
  | 'molecules'
  | 'admet'
  | 'optimization'
  | 'experiments'
  | 'report';

export interface ProvenanceMeta {
  source: string; // e.g. 'UniProtKB', 'RCSB PDB', 'Open Targets', 'PubMed', 'Reactome', 'ChEMBL'
  sourceUrl?: string;
  query?: string;
  timestamp: string;
  recordId?: string;
  isExperimental?: boolean;
  isPredicted?: boolean;
  isDemo?: boolean;
}

// ------------------------------------------
// Disease Types
// ------------------------------------------
export interface DiseaseEntity {
  id: string; // e.g., 'EFO_0000384' or 'OMIM_137800'
  name: string; // e.g., 'Glioblastoma Multiforme'
  ontology: string; // 'EFO', 'MONDO', 'MeSH', 'ICD-11'
  synonyms: string[];
  description: string;
  therapeuticArea: string;
  associatedGenesCount: number;
  knownTargetsCount: number;
  clinicalTrialsCount: number;
  approvedDrugsCount: number;
  provenance: ProvenanceMeta;
}

// ------------------------------------------
// Omics & Differential Expression Types
// ------------------------------------------
export interface OmicsExperiment {
  id: string;
  name: string;
  platform: 'RNA-seq' | 'Microarray' | 'Proteomics' | 'Single-Cell RNA-seq';
  sampleGroupCase: string; // e.g., 'Tumor / Disease (n=45)'
  sampleGroupControl: string; // e.g., 'Normal Tissue (n=20)'
  species: string;
  tissue: string;
  totalGenesAnalyzed: number;
  significantDegsCount: number;
  provenance: ProvenanceMeta;
}

export interface DifferentialGene {
  geneSymbol: string;
  ensemblId: string;
  entrezId?: string;
  log2FoldChange: number;
  pvalue: number;
  padj: number; // Adjusted p-value / FDR
  baseMean: number; // Mean expression / logCPM
  regulation: 'UP' | 'DOWN' | 'NS'; // NS: Not Significant
  isDrugTarget: boolean;
  druggabilityClass?: string;
  chromosomeLocation?: string;
}

// ------------------------------------------
// Target Types & Prioritization
// ------------------------------------------
export interface TargetScoreBreakdown {
  diseaseAssociation: number; // 0-100
  omicsEvidence: number; // 0-100
  networkCentrality: number; // 0-100
  pathwayRelevance: number; // 0-100
  druggability: number; // 0-100
  structuralEvidence: number; // 0-100
  literatureSupport: number; // 0-100
}

export interface TargetEntity {
  id: string;
  geneSymbol: string;
  targetName: string;
  uniprotId: string;
  targetClass: 'Kinase' | 'GPCR' | 'Ion Channel' | 'Nuclear Receptor' | 'Enzyme' | 'Epigenetic' | 'Transporter' | 'Other';
  compositeScore: number; // 0-100
  scores: TargetScoreBreakdown;
  rationale: string; // Narrative evidence chain
  diseaseAssociationSummary: string;
  omicsSummary: string;
  networkSummary: string;
  pathwaySummary: string;
  druggabilitySummary: string;
  structuralSummary: string;
  literatureCount: number;
  pdbCount: number;
  bestPdbId?: string;
  resolution?: string;
  validationStatus: 'Investigated' | 'Preclinical Target' | 'Validated Target' | 'Novel Hypothesis';
  provenance: ProvenanceMeta;
}

// ------------------------------------------
// Biological Network Types
// ------------------------------------------
export type NetworkNodeType = 'disease' | 'gene' | 'protein' | 'target' | 'pathway' | 'drug';

export interface NetworkNode {
  id: string;
  label: string;
  type: NetworkNodeType;
  degree: number;
  betweenness: number;
  closeness: number;
  pagerank: number;
  cluster: number;
  val: number; // Node size
  color?: string;
  details?: Record<string, any>;
}

export interface NetworkLink {
  source: string;
  target: string;
  interactionType: 'regulates' | 'binds' | 'participates_in' | 'targets' | 'associated_with' | 'inhibits';
  confidenceScore: number; // 0.0 - 1.0 (e.g. STRING combined score)
  evidenceType: 'experimental' | 'textmining' | 'coexpression' | 'database';
}

export interface BiologicalNetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
  summary: {
    totalNodes: number;
    totalEdges: number;
    averageDegree: number;
    density: number;
    modularity: number;
  };
}

// ------------------------------------------
// Pathway Types
// ------------------------------------------
export interface PathwayEntity {
  id: string;
  name: string;
  database: 'Reactome' | 'KEGG' | 'WikiPathways' | 'Gene Ontology';
  geneCount: number;
  overlapGenes: string[];
  overlapCount: number;
  pValue: number;
  fdr: number;
  enrichmentRatio: number;
  category: string;
  provenance: ProvenanceMeta;
}

// ------------------------------------------
// Structural Biology & Binding Pockets
// ------------------------------------------
export interface ProteinStructureEntity {
  pdbId: string;
  uniprotId: string;
  geneSymbol: string;
  title: string;
  experimentalMethod: 'X-ray Diffraction' | 'Cryo-EM' | 'NMR' | 'AlphaFold v2 (Predicted)';
  resolution?: string;
  chains: string[];
  boundLigands: {
    id: string;
    name: string;
    chemblId?: string;
    formula?: string;
  }[];
  isAlphaFold: boolean;
  plddtConfidence?: number; // For AlphaFold
  provenance: ProvenanceMeta;
}

export interface BindingPocket {
  pocketId: string;
  proteinPdbId: string;
  pocketName: string;
  isExperimental: boolean; // True if co-crystallized with ligand, False if predicted via fpocket/DoGSite
  predictionMethod?: string;
  volumeA3: number;
  druggabilityScore: number; // 0.0 - 1.0
  centerCoords: { x: number; y: number; z: number };
  boxDimensions: { sizeX: number; sizeY: number; sizeZ: number };
  keyResidues: string[];
  knownLigandInPocket?: string;
  surfacePolarity: 'Hydrophobic' | 'Amphiphilic' | 'Charged' | 'Polar';
}

// ------------------------------------------
// Docking Planner Types
// ------------------------------------------
export type DockingStrategy =
  | 'redocking'
  | 'cross_docking'
  | 'virtual_screening'
  | 'comparative_repurposing';

export interface DockingSetupConfig {
  id: string;
  strategy: DockingStrategy;
  receptorTargetId: string;
  receptorPdbId: string;
  pocketId: string;
  gridCenter: { x: number; y: number; z: number };
  gridSize: { sizeX: number; sizeY: number; sizeZ: number };
  exhaustiveness: number;
  energyRange: number;
  numPoses: number;
  selectedLigandIds: string[];
  receptorPrepared: boolean;
  ligandsPrepared: boolean;
  backendConnected: boolean;
  backendUrl: string;
  vinaConfigText: string;
  cliCommand: string;
}

// ------------------------------------------
// Molecule & Drug Repurposing Types
// ------------------------------------------
export interface MoleculeEntity {
  id: string; // e.g. 'CHEMBL25' or 'DB00530'
  name: string;
  genericName?: string;
  tradeNames?: string[];
  smiles: string;
  inchiKey: string;
  molecularWeight: number;
  logP: number;
  tpsa: number; // Topological polar surface area
  hBondDonors: number;
  hBondAcceptors: number;
  rotatableBonds: number;
  lipinskiRuleViolations: number;
  highestDevelopmentPhase: 'Approved' | 'Phase 3' | 'Phase 2' | 'Phase 1' | 'Preclinical';
  originalIndications: string[];
  primaryTargets: string[];
  mechanismOfAction: string;
  availability: 'Available / Off-patent' | 'Generic' | 'Generic / Off-patent' | 'Patent-Protected' | 'Patent-Protected (Select regions off-patent)' | 'Available / Patent Near Expiry' | 'Investigational';
  provenance: ProvenanceMeta;
}

export interface DrugRepurposingHypothesis {
  drugId: string;
  drugName: string;
  smiles: string;
  originalIndications: string[];
  targetGene: string;
  targetUniprot: string;
  repurposingScore: number; // 0-100
  scoreBreakdown: {
    targetOverlap: number;
    pathwayRelevance: number;
    diseaseEvidence: number;
    structuralCompatibility: number;
    literatureSupport: number;
    pharmacologyFit: number;
  };
  hypothesisRationale: string;
  evidenceType: 'Mechanistic' | 'Phenotypic' | 'Literature Supported' | 'Structural Pocket Fit';
  structuralReadiness: 'Ready for Docking' | 'High-Res Complex Available' | 'AlphaFold Ready';
  clinicalPrecedent: string;
  isDemo: boolean;
}

// ------------------------------------------
// Molecular Optimization & Analogue Hypotheses
// ------------------------------------------
export interface AnalogueHypothesis {
  analogueId: string;
  parentDrugId: string;
  parentDrugName: string;
  proposedModifications: string;
  modificationType: 'Scaffold Hop' | 'Bioisosteric Replacement' | 'R-group Optimization' | 'Polarity Tuning';
  smiles: string;
  molecularWeight: number;
  logP: number;
  tpsa: number;
  predictedTargetCompatibility: 'High' | 'Moderate' | 'Exploratory';
  rationale: string;
  disclaimer: 'Computational analogue hypothesis — Not an approved drug or validated therapeutic';
}

// ------------------------------------------
// ADMET Profile Types
// ------------------------------------------
export interface AdmetProperty {
  category: 'Absorption' | 'Distribution' | 'Metabolism' | 'Excretion' | 'Toxicity';
  property: string;
  value: string | number;
  unit?: string;
  interpretation: 'Favorable' | 'Moderate' | 'Unfavorable' | 'Neutral';
  dataSource: 'Experimental (ChEMBL)' | 'Database (DrugBank)' | 'In Silico QSAR Prediction (SwissADME/pkCSM)';
  confidence?: 'High' | 'Medium' | 'Low';
}

export interface AdmetProfile {
  drugId: string;
  drugName: string;
  properties: AdmetProperty[];
  radarMetrics: {
    lipophilicity: number; // 0-100
    solubility: number;
    permeability: number;
    metabolicStability: number;
    safetyMargin: number;
    bioavailability: number;
  };
}

// ------------------------------------------
// Literature Intelligence Types
// ------------------------------------------
export interface LiteratureArticle {
  id: string; // PMID or PMCID or DOI
  pmid?: string;
  pmcid?: string;
  doi?: string;
  title: string;
  authors: string[];
  journal: string;
  publicationYear: number;
  abstract: string;
  source: 'Europe PMC' | 'PubMed' | 'OpenAlex' | 'NCBI';
  url: string;
  meshTerms?: string[];
  relevanceKeywords: string[];
  evidenceSummary: string;
}

// ------------------------------------------
// Next-Best Experiment Roadmap
// ------------------------------------------
export interface NextBestExperiment {
  priority: 'Tier 1 (Immediate)' | 'Tier 2 (Secondary)' | 'Tier 3 (Translational)';
  category: 'Target Validation' | 'Biophysical Assay' | 'Cellular Viability' | 'Structural Confirmation' | 'ADME Assay';
  title: string;
  methodology: string;
  recommendedAssay: string;
  candidateMolecules: string[];
  targetGene: string;
  expectedReadout: string;
  successCriteria: string;
  estimatedTurnaround: string;
  disclaimer: 'Research hypothesis for preclinical experimental design. Not clinical advice.';
}

// ------------------------------------------
// Research Project State
// ------------------------------------------
export interface ResearchProject {
  id: string;
  title: string;
  disease: DiseaseEntity | null;
  selectedTarget: TargetEntity | null;
  selectedStructure: ProteinStructureEntity | null;
  selectedPocket: BindingPocket | null;
  selectedDrug: MoleculeEntity | null;
  activeStrategy: DockingStrategy;
  dockingConfig: DockingSetupConfig | null;
  isDemoMode: boolean;
  createdAt: string;
  lastModified: string;
}
