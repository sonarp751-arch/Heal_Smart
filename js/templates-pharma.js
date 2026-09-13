export function dashboardPage() {
  return `<div id="pg-dash" class="pg">
<div class="pgh"><div class="ey">Research Overview</div><h1>Repurposing Intelligence Dashboard</h1><p>Live snapshot of your drug repurposing pipeline, top AI-ranked candidates, and latest literature signals across watched gene targets. Timeline reduction: 12 years → months.</p></div>
<div class="statgrid">
  <div class="statcard"><div class="sc-num teal">342</div><div class="sc-lbl">Active Repurposing Candidates</div><div class="sc-delta teal">↑ 12 this week</div></div>
  <div class="statcard"><div class="sc-num blue">18</div><div class="sc-lbl">Target Interactions Mapped</div><div class="sc-delta blue">↑ 3 this week</div></div>
  <div class="statcard"><div class="sc-num violet">4</div><div class="sc-lbl">Candidates in Phase II/III</div><div class="sc-delta">No change</div></div>
</div>
<div class="g2">
  <div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem"><h3>Top Repurposing Hits (Auto-Ranked)</h3><span class="badge badge-teal">Updated Today</span></div>
    <div class="table-wrap">
      <table class="data-table">
        <tr><th>Candidate Drug</th><th>Target Indication</th><th>Primary Target</th><th>AI Confidence</th><th>Evidence</th></tr>
        <tr><td><span class="hl-teal">Metformin</span></td><td>Pancreatic Adenocarcinoma</td><td>AMPK / mTOR</td><td><span style="color:var(--teal)">94%</span></td><td><span class="badge badge-teal">Phase II</span></td></tr>
        <tr><td><span class="hl-teal">Itraconazole</span></td><td>Basal Cell Carcinoma</td><td>Smoothened (SMO)</td><td><span style="color:var(--teal)">88%</span></td><td><span class="badge badge-teal">Phase II</span></td></tr>
        <tr><td><span class="hl-teal">Auranofin</span></td><td>Ovarian Cancer</td><td>Thioredoxin reductase</td><td><span style="color:var(--blue)">82%</span></td><td><span class="badge badge-blue">Preclinical</span></td></tr>
        <tr><td><span class="hl-teal">Digoxin</span></td><td>Prostate Cancer</td><td>HIF-1α / Na+/K+ ATPase</td><td><span style="color:var(--blue)">79%</span></td><td><span class="badge badge-blue">Preclinical</span></td></tr>
      </table>
    </div>
  </div>
  <div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem"><h3>Literature Signals</h3><span style="font-family:var(--FC);font-size:0.65rem;color:var(--text-dim)">via Sci-Hub / PubMed</span></div>
    <div style="display:flex;flex-direction:column;gap:0.75rem">
      <div style="background:rgba(255,255,255,0.02);padding:0.75rem;border-radius:var(--r8);border:1px solid var(--border)">
        <div style="font-family:var(--FC);font-size:0.62rem;color:var(--violet);margin-bottom:0.25rem">NEW PUBLICATION · NATURE MEDICINE</div>
        <div style="font-size:0.82rem;margin-bottom:0.35rem">"Synergistic effects of Everolimus and Metformin in PI3K-mutant solid tumours"</div>
        <div style="font-size:0.72rem;color:var(--text-dim)">AI Analysis: Directly validates internal repurposing thesis PRJ-04. <a href="#" style="color:var(--teal);text-decoration:none">Read Summary →</a></div>
      </div>
      <div style="background:rgba(255,255,255,0.02);padding:0.75rem;border-radius:var(--r8);border:1px solid var(--border)">
        <div style="font-family:var(--FC);font-size:0.62rem;color:var(--violet);margin-bottom:0.25rem">CLINICAL TRIAL UPDATE</div>
        <div style="font-size:0.82rem;margin-bottom:0.35rem">NCT04562199: Phase II trial of generic Disulfiram in Glioblastoma posts results.</div>
        <div style="font-size:0.72rem;color:var(--text-dim)">AI Analysis: Significant OS improvement. Consider prioritizing Cu-binding analogues. <a href="#" style="color:var(--teal);text-decoration:none">View Data →</a></div>
      </div>
    </div>
  </div>
</div>
</div>`;
}

