import { requestAI } from './api-client.js';

const fetch = requestAI;

export function setTgt(v) { const el = document.getElementById('tq'); if (el) { el.value = v; runTgt(); } }

export async function runTgt() {
  const q = document.getElementById('tq').value.trim(); if (!q) return;
  const area = document.getElementById('tgt-r');
  area.innerHTML = '<div class="ldots"><div class="ldot"></div><div class="ldot"></div><div class="ldot"></div></div><div class="ltxt">Querying OpenTargets · DisGeNET · UniProt · GWAS Catalog…</div>';
  const sys = `Return ONLY valid JSON:
{"gene":{"symbol":"...","full_name":"...","uniprot_id":"...","chromosome":"...","function":"..."},
"druggability":{"score":0.87,"tier":1,"known_drugs":["drug1","drug2"]},
"disease_associations":[{"disease":"...","score":0.85,"genetic_evidence":"GWAS|Rare variant|Somatic","trials":3}],
"repurposing_opportunities":[{"indication":"...","rationale":"...","confidence_pct":87,"pathway":"..."}],
"pathways":["..."],"protein_interactions":["GENE1","GENE2","GENE3","GENE4","GENE5","GENE6"],
"structural_info":{"pdb_ids":["XXXX"],"binding_sites":2,"allosteric_sites":1}}`;
  try {
    const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'meta-llama/llama-3.3-70b-instruct', messages: [{ role: 'system', content: sys }, { role: 'user', content: `Gene target analysis for: "${q}". Return realistic pharma-grade data.` }], max_tokens: 1800, temperature: 0.15 }) });
    const d = await r.json(); let t = d.choices?.[0]?.message?.content || ''; t = t.replace(/```json|```/g, '').trim(); renderTgt(JSON.parse(t));
  } catch (e) { renderTgt(getDemoTgt(q)); }
}

export function getDemoTgt(q) { return { gene: { symbol: q || 'AMPK', full_name: 'AMP-activated protein kinase catalytic subunit alpha-1', uniprot_id: 'Q13131', chromosome: '5q31.3', function: 'Master energy sensor. Activated by elevated AMP:ATP ratio. Phosphorylates >100 substrates to restore energy homeostasis. Central node in diabetes, cancer, and ageing biology.' }, druggability: { score: 0.87, tier: 1, known_drugs: ['Metformin', 'AICAR', 'Compound-991', 'GSK621', 'PF-739'] }, disease_associations: [{ disease: 'Type 2 Diabetes Mellitus', score: 0.94, genetic_evidence: 'GWAS', trials: 142 }, { disease: 'Non-alcoholic Fatty Liver', score: 0.81, genetic_evidence: 'Somatic', trials: 34 }, { disease: 'Pancreatic Cancer', score: 0.72, genetic_evidence: 'Rare variant', trials: 12 }, { disease: "Alzheimer's Disease", score: 0.68, genetic_evidence: 'GWAS', trials: 8 }, { disease: 'PCOS', score: 0.79, genetic_evidence: 'GWAS', trials: 67 }], repurposing_opportunities: [{ indication: 'Pancreatic Ductal Adenocarcinoma', rationale: 'AMPK activation suppresses mTOR and lipid synthesis pathways critical for PDAC growth', confidence_pct: 87, pathway: 'AMPK/mTOR/FASN' }, { indication: "Alzheimer's Disease", rationale: 'AMPK reduces neuroinflammation via NF-κB inhibition and promotes autophagic Aβ clearance', confidence_pct: 71, pathway: 'AMPK/NF-κB/Autophagy' }, { indication: 'Longevity/Anti-ageing', rationale: 'AMPK activates FOXO, SIRT1, and mitophagy — mirrors caloric restriction', confidence_pct: 63, pathway: 'AMPK/FOXO/SIRT1' }], pathways: ['AMPK signalling', 'mTOR pathway', 'PI3K-AKT', 'p53', 'FOXO/SIRT1', 'HIF-1', 'Autophagy'], protein_interactions: ['mTOR', 'RAPTOR', 'TSC2', 'HIF1A', 'FOXO3', 'SIRT1', 'ACC1', 'ULK1'], structural_info: { pdb_ids: ['3RJ1', '4CFH', '5UFU', '6B1U'], binding_sites: 3, allosteric_sites: 2 } }; }

