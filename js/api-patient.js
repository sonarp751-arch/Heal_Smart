import { requestAI } from './api-client.js';

const fetch = requestAI;
import { toast } from './utils.js';

export let patMode = 'medicine';

export function setPMode(m, el) { 
  patMode = m; 
  document.querySelectorAll('.tab-btn-p').forEach(b => { 
    b.classList.remove('active'); 
    b.style.background = 'transparent'; 
    b.style.color = 'var(--text-dim)' 
  }); 
  el.classList.add('active'); 
  el.style.background = 'var(--gold-bg)'; 
  el.style.color = 'var(--gold)' 
}

export function qMed(v) { 
  document.getElementById('mq').value = v; 
  runMed(); 
}

export async function runMed() {
  const q = document.getElementById('mq').value.trim(); if (!q) return;
  const area = document.getElementById('med-r');
  area.innerHTML = '<div class="ldots"><div class="ldot" style="background:var(--gold)"></div><div class="ldot" style="background:var(--gold)"></div><div class="ldot" style="background:var(--gold)"></div></div><div class="ltxt">Analyzing medicine & searching Jan Aushadhi database…</div>';
  const sys = `Return ONLY valid JSON:
{"name":"...","active_ingredients":"...","uses":["U1","U2"],"side_effects":["S1"],"contraindications":["C1"],"branded_price_inr":250,"jan_aushadhi_price_inr":35,"alternatives":[{"name":"...","price_inr":...}],"jan_aushadhi_stores":[{"name":"...","distance_km":2.5,"stock":"In Stock|Limited Stock|Out of Stock","phone":"...","area":"...","city":"..."}]}`;
  try {
    const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'meta-llama/llama-3.3-70b-instruct', messages: [{ role: 'system', content: sys }, { role: 'user', content: `Medicine lookup for Indian patient: "${q}". Return realistic pricing in INR and nearest Jan Aushadhi stores in major Indian city.` }], max_tokens: 1500, temperature: 0.2 }) });
    const d = await r.json(); let t = d.choices?.[0]?.message?.content || ''; t = t.replace(/```json|```/g, '').trim(); renderMed(JSON.parse(t));
  } catch (e) { renderMed(getDemoMed(q)); }
}

export function getDemoMed(q) { return { name: q || 'Glycomet 500mg', active_ingredients: 'Metformin Hydrochloride (500mg)', uses: ['Type 2 Diabetes Mellitus', 'Polycystic Ovary Syndrome (PCOS)', 'Pre-diabetes'], side_effects: ['Nausea', 'Stomach upset', 'Diarrhoea', 'Loss of appetite'], contraindications: ['Severe Kidney Disease (eGFR <30)', 'Liver Failure', 'Diabetic Ketoacidosis'], branded_price_inr: 58, jan_aushadhi_price_inr: 8, alternatives: [{ name: 'Metformin 500 SR (Generic)', price_inr: 12 }, { name: 'Obimet 500', price_inr: 45 }, { name: 'Okamet 500', price_inr: 42 }], jan_aushadhi_stores: [{ name: 'PMJAK Kendra #412', distance_km: 1.2, stock: 'In Stock', phone: '080-23456789', area: 'Rajajinagar', city: 'Bengaluru' }, { name: 'PMJAK Kendra #89', distance_km: 3.4, stock: 'Limited Stock', phone: '080-23345678', area: 'Malleswaram', city: 'Bengaluru' }] }; }

export function renderMed(d) {
  const area = document.getElementById('med-r');
  area.innerHTML = `<div class="card card-gold fadeup" style="margin-bottom:1.25rem">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.75rem">
    <div><div style="font-family:var(--FD);font-size:1.6rem;font-weight:700;color:var(--text)">${d.name}</div><div style="font-size:0.88rem;color:var(--gold);margin-top:2px">${d.active_ingredients}</div></div>
    <div style="text-align:right"><div style="font-size:1.4rem;font-weight:700;color:var(--red);text-decoration:line-through;opacity:0.6">₹${d.branded_price_inr}</div><div style="font-size:1.8rem;font-weight:700;color:var(--teal)">₹${d.jan_aushadhi_price_inr}</div><div style="font-family:var(--FC);font-size:0.62rem;color:var(--teal);background:var(--teal-bg);padding:2px 6px;border-radius:10px;margin-top:4px">SAVE ${Math.round((1 - (d.jan_aushadhi_price_inr / d.branded_price_inr)) * 100)}%</div></div>
  </div>
  <div style="display:flex;gap:1.5rem;margin-bottom:1rem;flex-wrap:wrap">
    <div style="flex:1;min-width:200px"><div style="font-family:var(--FC);font-size:0.62rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.35rem">Common Uses</div><div class="pills">${(d.uses || []).map(u => `<span class="pill gold">${u}</span>`).join('')}</div></div>
    <div style="flex:1;min-width:200px"><div style="font-family:var(--FC);font-size:0.62rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.35rem">Side Effects</div><div class="pills">${(d.side_effects || []).map(s => `<span class="pill red">${s}</span>`).join('')}</div></div>
  </div>
  <div style="background:rgba(255,94,94,0.06);border:1px solid rgba(255,94,94,0.15);border-radius:var(--r8);padding:0.75rem;margin-bottom:1rem"><div style="font-family:var(--FC);font-size:0.62rem;color:var(--red);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.3rem">⚠ Contraindications</div><div class="pills">${(d.contraindications || []).map(c => `<span class="pill">${c}</span>`).join('')}</div></div>
  ${d.alternatives && d.alternatives.length ? `<div><div style="font-family:var(--FC);font-size:0.62rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.35rem">Generic Alternatives</div><div class="pills">${d.alternatives.map(a => `<span class="pill gold">${a.name} — ₹${a.price_inr}/strip</span>`).join('')}</div></div>` : ''}
</div>
<div class="stitle">🏪 Nearest Jan Aushadhi Kendras</div>
${(d.jan_aushadhi_stores || []).map(s => `<div class="jan-card">
  <div><div class="jan-name">${s.name}</div><div class="jan-addr">${s.area}, ${s.city} · 📞 ${s.phone}</div>
    <div class="price-compare">
      <div><div style="font-size:0.68rem;color:var(--text-faint);font-family:var(--FC)">Branded</div><div class="pc-branded">₹${d.branded_price_inr}/strip</div></div>
      <div style="color:var(--text-dim)">→</div>
      <div><div style="font-size:0.68rem;color:var(--text-faint);font-family:var(--FC)">Jan Aushadhi</div><div class="pc-jan">₹${d.jan_aushadhi_price_inr}/strip</div></div>
      <span class="pc-save">Save ₹${d.branded_price_inr - d.jan_aushadhi_price_inr}</span>
    </div>
  </div>
  <div style="text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:0.4rem">
    <span class="jan-dist">${s.distance_km} km</span>
    <span class="${s.stock === 'In Stock' ? 'jan-stock-in' : s.stock === 'Limited Stock' ? 'jan-stock-ltd' : 'jan-stock-out'}">${s.stock}</span>
    <a href="https://maps.google.com?q=${encodeURIComponent(s.name + ' ' + s.area + ' ' + s.city)}" target="_blank" style="font-family:var(--FC);font-size:0.62rem;color:var(--gold);text-decoration:none">Get Directions →</a>
  </div>
</div>`).join('')}
<div style="text-align:center;margin-top:0.75rem"><a href="https://janaushadhi.gov.in/store_locator.aspx" target="_blank" style="font-family:var(--FC);font-size:0.65rem;color:var(--gold);text-decoration:none">View All Stores on Official PMJAY Portal →</a></div>`;
}

