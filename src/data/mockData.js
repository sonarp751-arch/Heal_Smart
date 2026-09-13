/**
 * HealSmart — Mock / Seed Data
 * Used when no API key is configured or as default content.
 */

/* ── Drug / Disease Search Results ── */
export const MOCK_DRUGS = {
  metformin: {
    drugName: "Metformin",
    genericName: "Metformin Hydrochloride",
    drugClass: "Biguanide / Antidiabetic",
    originalUse: "Type 2 Diabetes Mellitus",
    pathway: "AMPK activation → hepatic gluconeogenesis suppression",
    confidence: 91,
    genericPrice: "₹8/strip (Jan Aushadhi)",
    janAushadhiAvailable: true,
    summary:
      "Metformin is the most-prescribed oral antidiabetic globally. Its AMPK pathway involvement has sparked research interest in oncology, aging, and PCOS.",
    repurposingTargets: [
      { disease: "Pancreatic Cancer", evidenceLevel: "Phase 3", notes: "AMPK/mTOR pathway; Phase III trials show 23% survival benefit in combination therapy." },
      { disease: "PCOS (Polycystic Ovary Syndrome)", evidenceLevel: "Approved", notes: "Off-label approval widely recommended; improves insulin sensitivity and menstrual regularity." },
      { disease: "Alzheimer's Disease", evidenceLevel: "Phase 2", notes: "Reduces tau phosphorylation via AMPK; ongoing Phase 2 TAME trial." },
      { disease: "Breast Cancer Prevention", evidenceLevel: "Phase 2", notes: "Epidemiological data shows 25% reduced incidence in diabetic patients on metformin." },
    ],
  },
  sildenafil: {
    drugName: "Sildenafil",
    genericName: "Sildenafil Citrate",
    drugClass: "PDE5 Inhibitor",
    originalUse: "Angina / Hypertension (original); Erectile Dysfunction (repurposed)",
    pathway: "PDE5 inhibition → cGMP elevation → smooth-muscle relaxation",
    confidence: 87,
    genericPrice: "₹42/strip (Jan Aushadhi)",
    janAushadhiAvailable: true,
    summary:
      "Sildenafil is itself a landmark repurposing story — developed for angina, pivoted to erectile dysfunction, and later approved for pulmonary arterial hypertension.",
    repurposingTargets: [
      { disease: "Pulmonary Arterial Hypertension", evidenceLevel: "Approved", notes: "FDA approved as Revatio; reduces pulmonary vascular resistance significantly." },
      { disease: "Raynaud's Phenomenon", evidenceLevel: "Phase 2", notes: "PDE5 inhibition improves digital blood flow; strong Phase II data from UK trials." },
      { disease: "Alzheimer's Disease", evidenceLevel: "Phase 2", notes: "Cleveland Clinic genomic study: 69% lower AD incidence in sildenafil users." },
      { disease: "Altitude Sickness", evidenceLevel: "Phase 2", notes: "Reduces high-altitude pulmonary edema; used off-label by mountaineers." },
    ],
  },
  aspirin: {
    drugName: "Aspirin",
    genericName: "Acetylsalicylic Acid",
    drugClass: "NSAID / Antiplatelet",
    originalUse: "Pain, Fever, Cardiovascular prevention",
    pathway: "COX-1/COX-2 irreversible inhibition → prostaglandin suppression",
    confidence: 83,
    genericPrice: "₹3/strip (Jan Aushadhi)",
    janAushadhiAvailable: true,
    summary:
      "Aspirin's COX inhibition mechanism extends well beyond pain relief into cancer prevention and cardiovascular protection.",
    repurposingTargets: [
      { disease: "Colorectal Cancer Prevention", evidenceLevel: "Approved", notes: "FDA breakthrough: 40% recurrence reduction in Lynch syndrome; NF-κB pathway." },
      { disease: "Pre-eclampsia Prevention", evidenceLevel: "Approved", notes: "WHO-recommended low-dose aspirin for high-risk pregnancies; well-established." },
      { disease: "Dementia Prevention", evidenceLevel: "Phase 2", notes: "Neuroinflammation reduction hypothesis; large cohort studies ongoing." },
    ],
  },
  dexamethasone: {
    drugName: "Dexamethasone",
    genericName: "Dexamethasone Sodium Phosphate",
    drugClass: "Corticosteroid",
    originalUse: "Inflammatory and autoimmune conditions",
    pathway: "Glucocorticoid receptor agonism → NF-κB suppression → anti-inflammatory cascade",
    confidence: 94,
    genericPrice: "₹6/strip (Jan Aushadhi)",
    janAushadhiAvailable: true,
    summary:
      "Dexamethasone's repurposing for COVID-19 ARDS is one of the fastest clinical validations in history — saving an estimated one million lives in the first year.",
    repurposingTargets: [
      { disease: "COVID-19 ARDS", evidenceLevel: "Approved", notes: "RECOVERY trial: 35% reduction in 28-day mortality in ventilated patients. WHO-approved protocol." },
      { disease: "Cerebral Edema (brain tumors)", evidenceLevel: "Approved", notes: "Standard-of-care for peritumoral edema; rapid symptom relief." },
      { disease: "Chemotherapy-induced nausea", evidenceLevel: "Approved", notes: "Combined with ondansetron; >80% efficacy in CINV prophylaxis." },
    ],
  },
  "breast cancer": {
    drugName: "Tamoxifen + Repurposing Candidates",
    genericName: "Multiple agents",
    drugClass: "SERM + Emerging",
    originalUse: "ER+ Breast Cancer",
    pathway: "Estrogen receptor antagonism / DNA damage response",
    confidence: 79,
    genericPrice: "₹18–₹52/strip",
    janAushadhiAvailable: true,
    summary:
      "Several approved drugs show strong preclinical and clinical signals for breast cancer treatment or prevention beyond Tamoxifen.",
    repurposingTargets: [
      { disease: "TNBC (Triple Negative)", evidenceLevel: "Phase 2", notes: "Metformin + chemotherapy combinations show 28% improved response rate." },
      { disease: "Metastatic prevention", evidenceLevel: "Phase 1", notes: "Statins (atorvastatin) show anti-metastatic properties in ER- subtypes." },
      { disease: "Chemoprevention", evidenceLevel: "Phase 3", notes: "Low-dose aspirin reduces risk by 16% in large NSAID cohort studies." },
    ],
  },
  "alzheimer": {
    drugName: "Alzheimer's Repurposing Pipeline",
    genericName: "Multiple agents under investigation",
    drugClass: "Mixed — AMPK, PDE5, Anti-inflammatory",
    originalUse: "Various primary indications",
    pathway: "Tau phosphorylation, amyloid clearance, neuroinflammation, synaptic plasticity",
    confidence: 74,
    genericPrice: "Varies",
    janAushadhiAvailable: false,
    summary:
      "Alzheimer's is a prime target for repurposing given the high failure rate of de-novo drug candidates. Several approved drugs show CNS-modifying promise.",
    repurposingTargets: [
      { disease: "Early Alzheimer's (MCI)", evidenceLevel: "Phase 2", notes: "Metformin (TAME trial): reduces tau burden; Sildenafil: 69% risk reduction in retrospective data." },
      { disease: "Neuroinflammation", evidenceLevel: "Phase 2", notes: "Low-dose naltrexone and dexamethasone pulse therapy reduce inflammatory biomarkers." },
      { disease: "Amyloid Clearance", evidenceLevel: "Preclinical", notes: "Rapamycin (mTOR inhibitor) restores autophagy and reduces Aβ plaques in mouse models." },
    ],
  },
};