export function dtePageHTML() {
  return `<div id="pg-dte" class="pg">
<div class="pgh"><div class="ey">Disease Target Identification</div><h1>Disease → Gene Target Engine</h1><p>The core of drug repurposing: add disease data (name, OMIM ID, pathology notes), and HealSmart's AI identifies the most druggable gene targets for that disease — then ranks existing approved drugs that hit those targets. This is the step that reduces years of target validation to minutes.</p></div>
<div class="dte-steps">
  <div class="dte-step active"><div class="dte-step-num">1</div><div class="dte-step-title">Input Disease</div><div class="dte-step-desc">Name, OMIM ID, pathology notes, or paste study abstracts</div></div>
  <div class="dte-step"><div class="dte-step-num">2</div><div class="dte-step-title">AI Target ID</div><div class="dte-step-desc">Identifying druggable gene targets across 5+ databases</div></div>
  <div class="dte-step"><div class="dte-step-num">3</div><div class="dte-step-title">Repurposing Hits</div><div class="dte-step-desc">Matching targets to approved drugs for immediate repurposing</div></div>
</div>
<div class="card" style="margin-bottom:1.25rem">
  <div style="display:flex;gap:1rem;flex-wrap:wrap">
    <div style="flex:1;min-width:300px">
      <div class="fg"><label>Disease / Indication</label><input type="text" id="dte-disease" placeholder="e.g. Pancreatic Ductal Adenocarcinoma, Alzheimer's, OMIM:137800"></div>
      <div class="fg"><label>Pathology / Context Notes (Optional)</label><textarea id="dte-notes" placeholder="Paste symptoms, known molecular subtypes, resistance mechanisms, or abstracts to constrain the AI search…"></textarea></div>
      <div class="fg"><label>Known Genetic Alterations (Optional)</label><input type="text" id="dte-genes" placeholder="e.g. KRAS G12D, TP53 mut, PTEN loss"></div>
    </div>
    <div style="width:280px;background:var(--bg);border-radius:var(--r8);padding:1rem;border:1px solid var(--border)">
      <div style="font-family:var(--FC);font-size:0.62rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.75rem">Data Sources Searched</div>
      <div style="display:flex;flex-direction:column;gap:0.4rem;font-size:0.78rem">
        <div style="display:flex;align-items:center;gap:0.35rem"><span style="color:var(--teal)">✓</span> OpenTargets Platform</div>
        <div style="display:flex;align-items:center;gap:0.35rem"><span style="color:var(--teal)">✓</span> DisGeNET</div>
        <div style="display:flex;align-items:center;gap:0.35rem"><span style="color:var(--teal)">✓</span> OMIM & ClinVar</div>
        <div style="display:flex;align-items:center;gap:0.35rem"><span style="color:var(--teal)">✓</span> GWAS Catalog</div>
        <div style="display:flex;align-items:center;gap:0.35rem"><span style="color:var(--teal)">✓</span> ChEMBL / DrugBank</div>
      </div>
      <div style="margin-top:1rem;padding-top:1rem;border-top:1px dashed var(--border)">
        <div style="font-size:0.72rem;color:var(--text-dim);margin-bottom:0.5rem">Quick Demos:</div>
        <div class="pills">
          <span class="pill" onclick="dteQuick('Pancreatic Ductal Adenocarcinoma')">PDAC</span>
          <span class="pill" onclick="dteQuick('Triple-Negative Breast Cancer')">TNBC</span>
          <span class="pill" onclick="dteQuick('Alzheimer\\'s Disease')">Alzheimer's</span>
        </div>
      </div>
    </div>
  </div>
  <div style="margin-top:1rem;display:flex;justify-content:flex-end">
    <button class="btn btn-teal btn-lg" onclick="runDTE()">Identify Targets & Repurposing Candidates →</button>
  </div>
</div>
<div id="dte-results"><div class="empty"><div class="ei">🎯</div><p>Enter disease data above to identify gene targets and discover repurposing candidates</p></div></div>
</div>`;
}