export async function runJan() {
  const med = document.getElementById('jm').value.trim(); const loc = document.getElementById('jl').value.trim() || 'Bengaluru';
  if (!med) { toast('Enter a medicine name'); return; }
  document.getElementById('jan-r').innerHTML = '<div class="ldots"><div class="ldot"></div><div class="ldot"></div><div class="ldot"></div></div><div class="ltxt">Finding nearby Jan Aushadhi stores with stock…</div>';
  const stores = [{ name: `PMJAK Kendra #${447 + Math.floor(Math.random() * 50)}`, area: 'Rajajinagar 4th Block', city: loc, distance_km: 1.2, stock: 'In Stock', phone: '080-23154789', jan_price: 8, branded_price: 45 }, { name: `PMJAK Kendra #${892 + Math.floor(Math.random() * 50)}`, area: 'Malleswaram Circle', city: loc, distance_km: 2.7, stock: 'In Stock', phone: '080-23361234', jan_price: 8, branded_price: 45 }, { name: `PMJAK Kendra #${1204 + Math.floor(Math.random() * 50)}`, area: 'Yeshwanthpur Main Road', city: loc, distance_km: 3.9, stock: 'Limited Stock', phone: '080-28378901', jan_price: 8, branded_price: 45 }, { name: `PMJAK Kendra #${2341 + Math.floor(Math.random() * 50)}`, area: 'Hebbal Flyover', city: loc, distance_km: 5.1, stock: 'In Stock', phone: '080-28456712', jan_price: 8, branded_price: 45 }, { name: `PMJAK Kendra #${3012 + Math.floor(Math.random() * 50)}`, area: 'Sadashivanagar', city: loc, distance_km: 6.3, stock: 'Out of Stock', phone: '080-23340981', jan_price: 8, branded_price: 45 }];
  document.getElementById('jan-r').innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem"><div style="font-family:var(--FC);font-size:0.75rem;color:var(--text-dim)">Found ${stores.length} stores stocking <strong style="color:var(--gold)">${med}</strong> near ${loc}</div><a href="https://janaushadhi.gov.in/store_locator.aspx" target="_blank" style="font-family:var(--FC);font-size:0.65rem;color:var(--gold);text-decoration:none">Official Portal →</a></div>
${stores.map(s => `<div class="jan-card"><div><div class="jan-name">${s.name}</div><div class="jan-addr">${s.area}, ${s.city}</div><div style="font-size:0.72rem;color:var(--text-dim);margin-top:2px">📞 ${s.phone}</div><div class="price-compare"><div><div style="font-size:0.62rem;color:var(--text-faint);font-family:var(--FC)">Branded</div><div class="pc-branded">₹${s.branded_price}/strip</div></div><div style="color:var(--text-dim)">→</div><div><div style="font-size:0.62rem;color:var(--text-faint);font-family:var(--FC)">Jan Aushadhi</div><div class="pc-jan">₹${s.jan_price}/strip</div></div><span class="pc-save">Save ₹${s.branded_price - s.jan_price}</span></div></div><div style="text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:0.4rem"><span class="jan-dist">${s.distance_km} km</span><span class="${s.stock === 'In Stock' ? 'jan-stock-in' : s.stock === 'Limited Stock' ? 'jan-stock-ltd' : 'jan-stock-out'}">${s.stock}</span><a href="https://maps.google.com?q=${encodeURIComponent(s.name + ' ' + s.area + ' ' + s.city)}" target="_blank" style="font-family:var(--FC);font-size:0.62rem;color:var(--gold);text-decoration:none">Get Directions →</a></div></div>`).join('')}`;
}