export const DRUG_ALIASES = {
  "atorvastatin": "metformin",
  "glycomet":     "metformin",
  "glucophage":   "metformin",
  "viagra":       "sildenafil",
  "revatio":      "sildenafil",
  "bayer":        "aspirin",
  "ecosprin":     "aspirin",
  "decadron":     "dexamethasone",
  "covid":        "dexamethasone",
  "alzheimers":   "alzheimer",
  "alzheimer's":  "alzheimer",
  "breast":       "breast cancer",
};

/** Fuzzy-find in mock data */
export function findMockDrug(query) {
  const q = query.toLowerCase().trim();
  if (MOCK_DRUGS[q])       return [MOCK_DRUGS[q]];
  if (DRUG_ALIASES[q])     return [MOCK_DRUGS[DRUG_ALIASES[q]]];

  const hits = Object.entries(MOCK_DRUGS).filter(
    ([key]) => key.includes(q) || q.includes(key.split(" ")[0])
  );
  if (hits.length) return hits.map(([, v]) => v);

  // Return a generic AI-style placeholder so the UI always shows something
  return [{
    drugName: query,
    genericName: "—",
    drugClass: "Under AI Analysis",
    originalUse: "Searching clinical literature…",
    pathway: "Data being retrieved from OpenTargets & ChEMBL",
    confidence: 55,
    genericPrice: "See Jan Aushadhi portal",
    janAushadhiAvailable: false,
    summary: `HealSmart is analysing "${query}" against 3,200+ repurposing candidates. Add an OpenRouter API key in Settings for live AI results.`,
    repurposingTargets: [],
  }];
}

