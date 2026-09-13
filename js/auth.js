import { setCurrentPortal } from './state.js';
import { toast } from './utils.js';
import { buildAppShell } from './app.js';

export function showLoginScreen(portal = 'pharma') {
  document.getElementById('landing').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  if (portal) switchLoginTab(portal);
}

export function switchLoginTab(tab) {
  setCurrentPortal(tab);
  ['pharma', 'patient'].forEach(t => {
    document.getElementById('ltab-' + t).classList.remove('active');
    document.getElementById('lform-' + t).classList.add('hidden');
  });
  document.getElementById('ltab-' + tab).classList.add('active');
  document.getElementById('lform-' + tab).classList.remove('hidden');
}

export function submitPharmaApp() {
  const email = document.getElementById('ph-email').value;
  const empid = document.getElementById('ph-empid').value;
  if (!email || !empid) { toast('Please fill in company email and employee ID'); return; }
  toast('Application submitted! Verification within 24 hours. Logging you in for demo…');
  setTimeout(() => gotoApp('pharma'), 1800);
}

export function sendPatientOtp() {
  const contact = document.getElementById('pt-contact').value;
  if (!contact) { toast('Enter mobile number or email'); return; }
  document.getElementById('pt-dest').textContent = contact;
  document.getElementById('patient-step1').classList.add('hidden');
  document.getElementById('patient-step2').classList.remove('hidden');
  toast('OTP sent to ' + contact);
}

export function gotoApp(portal) {
  setCurrentPortal(portal);
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-shell').classList.remove('hidden');
  buildAppShell(portal);
}
