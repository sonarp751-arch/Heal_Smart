import { BiologicalNetworkData, PathwayEntity } from '../types';
import { createProvenance } from '../services/apiProvenance';

export const DEMO_NETWORK_DATA: BiologicalNetworkData = {
  nodes: [
    { id: 'EFO_GBM', label: 'Glioblastoma Multiforme', type: 'disease', degree: 8, betweenness: 0.65, closeness: 0.72, pagerank: 0.18, cluster: 1, val: 24, color: '#F43F5E' },
    
    // Core Targets / Genes
    { id: 'EGFR', label: 'EGFR', type: 'target', degree: 7, betweenness: 0.52, closeness: 0.68, pagerank: 0.14, cluster: 1, val: 18, color: '#22D3EE', details: { uniprot: 'P00533', class: 'Kinase', score: 94.2 } },
    { id: 'PARP1', label: 'PARP1', type: 'target', degree: 6, betweenness: 0.44, closeness: 0.61, pagerank: 0.11, cluster: 2, val: 16, color: '#22D3EE', details: { uniprot: 'P09874', class: 'Enzyme', score: 89.6 } },
    { id: 'CDK4', label: 'CDK4', type: 'target', degree: 5, betweenness: 0.38, closeness: 0.58, pagerank: 0.09, cluster: 3, val: 15, color: '#22D3EE', details: { uniprot: 'P11802', class: 'Kinase', score: 87.4 } },
    { id: 'HDAC1', label: 'HDAC1', type: 'target', degree: 5, betweenness: 0.34, closeness: 0.55, pagerank: 0.08, cluster: 2, val: 14, color: '#22D3EE', details: { uniprot: 'Q13547', class: 'Epigenetic', score: 82.8 } },
    { id: 'VEGFA', label: 'VEGFA', type: 'gene', degree: 4, betweenness: 0.28, closeness: 0.51, pagerank: 0.07, cluster: 1, val: 12, color: '#38BDF8' },
    { id: 'MGMT', label: 'MGMT', type: 'gene', degree: 4, betweenness: 0.25, closeness: 0.48, pagerank: 0.06, cluster: 2, val: 12, color: '#38BDF8' },
    { id: 'PTEN', label: 'PTEN', type: 'gene', degree: 4, betweenness: 0.31, closeness: 0.52, pagerank: 0.06, cluster: 1, val: 12, color: '#38BDF8' },
    { id: 'STAT3', label: 'STAT3', type: 'gene', degree: 4, betweenness: 0.29, closeness: 0.50, pagerank: 0.06, cluster: 1, val: 12, color: '#38BDF8' },

    // Pathways
    { id: 'PW_EGFR_SIG', label: 'Signaling by EGFR / ERBB', type: 'pathway', degree: 5, betweenness: 0.42, closeness: 0.62, pagerank: 0.10, cluster: 1, val: 16, color: '#A855F7' },
    { id: 'PW_DNA_REPAIR', label: 'Base Excision / DNA Damage Repair', type: 'pathway', degree: 4, betweenness: 0.36, closeness: 0.56, pagerank: 0.08, cluster: 2, val: 15, color: '#A855F7' },
    { id: 'PW_CELL_CYCLE', label: 'G1/S Cell Cycle Transition', type: 'pathway', degree: 4, betweenness: 0.33, closeness: 0.54, pagerank: 0.07, cluster: 3, val: 15, color: '#A855F7' },

    // Candidate Repurposed Drugs
    { id: 'DRUG_ERLOTINIB', label: 'Erlotinib', type: 'drug', degree: 3, betweenness: 0.21, closeness: 0.49, pagerank: 0.06, cluster: 1, val: 14, color: '#10B981', details: { phase: 'Approved', original: 'NSCLC' } },
    { id: 'DRUG_OLAPARIB', label: 'Olaparib', type: 'drug', degree: 3, betweenness: 0.19, closeness: 0.46, pagerank: 0.05, cluster: 2, val: 14, color: '#10B981', details: { phase: 'Approved', original: 'Ovarian Cancer' } },
    { id: 'DRUG_PALBOCICLIB', label: 'Palbociclib', type: 'drug', degree: 3, betweenness: 0.18, closeness: 0.45, pagerank: 0.05, cluster: 3, val: 14, color: '#10B981', details: { phase: 'Approved', original: 'Breast Cancer' } },
    { id: 'DRUG_VORINOSTAT', label: 'Vorinostat', type: 'drug', degree: 3, betweenness: 0.16, closeness: 0.43, pagerank: 0.04, cluster: 2, val: 14, color: '#10B981', details: { phase: 'Approved', original: 'Lymphoma' } },
  ],
  links: [
    { source: 'EFO_GBM', target: 'EGFR', interactionType: 'associated_with', confidenceScore: 0.98, evidenceType: 'experimental' },
    { source: 'EFO_GBM', target: 'PARP1', interactionType: 'associated_with', confidenceScore: 0.88, evidenceType: 'database' },
    { source: 'EFO_GBM', target: 'CDK4', interactionType: 'associated_with', confidenceScore: 0.92, evidenceType: 'experimental' },
    { source: 'EFO_GBM', target: 'HDAC1', interactionType: 'associated_with', confidenceScore: 0.78, evidenceType: 'textmining' },
    { source: 'EFO_GBM', target: 'VEGFA', interactionType: 'associated_with', confidenceScore: 0.94, evidenceType: 'experimental' },
    { source: 'EFO_GBM', target: 'MGMT', interactionType: 'associated_with', confidenceScore: 0.95, evidenceType: 'experimental' },
    { source: 'EFO_GBM', target: 'PTEN', interactionType: 'associated_with', confidenceScore: 0.91, evidenceType: 'experimental' },
    
    // Target - Pathway links
    { source: 'EGFR', target: 'PW_EGFR_SIG', interactionType: 'participates_in', confidenceScore: 0.99, evidenceType: 'database' },
    { source: 'STAT3', target: 'PW_EGFR_SIG', interactionType: 'participates_in', confidenceScore: 0.86, evidenceType: 'database' },
    { source: 'PTEN', target: 'PW_EGFR_SIG', interactionType: 'regulates', confidenceScore: 0.89, evidenceType: 'experimental' },
    
    { source: 'PARP1', target: 'PW_DNA_REPAIR', interactionType: 'participates_in', confidenceScore: 0.99, evidenceType: 'database' },
    { source: 'MGMT', target: 'PW_DNA_REPAIR', interactionType: 'participates_in', confidenceScore: 0.92, evidenceType: 'database' },
    { source: 'HDAC1', target: 'PW_DNA_REPAIR', interactionType: 'regulates', confidenceScore: 0.74, evidenceType: 'experimental' },
    
    { source: 'CDK4', target: 'PW_CELL_CYCLE', interactionType: 'participates_in', confidenceScore: 0.98, evidenceType: 'database' },

    // Drug - Target links
    { source: 'DRUG_ERLOTINIB', target: 'EGFR', interactionType: 'inhibits', confidenceScore: 0.98, evidenceType: 'experimental' },
    { source: 'DRUG_OLAPARIB', target: 'PARP1', interactionType: 'inhibits', confidenceScore: 0.97, evidenceType: 'experimental' },
    { source: 'DRUG_PALBOCICLIB', target: 'CDK4', interactionType: 'inhibits', confidenceScore: 0.96, evidenceType: 'experimental' },
    { source: 'DRUG_VORINOSTAT', target: 'HDAC1', interactionType: 'inhibits', confidenceScore: 0.94, evidenceType: 'experimental' },
  ],
  summary: {
    totalNodes: 16,
    totalEdges: 18,
    averageDegree: 2.25,
    density: 0.15,
    modularity: 0.58,
  },
};