/* ── Health Risk Fallback Profiles ── */
export const HEALTH_FALLBACK = {
  Low: {
    summary: "Your biomarkers fall within normal reference ranges. Your cardiovascular and metabolic profile appears healthy. Continue with a balanced diet and regular physical activity.",
    concerns: ["Monitor cholesterol trends annually", "Maintain current BMI"],
    medications: [
      { name: "Aspirin 75mg (low-dose)", category: "Antiplatelet", reason: "Considered for adults >50 with family CV history; consult your doctor." },
    ],
    generics: [
      { name: "Aspirin (generic)", estimatedCost: "₹3/strip", note: "Available at all Jan Aushadhi stores" },
    ],
    lifestyleAdvice: [
      "150 minutes of moderate aerobic activity per week",
      "Mediterranean diet: vegetables, olive oil, legumes, fish",
      "Annual metabolic panel to track trends",
    ],
  },
  Medium: {
    summary: "One or more biomarkers are outside optimal range. You may be at elevated risk for metabolic or cardiovascular conditions. Lifestyle changes and closer monitoring are advised.",
    concerns: ["Borderline glucose / HbA1c", "Elevated cholesterol or blood pressure"],
    medications: [
      { name: "Amlodipine 5mg", category: "Antihypertensive", reason: "First-line calcium-channel blocker for elevated BP." },
      { name: "Metformin 500mg", category: "Biguanide", reason: "Glucose management; also cardioprotective." },
      { name: "Atorvastatin 10mg", category: "Statin", reason: "Cholesterol reduction; consider with dietary changes." },
    ],
    generics: [
      { name: "Amlodipine (generic)", estimatedCost: "₹5/strip", note: "Jan Aushadhi #2341" },
      { name: "Metformin ER (generic)", estimatedCost: "₹8/strip", note: "Jan Aushadhi #1102" },
      { name: "Atorvastatin 10mg (generic)", estimatedCost: "₹9/strip", note: "Jan Aushadhi #0892" },
    ],
    lifestyleAdvice: [
      "Reduce sodium to <2,300 mg/day",
      "30 minutes brisk walk, 5 days/week",
      "Limit refined carbohydrates and sugary beverages",
    ],
  },
  High: {
    summary: "Multiple biomarkers are significantly elevated. This pattern is associated with heightened risk of type 2 diabetes, hypertension, or cardiovascular event. Please consult a physician promptly.",
    concerns: ["Glucose / HbA1c critically elevated", "Blood pressure stage 2+", "Elevated LDL", "BMI in obese range"],
    medications: [
      { name: "Metformin 1000mg", category: "Biguanide", reason: "Primary glucose management; reduces cardiovascular risk." },
      { name: "Amlodipine + Lisinopril", category: "Combination antihypertensive", reason: "Dual-mechanism BP control for stage 2 hypertension." },
      { name: "Rosuvastatin 20mg", category: "High-intensity statin", reason: "Aggressive LDL reduction in high CV-risk profile." },
      { name: "Aspirin 75mg", category: "Antiplatelet", reason: "Secondary prevention in high-risk cardiovascular patients." },
    ],
    generics: [
      { name: "Metformin ER 500mg (generic)", estimatedCost: "₹8/strip", note: "Extended-release; better tolerated" },
      { name: "Lisinopril/HCTZ (generic)", estimatedCost: "₹10/strip", note: "Dual-mechanism; Jan Aushadhi stocked" },
      { name: "Atorvastatin 40mg (generic)", estimatedCost: "₹12/strip", note: "High-intensity statin equivalent" },
    ],
    lifestyleAdvice: [
      "See a physician within 2 weeks",
      "Structured low-carb or DASH diet with dietitian",
      "Daily BP monitoring at home",
      "Avoid smoking and limit alcohol to <1 unit/day",
    ],
  },
};

