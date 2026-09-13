import { setCurrentPortal, setCurrentPage, currentPortal, currentPage } from './state.js';
import { toast } from './utils.js';
import { showLoginScreen, switchLoginTab, submitPharmaApp, sendPatientOtp, gotoApp } from './auth.js';
import { buildAppShell, showPg, renderPharmaPages, renderPatientPages } from './app.js';
import { dteQuick, runDTE } from './api-dte.js';
import { setRMode, qRep, runRep } from './api-repurposing.js';
import { initDockingCanvas, setSmiles, setPdb, runDock } from './api-docking.js';
import { runLit } from './api-literature.js';
import { setTgt, runTgt } from './api-targets.js';
import { qCopilot, sendChat, sendPatientChat, sendChatWith } from './api-copilot.js';
import { setPMode, qMed, runMed, runJan } from './api-patient.js';

// Attach functions to the window object so inline HTML 'onclick' handlers can find them
window.showLoginScreen = showLoginScreen;
window.switchLoginTab = switchLoginTab;
window.submitPharmaApp = submitPharmaApp;
window.sendPatientOtp = sendPatientOtp;
window.gotoApp = gotoApp;

window.buildAppShell = buildAppShell;
window.showPg = showPg;

// Pharma Functions
window.dteQuick = dteQuick;
window.runDTE = runDTE;
window.setRMode = setRMode;
window.qRep = qRep;
window.runRep = runRep;
window.initDockingCanvas = initDockingCanvas;
window.setSmiles = setSmiles;
window.setPdb = setPdb;
window.runDock = runDock;
window.runLit = runLit;
window.setTgt = setTgt;
window.runTgt = runTgt;
window.qCopilot = qCopilot;
window.sendChat = sendChat;

// Patient Functions
window.setPMode = setPMode;
window.qMed = qMed;
window.runMed = runMed;
window.runJan = runJan;
window.sendPatientChat = sendPatientChat;
window.sendChatWith = sendChatWith;

// Utils
window.toast = toast;

console.log("HealSmart modular application initialized");