export function repurposingPageHTML() {
  return `<div id="pg-rep" class="pg">
<div class="pgh"><div class="ey">AI Engine</div><h1>Drug Repurposing Intelligence</h1><p>Enter an approved drug, disease, or gene target. AI queries DrugBank, ChEMBL, OpenTargets, and DisGeNET to surface ranked repurposing candidates with mechanistic rationale, clinical evidence, gene targets, and binding affinities.</p></div>
<div class="card" style="margin-bottom:1.25rem">
  <div style="display:flex;gap:0.35rem;background:rgba(255,255,255,0.04);border-radius:var(--r8);padding:0.28rem;margin-bottom:1rem;max-width:420px">
    <button class="tab-btn-r active" onclick="setRMode('drug', this)">Search by Drug</button>
    <button class="tab-btn-r" onclick="setRMode('disease', this)">Search by Disease</button>
    <button class="tab-btn-r" onclick="setRMode('target', this)">Search by Target</button>
  </div>
  <div style="display:flex;gap:0.75rem;margin-bottom:1rem">
    <input type="text" id="rq" placeholder="e.g. Metformin, Pancreatic Cancer, AMPK..." style="flex:1;font-size:1.1rem;padding:0.9rem 1rem">
    <button class="btn btn-teal" style="padding:0 2rem" onclick="runRep()">Analyze →</button>
  </div>
  <div style="font-family:var(--FC);font-size:0.68rem;color:var(--text-dim)">
    Examples: 
    <span style="color:var(--teal);cursor:pointer;margin:0 0.4rem" onclick="qRep('Metformin')">Metformin</span> · 
    <span style="color:var(--teal);cursor:pointer;margin:0 0.4rem" onclick="qRep('Disulfiram')">Disulfiram</span> · 
    <span style="color:var(--teal);cursor:pointer;margin:0 0.4rem" onclick="qRep('Glioblastoma')">Glioblastoma</span> · 
    <span style="color:var(--teal);cursor:pointer;margin:0 0.4rem" onclick="qRep('EGFR')">EGFR</span>
  </div>
</div>
<div id="rep-r"><div class="empty"><div class="ei">🔬</div><p>Search a drug, disease, or gene target to surface AI-ranked repurposing candidates</p></div></div>
</div>`;
}

export function dockingPageHTML() {
  return `<div id="pg-dock" class="pg">
<div class="pgh"><div class="ey">Computational Chemistry</div><h1>AI Molecular Docking Simulation</h1><p>AutoDock Vina–powered binding affinity prediction. Enter SMILES + PDB ID, or use the quick library. Results include binding energy (ΔG), 9 pose modes, residue interaction map, ADMET profile, and repurposing implications.</p></div>
<div class="g2" style="margin-bottom:1.25rem">
  <div class="card">
    <div class="fg"><label>Ligand (SMILES String)</label><input type="text" id="sm" placeholder="e.g. CN(C)C(=N)NC(=N)N (Metformin)" style="font-family:monospace;font-size:0.82rem"></div>
    <div class="fg"><label>Receptor (PDB ID)</label><input type="text" id="pdb" placeholder="e.g. 3RJ1" style="font-family:monospace;font-size:0.82rem"></div>
    <div style="font-size:0.72rem;color:var(--text-faint);margin-bottom:1rem">Auto-detects active site and generates optimal grid box parameters.</div>
    <button class="btn btn-teal" style="width:100%" onclick="runDock()">Run AutoDock Vina Simulation →</button>
  </div>
  <div class="card">
    <div style="font-family:var(--FC);font-size:0.62rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.75rem">Quick Demo Combinations</div>
    <div style="display:flex;flex-direction:column;gap:0.4rem">
      <button class="btn btn-outline-teal btn-sm" style="justify-content:flex-start" onclick="setSmiles('CN(C)C(=N)NC(=N)N'); setPdb('3RJ1'); runDock();">Metformin + AMPK (3RJ1)</button>
      <button class="btn btn-outline-teal btn-sm" style="justify-content:flex-start" onclick="setSmiles('CC1=C(C=C(C=C1)NC(=O)C2=CC=C(C=C2)CN3CCN(CC3)C)NC4=NC=CC(=N4)C5=CN=CC=C5'); setPdb('1T46'); runDock();">Imatinib + ABL Kinase (1T46)</button>
      <button class="btn btn-outline-teal btn-sm" style="justify-content:flex-start" onclick="setSmiles('C1=CC(=C(C=C1C(C(C(=O)O)N)O)O)O'); setPdb('3GEY'); runDock();">Levodopa + DOPA Decarboxylase (3GEY)</button>
    </div>
  </div>
</div>
<div id="dock-r"><div class="empty"><div class="ei">⚗️</div><p>Configure ligand and target above, then run docking to see binding affinity, 3D pose visualization, and interaction analysis</p></div></div>
</div>`;
}

