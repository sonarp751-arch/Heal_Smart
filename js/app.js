import { setCurrentPage } from './state.js';
import { dashboardPage, dtePageHTML, repurposingPageHTML, dockingPageHTML, literaturePageHTML, geneTargetsPageHTML, pipelinePageHTML, copilotPageHTML } from './templates-pharma.js';
import { medSearchPage, janAushadhiPage, aiChatPatientPage } from './templates-patient.js';

export function buildAppShell(portal) {
  const isPharma = portal === 'pharma';
  // Portal indicator
  document.getElementById('portal-indicator').className = 'portal-indicator ' + (isPharma ? 'pi-pharma' : 'pi-patient');
  document.getElementById('portal-indicator').textContent = isPharma ? 'PHARMA RESEARCH' : 'PATIENT PORTAL';
  document.getElementById('user-av').style.background = isPharma ? 'var(--teal)' : 'var(--gold)';
  document.getElementById('user-av').textContent = isPharma ? 'RX' : 'PT';
  document.getElementById('user-name-chip').textContent = isPharma ? 'Researcher' : 'Patient';

  if (isPharma) {
    // PHARMA NAV
    document.getElementById('app-nav-links').innerHTML = `
      <button class="anl active" id="na-dash" onclick="showPg('dash')">Dashboard</button>
      <button class="anl" id="na-dte" onclick="showPg('dte')">Disease Target Engine</button>
      <button class="anl" id="na-rep" onclick="showPg('rep')">Repurposing AI</button>
      <button class="anl" id="na-dock" onclick="showPg('dock')">Docking</button>
      <button class="anl" id="na-lit" onclick="showPg('lit')">Literature</button>
      <button class="anl" id="na-tgt" onclick="showPg('tgt')">Targets</button>
      <button class="anl" id="na-pipe" onclick="showPg('pipe')">Pipeline</button>
      <button class="anl" id="na-cop" onclick="showPg('cop')">AI Copilot</button>
    `;
    document.getElementById('sidebar').innerHTML = `
      <div class="sb-sec">
        <div class="sb-lbl">Core Research</div>
        <button class="sb-i active" id="si-dash" onclick="showPg('dash')">◈ Dashboard</button>
        <button class="sb-i" id="si-dte" onclick="showPg('dte')">🎯 Target ID Engine</button>
        <button class="sb-i" id="si-rep" onclick="showPg('rep')">🔬 Repurposing AI</button>
        <button class="sb-i" id="si-dock" onclick="showPg('dock')">⚗️ Vina Docking</button>
        <button class="sb-i" id="si-lit" onclick="showPg('lit')">📚 Literature Intel</button>
        <button class="sb-i" id="si-tgt" onclick="showPg('tgt')">🧬 Gene Networks</button>
      </div>
      <div class="sb-sec">
        <div class="sb-lbl">Management</div>
        <button class="sb-i" id="si-pipe" onclick="showPg('pipe')">📊 Pipeline Kanban</button>
        <button class="sb-i" id="si-cop" onclick="showPg('cop')">🤖 Copilot Chat</button>
      </div>
      <div class="sb-foot">DrugBank · ChEMBL · OpenTargets<br>DisGeNET · UniProt · OMIM · PubMed</div>
    `;
    renderPharmaPages();
    showPg('dash');
  } else {
    // PATIENT NAV
    document.getElementById('app-nav-links').innerHTML = `
      <button class="anl active gold-mode" id="na-msearch" onclick="showPg('msearch')">Medicine Search</button>
      <button class="anl gold-mode" id="na-jan" onclick="showPg('jan')">Jan Aushadhi Finder</button>
      <button class="anl gold-mode" id="na-aichat" onclick="showPg('aichat')">AI Medicine Assistant</button>
    `;
    document.getElementById('sidebar').innerHTML = `
      <div class="sb-sec">
        <div class="sb-lbl">For Patients</div>
        <button class="sb-i active gold-mode" id="si-msearch" onclick="showPg('msearch')">💊 Medicine Search</button>
        <button class="sb-i gold-mode" id="si-jan" onclick="showPg('jan')">🏪 Jan Aushadhi</button>
        <button class="sb-i gold-mode" id="si-aichat" onclick="showPg('aichat')">🤖 AI Assistant</button>
      </div>
      <div class="sb-foot">PMJAY Jan Aushadhi Portal<br>OpenFDA · Drug Information</div>
    `;
    renderPatientPages();
    showPg('msearch');
  }
}

export function showPg(pg) {
  setCurrentPage(pg);
  document.querySelectorAll('.pg').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('pg-' + pg);
  if (el) el.classList.add('active');
  document.querySelectorAll('.sb-i, .anl').forEach(b => b.classList.remove('active'));
  const si = document.getElementById('si-' + pg); if (si) si.classList.add('active');
  const na = document.getElementById('na-' + pg); if (na) na.classList.add('active');
}

export function renderPharmaPages() {
  document.getElementById('main-content').innerHTML = `
    ${dashboardPage()}
    ${dtePageHTML()}
    ${repurposingPageHTML()}
    ${dockingPageHTML()}
    ${literaturePageHTML()}
    ${geneTargetsPageHTML()}
    ${pipelinePageHTML()}
    ${copilotPageHTML()}
  `;
}

export function renderPatientPages() {
  document.getElementById('main-content').innerHTML = `
    ${medSearchPage()}
    ${janAushadhiPage()}
    ${aiChatPatientPage()}
  `;
}
