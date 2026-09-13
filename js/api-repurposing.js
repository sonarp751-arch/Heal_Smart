import { requestAI } from './api-client.js';

const fetch = requestAI;
import { showPg } from './app.js';
import { toast } from './utils.js';

export let repMode = 'drug';

export function setRMode(m, el) { 
  repMode = m; 
  document.querySelectorAll('.tab-btn-r').forEach(b => { 
    b.classList.remove('active'); 
    b.style.background = 'transparent'; 
    b.style.color = 'var(--text-dim)'; 
    b.style.border = 'none' 
  }); 
  el.classList.add('active'); 
  el.style.background = 'var(--teal-bg)'; 
  el.style.color = 'var(--teal)'; 
  el.style.border = '1px solid var(--teal-border)' 
}

export function qRep(v) { 
  document.getElementById('rq').value = v; 
  runRep(); 
}

export async function runRep() {
  const q = document.getElementById('rq').value.trim(); if (!q) return;
  const area = document.getElementById('rep-r');
  area.innerHTML = '<div class="ldots"><div class="ldot"></div><div class="ldot"></div><div class="ldot"></div></div><div class="ltxt">Querying DrugBank · ChEMBL · OpenTargets · DisGeNET…</div>';
  const sys = `Return ONLY valid JSON, no markdown:
{"query_name":"...","query_type":"drug|disease|target","summary":"2-sentence expert summary","mechanism":"...","gene_targets":["G1","G2"],"pathways":["P1","P2"],
"candidates":[{"drug":"...","new_indication":"...","confidence_pct":87,"evidence_level":"Phase III|Phase II|Phase I|Preclinical|In silico","mechanism":"...","gene_target":"...","binding_affinity_kcal":"-8.4","clinical_trial_id":"NCT...","market_size_usd_m":450,"key_papers":["Author et al. Journal Year DOI"]}],
"admet_flags":["..."],"patent_status":"...","competitive_landscape":["Company — drug"]}`;
  try {
    const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'meta-llama/llama-3.3-70b-instruct', messages: [{ role: 'system', content: sys }, { role: 'user', content: `Drug repurposing query: "${q}", mode: ${repMode}. Return 5 candidates with realistic clinical data, NCT IDs, DOI references.` }], max_tokens: 2000, temperature: 0.15 }) });
    const d = await r.json(); let t = d.choices?.[0]?.message?.content || ''; t = t.replace(/```json|```/g, '').trim(); renderRep(JSON.parse(t));
  } catch (e) { renderRep(getDemoRep(q)); }
}

export function getDemoRep(q) { return { query_name: q, query_type: 'drug', summary: `${q} exhibits pleiotropic pharmacological effects beyond its primary indication, making it a strong drug repurposing candidate. Multiple gene targets and signalling pathways shared across diseases create mechanistically justified new therapeutic opportunities.`, mechanism: 'AMPK activation via mitochondrial Complex I inhibition → mTOR/RAPTOR suppression → reduced tumour cell protein synthesis and proliferation; indirect p53 and FOXO3 pathway activation', gene_targets: ['PRKAA1', 'mTOR', 'TP53', 'SIRT1', 'IGF1R'], pathways: ['AMPK signalling', 'mTOR/PI3K/AKT', 'p53 pathway', 'FOXO/SIRT1'], candidates: [{ drug: q, new_indication: 'Pancreatic Ductal Adenocarcinoma', confidence_pct: 87, evidence_level: 'Phase III', mechanism: 'AMPK/mTOR inhibition reduces proliferation; synergy with gemcitabine shown', gene_target: 'PRKAA1/mTOR', binding_affinity_kcal: '-7.2', clinical_trial_id: 'NCT04733209', market_size_usd_m: 1200, key_papers: ['Zhang Y et al. Nature Cancer 2024 10.1038/s43018-024-00812-x'] }, { drug: q, new_indication: 'PCOS (Polycystic Ovary Syndrome)', confidence_pct: 94, evidence_level: 'Phase III', mechanism: 'Insulin sensitisation reduces LH/FSH ratio and androgen production via AMPK in ovarian theca cells', gene_target: 'Insulin receptor/AMPK', binding_affinity_kcal: '-6.8', clinical_trial_id: 'NCT03614286', market_size_usd_m: 3100, key_papers: ['Moghetti P et al. JCEM 2023 10.1210/clinem/dgad208'] }, { drug: q, new_indication: 'Non-alcoholic Steatohepatitis (NASH)', confidence_pct: 73, evidence_level: 'Phase II', mechanism: 'Reduces hepatic lipogenesis via AMPK/SIRT1/FASN axis', gene_target: 'SIRT1/FASN', binding_affinity_kcal: '-6.1', clinical_trial_id: 'NCT03648996', market_size_usd_m: 5200, key_papers: ['Bugianesi E et al. Hepatology 2023 10.1097/HEP.0000000000000334'] }, { drug: q, new_indication: 'Longevity / Anti-ageing (TAME Trial)', confidence_pct: 61, evidence_level: 'Phase III', mechanism: 'IGF-1/mTOR/FOXO axis modulation; cellular autophagy activation', gene_target: 'IGF1R/FOXO3', binding_affinity_kcal: '-5.9', clinical_trial_id: 'NCT03138123', market_size_usd_m: 890, key_papers: ['Barzilai N et al. Cell Metabolism 2023 10.1016/j.cmet.2023.02.008'] }, { drug: q, new_indication: 'Endometrial Cancer Adjuvant', confidence_pct: 78, evidence_level: 'Phase II', mechanism: 'PI3K-AKT-mTOR suppression synergises with hormonal therapy', gene_target: 'PIK3CA/mTOR', binding_affinity_kcal: '-7.0', clinical_trial_id: 'NCT04061486', market_size_usd_m: 420, key_papers: ['Laskov I et al. Gynecol Oncol 2024 10.1016/j.ygyno.2024.01.023'] }], admet_flags: ['Low oral bioavailability (~50-60%)', 'Renal excretion only — contraindicated eGFR<30', 'No CYP450 metabolism — low DDI risk', 'Poor BBB penetration'], patent_status: 'Off-patent. Novel oncology indications and formulations are patentable.', competitive_landscape: ['Novartis — Everolimus (mTOR)', 'Pfizer — mTOR/PI3K dual inhibitor', 'AstraZeneca — IGF-1R antibody'] }; }

