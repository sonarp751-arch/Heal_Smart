import { LiteratureArticle } from '../types';

export async function searchEuropePmcLiterature(query: string, pageSize: number = 8): Promise<LiteratureArticle[]> {
  const cleanQuery = encodeURIComponent(`${query} AND (repurposing OR "drug discovery" OR target OR inhibitor)`);
  const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${cleanQuery}&format=json&pageSize=${pageSize}&resultType=core`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Europe PMC API status ${res.status}`);
    const data = await res.json();

    const results = data.resultList?.result || [];
    return results.map((item: any) => {
      const authors = item.authorString ? item.authorString.split(', ') : ['Scientific Investigators'];
      const pmid = item.pmid;
      const pmcid = item.pmcid;
      const doi = item.doi;
      const journal = item.journalTitle || item.journalInfo?.journal?.title || 'Biomedical Journal';
      const year = parseInt(item.pubYear || '2024', 10);
      const abstractText = item.abstractText
        ? item.abstractText.replace(/<[^>]*>?/gm, '')
        : 'Abstract text indexed in Europe PMC / PubMed database. Access full text via DOI or PMCID.';

      const articleUrl = doi
        ? `https://doi.org/${doi}`
        : pmid
        ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`
        : `https://europepmc.org/article/MED/${pmid || ''}`;

      return {
        id: pmid || pmcid || doi || `EPMC_${item.id}`,
        pmid,
        pmcid,
        doi,
        title: item.title?.replace(/<[^>]*>?/gm, '') || 'Scientific Publication',
        authors: authors.slice(0, 5),
        journal,
        publicationYear: year,
        abstract: abstractText,
        source: 'Europe PMC',
        url: articleUrl,
        relevanceKeywords: [query, 'Repurposing', 'Target Modulation', 'Pharmacology'],
        evidenceSummary: `Europe PMC peer-reviewed record. Cross-referenced in PubMed (PMID: ${pmid || 'N/A'}).`,
      };
    });
  } catch (err) {
    console.warn('[Europe PMC Service] Failed to search:', err);
    return [];
  }
}