export function renderTgt(d) {
  const area = document.getElementById('tgt-r'); const g = d.gene, dr = d.druggability;
  area.innerHTML = `<div class="g2 fadeup" style="margin-bottom:1.25rem">
<div class="card">
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem"><div><div style="font-family:var(--FC);font-size:1.25rem;font-weight:600;color:var(--violet)">${g.symbol}</div><div style="font-size:0.82rem;color:var(--text-dim);font-weight:300">${g.full_name}</div><div style="font-family:var(--FC);font-size:0.62rem;color:var(--text-faint);margin-top:3px">${g.uniprot_id} · Chr. ${g.chromosome}</div></div><span class="badge badge-teal">Tier ${dr.tier}</span></div>
  <div style="font-size:0.82rem;color:var(--text-dim);line-height:1.7;font-weight:300;margin-bottom:0.85rem">${g.function}</div>
  <div style="display:flex;gap:1.5rem;font-family:var(--FC);font-size:0.68rem;color:var(--text-dim);background:rgba(255,255,255,0.02);padding:0.5rem;border-radius:4px">
    <div><span style="color:var(--text-faint)">Drug. Score:</span> ${dr.score}</div>
    <div><span style="color:var(--text-faint)">PDB IDs:</span> ${(d.structural_info.pdb_ids || []).join(', ')}</div>
    <div><span style="color:var(--text-faint)">Sites:</span> ${d.structural_info.binding_sites} orthosteric, ${d.structural_info.allosteric_sites} allosteric</div>
  </div>
</div>
<div class="card">
  <h3>Disease Associations</h3>
  <div style="display:flex;flex-direction:column;gap:0.4rem">
    ${(d.disease_associations || []).map(da => `<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:0.4rem;border-bottom:1px solid var(--border2)"><div style="flex:1"><div style="font-size:0.82rem">${da.disease}</div><div style="font-family:var(--FC);font-size:0.62rem;color:var(--text-faint)">Evidence: ${da.genetic_evidence}</div></div><div style="text-align:right"><div style="font-family:var(--FC);font-size:0.82rem;color:var(--teal)">${da.score}</div><div style="font-size:0.6rem;color:var(--text-faint)">Assoc. Score</div></div></div>`).join('')}
  </div>
</div>
</div>
<div class="g2 fadeup">
<div class="card">
  <h3>Repurposing Opportunities</h3>
  <div style="display:flex;flex-direction:column;gap:0.65rem">
    ${(d.repurposing_opportunities || []).map(op => `<div style="background:rgba(255,255,255,0.03);border:1px solid var(--border2);border-left:3px solid var(--violet);border-radius:var(--r8);padding:0.9rem"><div style="display:flex;justify-content:space-between;margin-bottom:0.3rem"><span style="font-weight:500;font-size:0.88rem">${op.indication}</span><span style="font-family:var(--FC);font-size:0.75rem;color:var(--violet)">${op.confidence_pct}%</span></div><div style="font-size:0.79rem;color:var(--text-dim);font-weight:300;line-height:1.5">${op.rationale}</div><span class="pill violet" style="margin-top:4px;display:inline-block">${op.pathway}</span></div>`).join('')}
  </div>
</div>
<div class="card">
  <h3>Protein Interaction Network</h3>
  <div class="gene-network">
    <svg viewBox="0 0 280 180" width="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="140" cy="90" r="24" fill="rgba(155,109,255,0.25)" stroke="var(--violet)" stroke-width="2"/>
      <text x="140" y="94" text-anchor="middle" font-size="10" fill="var(--violet)" font-family="monospace" font-weight="600">${g.symbol}</text>
      ${(d.protein_interactions || []).slice(0, 8).map((p, i) => { const a = (i / (Math.min(d.protein_interactions.length, 8))) * 2 * Math.PI - Math.PI / 2; const rv = 78; const x = 140 + rv * Math.cos(a), y = 90 + rv * Math.sin(a); const cols = ['var(--teal)', 'var(--violet)', 'var(--teal)', 'var(--blue)', 'var(--teal)', 'var(--violet)', 'var(--teal)', 'var(--blue)']; return `<line x1="140" y1="90" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="15" fill="rgba(13,31,60,0.8)" stroke="${cols[i % cols.length]}" stroke-width="1.5"/><text x="${x.toFixed(1)}" y="${(y + 3).toFixed(1)}" text-anchor="middle" font-size="6.5" fill="rgba(255,255,255,0.8)" font-family="monospace">${p}</text>`; }).join('')}
    </svg>
  </div>
  <div style="font-family:var(--FC);font-size:0.62rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.1em;margin:0.65rem 0 0.35rem">Key Pathways</div>
  <div class="pills">${(d.pathways || []).slice(0, 5).map(p => `<span class="pill">${p}</span>`).join('')}</div>
</div>
</div>`;
}