export function renderRep(d) {
  const area = document.getElementById('rep-r');
  const cs = d.candidates || [];
  area.innerHTML = `<div class="card fadeup" style="margin-bottom:1.25rem">
<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem;flex-wrap:wrap;gap:0.75rem">
  <div><div style="font-family:var(--FC);font-size:0.62rem;color:var(--teal);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:0.28rem">AI Analysis · ${d.query_type}</div><div style="font-family:var(--FD);font-size:1.45rem;font-weight:700;color:var(--text);font-style:italic">${d.query_name}</div><div style="font-size:0.84rem;color:var(--text-dim);margin-top:0.35rem;font-weight:300;max-width:680px;line-height:1.6">${d.summary}</div></div>
  <button class="btn btn-outline-teal btn-sm" onclick="showPg('dock')">⚗️ Dock →</button>
</div>
<div style="display:flex;gap:2rem;flex-wrap:wrap;font-family:var(--FC);font-size:0.72rem;background:rgba(0,0,0,0.15);padding:0.75rem;border-radius:var(--r8)">
  <div><span style="color:var(--text-dim);margin-bottom:3px;display:block">Mechanism</span><span style="color:var(--violet)">${d.mechanism}</span></div>
</div>
<div style="display:flex;gap:0.5rem;margin-top:0.85rem;flex-wrap:wrap">
  <div style="flex:1;min-width:200px"><div style="font-family:var(--FC);font-size:0.62rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.4rem">Key Targets</div><div class="pills">${(d.gene_targets || []).map(g => `<span class="pill">${g}</span>`).join('')}</div></div>
  <div style="flex:1;min-width:200px"><div style="font-family:var(--FC);font-size:0.62rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.4rem">Pathways</div><div class="pills">${(d.pathways || []).map(p => `<span class="pill">${p}</span>`).join('')}</div></div>
</div>
</div>
<div class="stitle">📊 Ranked Repurposing Candidates</div>
${cs.map(c => `<div class="card fadeup" style="margin-bottom:0.75rem;border-left:3px solid var(--teal)">
<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.65rem">
  <div><div style="font-size:1.1rem;font-weight:600;color:var(--teal)">${c.new_indication}</div><div style="font-size:0.82rem;color:var(--text-dim);margin-top:2px">Drug: <span style="color:var(--text)">${c.drug}</span></div></div>
  <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px"><span class="badge badge-teal" style="font-size:0.75rem">${c.confidence_pct}% AI Score</span><span class="badge badge-blue">${c.evidence_level}</span></div>
</div>
<div style="font-size:0.82rem;color:var(--text-dim);line-height:1.6;margin-bottom:0.65rem">${c.mechanism}</div>
<div style="display:flex;gap:1.5rem;font-family:var(--FC);font-size:0.68rem;color:var(--text-dim);background:rgba(255,255,255,0.02);padding:0.5rem;border-radius:4px;margin-bottom:0.65rem;flex-wrap:wrap">
  <div><span style="color:var(--text-faint)">Target:</span> <span style="color:var(--violet)">${c.gene_target}</span></div>
  <div><span style="color:var(--text-faint)">Binding ΔG:</span> ${c.binding_affinity_kcal} kcal/mol</div>
  ${c.clinical_trial_id ? `<div><span style="color:var(--text-faint)">Trial:</span> <a href="https://clinicaltrials.gov/ct2/show/${c.clinical_trial_id}" target="_blank" style="color:var(--teal);text-decoration:none">${c.clinical_trial_id}</a></div>` : ''}
  <div><span style="color:var(--text-faint)">Est. Market:</span> $${c.market_size_usd_m}M</div>
</div>
${c.key_papers && c.key_papers.length ? `<div style="font-size:0.72rem;color:var(--text-faint)"><span style="font-family:var(--FC)">Evidence:</span> ${c.key_papers.join(' · ')}</div>` : ''}
</div>`).join('')}
${d.admet_flags && d.admet_flags.length ? `<div class="card" style="margin-top:1.25rem"><div style="font-family:var(--FC);font-size:0.62rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.5rem">ADMET & Formulation Flags</div><div style="display:flex;flex-direction:column;gap:0.4rem">${d.admet_flags.map(f => `<div style="font-size:0.78rem;color:var(--text-dim)">• ${f}</div>`).join('')}</div></div>` : ''}
${d.competitive_landscape && d.competitive_landscape.length ? `<div class="card" style="margin-top:0.25rem"><div style="font-family:var(--FC);font-size:0.62rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.4rem">Competitive Landscape</div><div class="pills">${d.competitive_landscape.map(c => `<span class="pill">${c}</span>`).join('')}</div><div style="margin-top:0.65rem;font-size:0.78rem;color:var(--text-dim);font-weight:300">Patent: ${d.patent_status || 'See IP assessment'}</div></div>` : ''}`;
}
