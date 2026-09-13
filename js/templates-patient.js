export function medSearchPage() {
  return `<div id="pg-msearch" class="pg">
<div class="pgh"><div class="ey gold">Drug Optimisation</div><h1>Medicine Search & Cost Optimisation</h1><p>Search by medicine name, disease, or symptoms. Get AI-powered information, compare branded vs generic pricing, and find affordable Jan Aushadhi alternatives — saving up to 90%.</p></div>
<div class="card card-gold" style="margin-bottom:1.25rem">
  <div style="display:flex;gap:0.35rem;background:rgba(255,255,255,0.04);border-radius:var(--r8);padding:0.28rem;margin-bottom:1rem;max-width:420px">
    <button class="tab-btn-p active" onclick="setPMode('medicine', this)" style="background:var(--gold-bg);color:var(--gold)">Medicine Name</button>
    <button class="tab-btn-p" onclick="setPMode('disease', this)">Disease</button>
    <button class="tab-btn-p" onclick="setPMode('symptom', this)">Symptoms</button>
  </div>
  <div style="display:flex;gap:0.75rem;margin-bottom:1rem">
    <input type="text" id="mq" placeholder="e.g. Glycomet, Diabetes, or 'frequent urination'" style="flex:1;font-size:1.1rem;padding:0.9rem 1rem">
    <button class="btn btn-gold" style="padding:0 2rem" onclick="runMed()">Search Medicine →</button>
  </div>
  <div style="font-family:var(--FC);font-size:0.68rem;color:var(--text-dim)">
    Popular Searches: 
    <span style="color:var(--gold);cursor:pointer;margin:0 0.4rem" onclick="qMed('Glycomet 500')">Glycomet 500</span> · 
    <span style="color:var(--gold);cursor:pointer;margin:0 0.4rem" onclick="qMed('Telma 40')">Telma 40</span> · 
    <span style="color:var(--gold);cursor:pointer;margin:0 0.4rem" onclick="qMed('Dolo 650')">Dolo 650</span>
  </div>
</div>
<div id="med-r"><div class="empty"><div class="ei">💊</div><p>Search a medicine, disease, or symptom to get pricing, generic alternatives, and nearby Jan Aushadhi stores</p></div></div>
</div>`;
}

export function janAushadhiPage() {
  return `<div id="pg-jan" class="pg">
<div class="pgh"><div class="ey gold">Jan Aushadhi Locator</div><h1>Pradhan Mantri Jan Aushadhi Kendras</h1><p>Find government-backed generic medicine stores near you. 8,800+ PMJAK stores across India. Same quality, up to 90% cheaper than branded medicines. WHO-GMP certified manufacturers only.</p></div>
<div class="g2" style="margin-bottom:1.25rem">
  <div class="card card-gold">
    <div class="fg"><label>Medicine Name (Optional)</label><input type="text" id="jm" placeholder="e.g. Metformin, Paracetamol"></div>
    <div class="fg"><label>City / Area / Pincode</label><input type="text" id="jl" placeholder="e.g. Bengaluru, 560001"></div>
    <button class="btn btn-gold" style="width:100%" onclick="runJan()">Find Nearby Stores with Stock →</button>
  </div>
  <div class="card card-gold">
    <div style="font-family:var(--FC);font-size:0.62rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.75rem">Why Jan Aushadhi?</div>
    <div style="display:flex;flex-direction:column;gap:0.75rem;font-size:0.82rem;line-height:1.5">
      <div><strong style="color:var(--gold)">✓ 50% to 90% Cheaper</strong> than branded medicines.</div>
      <div><strong style="color:var(--gold)">✓ WHO-GMP Certified</strong> ensuring identical quality and efficacy as top brands.</div>
      <div><strong style="color:var(--gold)">✓ NABL Lab Tested</strong> batches tested at government-approved laboratories.</div>
      <div><strong style="color:var(--gold)">✓ 1759+ Medicines</strong> and 280+ surgical devices available.</div>
    </div>
  </div>
</div>
<div id="jan-r"><div class="empty"><div class="ei">🏪</div><p>Enter a medicine and your city to find nearby Jan Aushadhi Kendras with stock availability and pricing</p></div></div>
</div>`;
}

export function aiChatPatientPage() {
  return `<div id="pg-aichat" class="pg">
<div class="pgh"><div class="ey gold">AI Medicine Assistant</div><h1>Medicine Information & Guidance</h1><p>Ask about any medicine — dosage, side effects, interactions, generics, when to see a doctor. Not a substitute for medical advice, but a powerful first reference.</p></div>
<div class="chat-wrap" style="border-color:var(--gold-border)">
  <div class="chat-msgs" id="pt-chat-msgs">
    <div class="msg-a">Namaste. I am your HealSmart medical assistant.<br><br>I can explain what your medicines do, check for drug interactions, tell you about side effects, or help you find cheaper generic versions.<br><br>What medicine would you like to know about?</div>
  </div>
  <div class="chat-in">
    <div class="pills" style="margin-bottom:0.75rem">
      <span class="pill gold" onclick="document.getElementById('pt-ci').value='What are the side effects of Metformin?';sendPatientChat()">Side effects of Metformin?</span>
      <span class="pill gold" onclick="document.getElementById('pt-ci').value='Are there cheaper alternatives to Rosuvas 20?';sendPatientChat()">Cheaper alternatives to Rosuvas?</span>
    </div>
    <div style="display:flex;gap:0.5rem">
      <input type="text" id="pt-ci" placeholder="Type your question..." onkeypress="if(event.key==='Enter') sendPatientChat()">
      <button class="btn btn-gold" onclick="sendPatientChat()">Ask</button>
    </div>
  </div>
</div>
</div>`;
}