export function literaturePageHTML() {
  return `<div id="pg-lit" class="pg">
<div class="pgh"><div class="ey">Research Intelligence</div><h1>Literature Search & Sci-Hub Access</h1><p>Search PubMed, bioRxiv, ChEMBL, and ClinicalTrials.gov. Paywalled papers are automatically routed via Sci-Hub — no manual searching. AI summarises any paper for drug repurposing relevance in seconds.</p></div>
<div class="card" style="margin-bottom:1.25rem">
  <div style="display:flex;gap:0.75rem;margin-bottom:1rem">
    <input type="text" id="lq" placeholder="Search mechanisms, drugs, trials... e.g. 'Metformin pancreatic cancer AMPK'" style="flex:1;font-size:1.1rem;padding:0.9rem 1rem">
    <button class="btn btn-teal" style="padding:0 2rem" onclick="runLit()">Search Literature →</button>
  </div>
  <div style="display:flex;align-items:center;gap:1.5rem;font-family:var(--FC);font-size:0.68rem;color:var(--text-dim)">
    <div style="display:flex;align-items:center;gap:0.35rem"><span style="color:var(--teal)">✓</span> PubMed Connected</div>
    <div style="display:flex;align-items:center;gap:0.35rem"><span style="color:var(--teal)">✓</span> Sci-Hub Routing Active</div>
    <div style="display:flex;align-items:center;gap:0.35rem"><span style="color:var(--teal)">✓</span> ClinicalTrials.gov Synced</div>
  </div>
</div>
<div id="lit-r"><div class="empty"><div class="ei">📚</div><p>Search any drug, disease, mechanism, or research topic — Sci-Hub auto-routing for paywalled papers</p></div></div>
</div>`;
}

export function geneTargetsPageHTML() {
  return `<div id="pg-tgt" class="pg">
<div class="pgh"><div class="ey">Target Biology</div><h1>Gene–Disease Target Networks</h1><p>Explore drug–gene–disease tripartite associations from OpenTargets, DisGeNET, GWAS Catalog, OMIM, and UniProt. Visualise pathway enrichment and druggability scores for selecting repurposing targets.</p></div>
<div class="card" style="margin-bottom:1.25rem">
  <div style="display:flex;gap:0.75rem;margin-bottom:1rem">
    <input type="text" id="tq" placeholder="Enter Gene Symbol (e.g. AMPK, EGFR, TP53)..." style="flex:1;font-size:1.1rem;padding:0.9rem 1rem;font-family:monospace">
    <button class="btn btn-teal" style="padding:0 2rem" onclick="runTgt()">Analyse Target →</button>
  </div>
  <div style="font-family:var(--FC);font-size:0.68rem;color:var(--text-dim)">
    Examples: 
    <span style="color:var(--teal);cursor:pointer;margin:0 0.4rem" onclick="setTgt('PRKAA1')">PRKAA1 (AMPK)</span> · 
    <span style="color:var(--teal);cursor:pointer;margin:0 0.4rem" onclick="setTgt('EGFR')">EGFR</span> · 
    <span style="color:var(--teal);cursor:pointer;margin:0 0.4rem" onclick="setTgt('mTOR')">mTOR</span>
  </div>
</div>
<div id="tgt-r"><div class="empty"><div class="ei">🎯</div><p>Search a gene target to see drug associations, disease links, pathway membership, and druggability analysis</p></div></div>
</div>`;
}