/* ── Pharma Dashboard Mock ── */
export const PHARMA_DATA = {
  kpis: [
    { value: "342",  label: "Repurposing Candidates", color: "teal" },
    { value: "87",   label: "Gene Targets Mapped",    color: "navy" },
    { value: "23",   label: "High-Confidence Leads",  color: "amber" },
    { value: "₹2.4B", label: "Potential Market Value", color: "teal" },
  ],
  leads: [
    { phase: "phase-3", label: "Phase III", drug: "Metformin",      target: "Pancreatic Cancer", pathway: "AMPK/mTOR",          confidence: 87 },
    { phase: "phase-2", label: "Phase II",  drug: "Sildenafil",     target: "Raynaud's",          pathway: "PDE5 inhibition",   confidence: 79 },
    { phase: "phase-1", label: "Phase I",   drug: "Dexamethasone",  target: "COVID-ARDS",         pathway: "Anti-inflammatory", confidence: 94 },
    { phase: "phase-app",label: "Approved", drug: "Aspirin",        target: "Colorectal CA prev", pathway: "COX-2 inhibition",  confidence: 91 },
  ],
  geneTargets: [
    { gene: "AMPK",  diseases: 14, drugs: 6,  confidence: 92 },
    { gene: "PDE5",  diseases: 7,  drugs: 4,  confidence: 87 },
    { gene: "mTOR",  diseases: 18, drugs: 8,  confidence: 84 },
    { gene: "COX-2", diseases: 12, drugs: 9,  confidence: 80 },
    { gene: "EGFR",  diseases: 22, drugs: 11, confidence: 78 },
    { gene: "BRAF",  diseases: 9,  drugs: 5,  confidence: 88 },
  ],
};

/* ── Quick search tags ── */
export const QUICK_TAGS = [
  { label: "Atorvastatin",    type: "med" },
  { label: "Breast Cancer",   type: "dis" },
  { label: "Joint Pain",      type: "sym" },
  { label: "Sildenafil",      type: "med" },
  { label: "Alzheimer's",     type: "dis" },
  { label: "Dexamethasone",   type: "med" },
];

export const JAN_STORES_MOCK = [
  { name: "PMJAK Store #447 — Rajajinagar", distance: "1.2 km", stock: true  },
  { name: "PMJAK Store #213 — Malleshwaram", distance: "2.8 km", stock: true  },
  { name: "PMJAK Store #89 — Yeshwanthpur", distance: "4.1 km", stock: false },
];
