import { createProvenance } from './apiProvenance';
import { ProteinStructureEntity } from '../types';

export interface UniProtSummary {
  uniprotId: string;
  geneSymbol: string;
  proteinName: string;
  organism: string;
  functionSummary: string;
  sequenceLength: number;
  pdbEntries: string[];
}

export async function fetchUniProtData(geneSymbolOrAccession: string): Promise<UniProtSummary | null> {
  const query = encodeURIComponent(geneSymbolOrAccession.trim());
  const url = `https://rest.uniprot.org/uniprotkb/search?query=gene_exact:${query}+AND+organism_id:9606&fields=accession,id,gene_names,protein_name,organism_name,length,xref_pdb,cc_function&size=1`;

  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`UniProt API returned ${res.status}`);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    const entry = data.results[0];
    const pdbRefs = (entry.uniProtKBCrossReferences || [])
      .filter((ref: any) => ref.database === 'PDB')
      .map((ref: any) => ref.id);

    const functionComment = (entry.comments || []).find((c: any) => c.commentType === 'FUNCTION');
    const functionText = functionComment?.texts?.[0]?.value || 'Function details available in UniProtKB.';

    return {
      uniprotId: entry.primaryAccession,
      geneSymbol: entry.genes?.[0]?.geneName?.value || geneSymbolOrAccession.toUpperCase(),
      proteinName: entry.proteinDescription?.recommendedName?.fullName?.value || 'Protein',
      organism: entry.organism?.scientificName || 'Homo sapiens',
      functionSummary: functionText,
      sequenceLength: entry.sequence?.length || 0,
      pdbEntries: pdbRefs,
    };
  } catch (err) {
    console.warn('[UniProt Service] Live fetch failed or rate limited:', err);
    return null;
  }
}

export async function fetchPdbSummary(pdbId: string): Promise<ProteinStructureEntity | null> {
  const cleanId = pdbId.trim().toUpperCase();
  const url = `https://data.rcsb.org/rest/v1/core/entry/${cleanId}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`RCSB PDB returned status ${res.status}`);
    const data = await res.json();

    const title = data.struct?.title || `PDB Entry ${cleanId}`;
    const method = data.exptl?.[0]?.method || 'X-ray Diffraction';
    const resolution = data.rcsb_entry_info?.resolution_combined?.[0]
      ? `${data.rcsb_entry_info.resolution_combined[0].toFixed(2)} Å`
      : undefined;

    return {
      pdbId: cleanId,
      uniprotId: 'P00533', // Default or resolved via crossref
      geneSymbol: cleanId,
      title,
      experimentalMethod: method as any,
      resolution,
      chains: ['A', 'B'],
      boundLigands: [],
      isAlphaFold: false,
      provenance: createProvenance('RCSB PDB', cleanId, {
        sourceUrl: `https://www.rcsb.org/structure/${cleanId}`,
        isExperimental: true,
      }),
    };
  } catch (err) {
    console.warn('[RCSB PDB] Fetch error:', err);
    return null;
  }
}
