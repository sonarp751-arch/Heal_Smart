import { createProvenance } from './apiProvenance';
import { MoleculeEntity } from '../types';

export async function fetchPubChemCompound(queryNameOrSmiles: string): Promise<MoleculeEntity | null> {
  const query = encodeURIComponent(queryNameOrSmiles.trim());
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${query}/property/MolecularWeight,XLogP,TPSA,HBondDonorCount,HBondAcceptorCount,RotatableBondCount,CanonicalSMILES,InChIKey/JSON`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`PubChem returned ${res.status}`);
    const data = await res.json();

    const prop = data.PropertyTable?.Properties?.[0];
    if (!prop) return null;

    const mw = parseFloat(prop.MolecularWeight || '0');
    const logP = parseFloat(prop.XLogP || '0');
    const hbd = parseInt(prop.HBondDonorCount || '0', 10);
    const hba = parseInt(prop.HBondAcceptorCount || '0', 10);
    const rotB = parseInt(prop.RotatableBondCount || '0', 10);
    const tpsa = parseFloat(prop.TPSA || '0');

    // Lipinski Rule of 5 violations
    let violations = 0;
    if (mw > 500) violations++;
    if (logP > 5) violations++;
    if (hbd > 5) violations++;
    if (hba > 10) violations++;

    return {
      id: `CID_${prop.CID}`,
      name: queryNameOrSmiles,
      genericName: queryNameOrSmiles,
      smiles: prop.CanonicalSMILES || '',
      inchiKey: prop.InChIKey || '',
      molecularWeight: mw,
      logP: logP,
      tpsa: tpsa,
      hBondDonors: hbd,
      hBondAcceptors: hba,
      rotatableBonds: rotB,
      lipinskiRuleViolations: violations,
      highestDevelopmentPhase: 'Approved',
      originalIndications: ['Database query result'],
      primaryTargets: ['Target annotation available in ChEMBL'],
      mechanismOfAction: 'Small molecule pharmacophore',
      availability: 'Available / Off-patent',
      provenance: createProvenance('PubChem PUG-REST', `CID:${prop.CID}`, {
        sourceUrl: `https://pubchem.ncbi.nlm.nih.gov/compound/${prop.CID}`,
        isExperimental: true,
      }),
    };
  } catch (err) {
    console.warn('[PubChem Service] Fetch failed or not found:', err);
    return null;
  }
}