export function pipelinePageHTML() {
  return `<div id="pg-pipe" class="pg">
<div class="pgh"><div class="ey">R&D Management</div><h1>Repurposing Pipeline Tracker</h1><p>Manage candidates from AI hit identification through IND filing and clinical phases. Track milestones, competitive landscape, and market sizing for each repurposing programme.</p></div>
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem">
  <div style="font-family:var(--FC);font-size:0.72rem;color:var(--text-dim)">58 candidates across all phases · Updated 5 min ago</div>
  <div style="display:flex;gap:0.5rem">
    <button class="btn btn-outline-teal btn-sm">Export CSV</button>
    <button class="btn btn-teal btn-sm">+ Add Candidate</button>
  </div>
</div>
<div class="kanban">
  <div class="kb-col">
    <div class="kb-head">Hit Identification <span class="badge badge-teal">24</span></div>
    <div class="kb-card">
      <div class="kbc-title">Itraconazole → BCC</div>
      <div class="kbc-sub">SMO antagonist</div>
      <div style="display:flex;justify-content:space-between;margin-top:0.5rem"><span class="badge">In silico validation</span><span style="font-family:var(--FC);font-size:0.6rem;color:var(--text-faint)">2d</span></div>
    </div>
    <div class="kb-card">
      <div class="kbc-title">Auranofin → Ovarian</div>
      <div class="kbc-sub">TrxR inhibitor</div>
      <div style="display:flex;justify-content:space-between;margin-top:0.5rem"><span class="badge">In vitro planning</span><span style="font-family:var(--FC);font-size:0.6rem;color:var(--text-faint)">5d</span></div>
    </div>
  </div>
  <div class="kb-col">
    <div class="kb-head">Lead Optimization <span class="badge badge-blue">14</span></div>
    <div class="kb-card">
      <div class="kbc-title">Digoxin → Prostate</div>
      <div class="kbc-sub">HIF-1α suppression</div>
      <div style="display:flex;justify-content:space-between;margin-top:0.5rem"><span class="badge badge-blue">In vivo murine</span><span style="font-family:var(--FC);font-size:0.6rem;color:var(--text-faint)">12d</span></div>
    </div>
  </div>
  <div class="kb-col">
    <div class="kb-head">IND Enabling <span class="badge badge-violet">6</span></div>
    <div class="kb-card">
      <div class="kbc-title">Niclosamide → CRC</div>
      <div class="kbc-sub">Wnt/β-catenin inhibitor</div>
      <div style="display:flex;justify-content:space-between;margin-top:0.5rem"><span class="badge badge-violet">Tox studies</span><span style="font-family:var(--FC);font-size:0.6rem;color:var(--text-faint)">1m</span></div>
    </div>
  </div>
  <div class="kb-col">
    <div class="kb-head">Clinical Phase II/III <span class="badge badge-teal">4</span></div>
    <div class="kb-card" style="border-left-color:var(--teal)">
      <div class="kbc-title">Metformin → PDAC</div>
      <div class="kbc-sub">AMPK/mTOR activation</div>
      <div style="display:flex;justify-content:space-between;margin-top:0.5rem"><span class="badge badge-teal">Phase II ongoing</span><span style="font-family:var(--FC);font-size:0.6rem;color:var(--text-faint)">NCT04733</span></div>
    </div>
  </div>
</div>
</div>`;
}

export function copilotPageHTML() {
  return `<div id="pg-cop" class="pg">
<div class="pgh"><div class="ey">AI Research Assistant</div><h1>Drug Repurposing Research Copilot</h1><p>Ask anything — drug mechanisms, ADMET profiles, docking result interpretation, gene targets, clinical trial design, patent landscapes, or literature synthesis. Full scientific depth.</p></div>
<div class="chat-wrap">
  <div class="chat-msgs" id="chat-msgs">
    <div class="msg-a">Hello. I am HealSmart's Research Copilot. I have access to ChEMBL, DrugBank, OpenTargets, DisGeNET, and PubMed literature up to this morning.<br><br>How can I assist your drug repurposing workflow today?</div>
  </div>
  <div class="chat-in">
    <div class="pills" style="margin-bottom:0.75rem">
      <span class="pill" onclick="qCopilot('What is the mechanistic rationale for repurposing Metformin in pancreatic cancer?')">Mechanistic Rationale</span>
      <span class="pill" onclick="qCopilot('What are the top 3 druggable targets for Alzheimer\\'s disease according to OpenTargets?')">Target Identification</span>
      <span class="pill" onclick="qCopilot('Summarize the ADMET profile and BBB permeability of Disulfiram.')">ADMET Profile</span>
    </div>
    <div style="display:flex;gap:0.5rem">
      <input type="text" id="ci" placeholder="Ask about mechanisms, ADMET, trial design, patents..." onkeypress="if(event.key==='Enter') sendChat()">
      <button class="btn btn-teal" onclick="sendChat()">Send</button>
    </div>
  </div>
</div>
</div>`;
}