export const DEMO_PATHWAYS: PathwayEntity[] = [
  {
    id: 'R-HSA-177929',
    name: 'Signaling by Receptor Tyrosine Kinases (EGFR / ERBB family)',
    database: 'Reactome',
    geneCount: 148,
    overlapGenes: ['EGFR', 'VEGFA', 'STAT3', 'PTEN', 'PIK3CA', 'AKT1', 'GRB2'],
    overlapCount: 7,
    pValue: 1.4e-12,
    fdr: 3.2e-10,
    enrichmentRatio: 4.8,
    category: 'Signal Transduction',
    provenance: createProvenance('Reactome Pathway Knowledgebase', 'R-HSA-177929', {
      sourceUrl: 'https://reactome.org/content/detail/R-HSA-177929',
      isExperimental: true,
      isDemo: true,
    }),
  },
  {
    id: 'R-HSA-73884',
    name: 'Base Excision Repair (BER) & DNA Strand Break Response',
    database: 'Reactome',
    geneCount: 64,
    overlapGenes: ['PARP1', 'MGMT', 'XRCC1', 'LIG3', 'POLB'],
    overlapCount: 5,
    pValue: 3.8e-09,
    fdr: 4.5e-07,
    enrichmentRatio: 6.2,
    category: 'DNA Repair & Maintenance',
    provenance: createProvenance('Reactome Pathway Knowledgebase', 'R-HSA-73884', {
      sourceUrl: 'https://reactome.org/content/detail/R-HSA-73884',
      isExperimental: true,
      isDemo: true,
    }),
  },
  {
    id: 'R-HSA-69206',
    name: 'G1/S Transition & Cyclin D:CDK4/6 Activation',
    database: 'Reactome',
    geneCount: 82,
    overlapGenes: ['CDK4', 'CDK6', 'RB1', 'CCND1', 'E2F1'],
    overlapCount: 5,
    pValue: 7.2e-08,
    fdr: 6.1e-06,
    enrichmentRatio: 5.1,
    category: 'Cell Cycle Control',
    provenance: createProvenance('Reactome Pathway Knowledgebase', 'R-HSA-69206', {
      sourceUrl: 'https://reactome.org/content/detail/R-HSA-69206',
      isExperimental: true,
      isDemo: true,
    }),
  },
  {
    id: 'R-HSA-3247509',
    name: 'Chromatin Organization & HDAC Transcriptional Repression',
    database: 'Reactome',
    geneCount: 112,
    overlapGenes: ['HDAC1', 'HDAC2', 'SIN3A', 'MBD3', 'RBBP4'],
    overlapCount: 5,
    pValue: 4.1e-06,
    fdr: 2.2e-04,
    enrichmentRatio: 3.9,
    category: 'Epigenetic Regulation',
    provenance: createProvenance('Reactome Pathway Knowledgebase', 'R-HSA-3247509', {
      sourceUrl: 'https://reactome.org/content/detail/R-HSA-3247509',
      isExperimental: true,
      isDemo: true,
    }),
  },
];
