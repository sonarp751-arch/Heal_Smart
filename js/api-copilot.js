import { currentPortal, chatHistory } from './state.js';
import { requestAI } from './api-client.js';

const fetch = requestAI;

export const sysPromptPharma = { role: 'system', content: 'You are HealSmart, an expert pharmaceutical drug repurposing AI. Provide detailed, scientifically rigorous answers on drug mechanisms, repurposing candidates, AutoDock Vina interpretation, ADMET profiles, gene targets, clinical trial design, patent landscapes. Reference data sources (ChEMBL, DrugBank, OpenTargets, PubMed). State confidence levels. Format with clear structure using markdown-like headers and bullet points.' };
export const sysPromptPatient = { role: 'system', content: 'You are HealSmart, a friendly medical AI assistant for patients and doctors in India. Explain medicines in simple language, provide generic alternative information, Jan Aushadhi store details, side effects, dosage information, and when to see a doctor. Always recommend consulting a qualified doctor before changing medication. Be empathetic, clear, and accurate.' };

export function qCopilot(p) { const el = document.getElementById('ci'); if (el) { el.value = p; sendChat(); } }

export async function sendChat() {
  const isPharma = currentPortal === 'pharma'; const inpId = isPharma ? 'ci' : 'pt-ci'; const msgsId = isPharma ? 'chat-msgs' : 'pt-chat-msgs';
  const input = document.getElementById(inpId); const msgsDiv = document.getElementById(msgsId);
  if (!input || !msgsDiv) return; const q = input.value.trim(); if (!q) return; input.value = '';
  msgsDiv.innerHTML += `<div class="msg-u">${q}</div>`;
  msgsDiv.innerHTML += `<div class="msg-a" id="typing"><div class="ldots" style="padding:0.4rem"><div class="ldot"></div><div class="ldot"></div><div class="ldot"></div></div></div>`;
  msgsDiv.scrollTop = msgsDiv.scrollHeight;
  chatHistory.push({ role: 'user', content: q });
  const sysMsg = isPharma ? sysPromptPharma : sysPromptPatient;
  try {
    const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'meta-llama/llama-3.3-70b-instruct', messages: [sysMsg, ...chatHistory.slice(-8)], max_tokens: 1200, temperature: 0.4 }) });
    const d = await r.json(); const reply = d.choices?.[0]?.message?.content || 'Unable to get response. Please try again.';
    chatHistory.push({ role: 'assistant', content: reply });
    document.getElementById('typing').outerHTML = `<div class="msg-a">${reply.replace(/\\n\\n/g, '<br><br>').replace(/\\n/g, '<br>').replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>').replace(/\`([^\`]+)\`/g, '<code style="background:rgba(255,255,255,0.08);padding:0.1rem 0.35rem;border-radius:3px;font-family:var(--FC);font-size:0.82rem">$1</code>')}</div>`;
  } catch (e) { document.getElementById('typing').outerHTML = `<div class="msg-a"><strong style="color:var(--red)">Connection Error</strong><br>Please check your OpenRouter API key configuration. Demo mode available — use the Repurposing AI, Docking, or Disease Target Engine modules which have comprehensive built-in data.</div>`; }
  msgsDiv.scrollTop = msgsDiv.scrollHeight;
}

export function sendPatientChat() {
  const el = document.getElementById('pt-ci'); if (!el) return;
  const q = el.value.trim(); if (!q) return; el.value = '';
  const msgsDiv = document.getElementById('pt-chat-msgs');
  msgsDiv.innerHTML += `<div class="msg-u">${q}</div>`;
  chatHistory.push({ role: 'user', content: q });
  sendChatWith('pt-chat-msgs', 'pt-ci');
}

export async function sendChatWith(msgsId, inpId) {
  const msgsDiv = document.getElementById(msgsId); if (!msgsDiv) return;
  const q = chatHistory[chatHistory.length - 1]?.content;
  msgsDiv.innerHTML += `<div class="msg-a" id="typing2"><div class="ldots" style="padding:0.4rem"><div class="ldot"></div><div class="ldot"></div><div class="ldot"></div></div></div>`;
  msgsDiv.scrollTop = msgsDiv.scrollHeight;
  try {
    const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'meta-llama/llama-3.3-70b-instruct', messages: [sysPromptPatient, ...chatHistory.slice(-6)], max_tokens: 900, temperature: 0.5 }) });
    const d = await r.json(); const reply = d.choices?.[0]?.message?.content || 'Please try again.';
    chatHistory.push({ role: 'assistant', content: reply });
    document.getElementById('typing2').outerHTML = `<div class="msg-a">${reply.replace(/\\n\\n/g, '<br><br>').replace(/\\n/g, '<br>').replace(/\\*\\*(.*?)\\*\\*/g, '<strong style="color:var(--gold)">$1</strong>')}</div>`;
  } catch (e) { document.getElementById('typing2').outerHTML = `<div class="msg-a">Connection error — please check your API key. For medicine information, try the Medicine Search page.</div>`; }
  msgsDiv.scrollTop = msgsDiv.scrollHeight;
}
