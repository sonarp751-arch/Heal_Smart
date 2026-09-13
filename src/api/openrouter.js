/**
 * HealSmart — OpenRouter API Integration
 * ─────────────────────────────────────────
 * All AI calls flow through this file.
 * Works with any OpenAI-compatible model served by OpenRouter.
 *
 * AI requests are proxied through the same-origin Vercel /api/chat route.
 */

const BASE_URL = "/api/chat";

/** Active model from env or safe default */
function resolveModel() {
  return (
    "meta-llama/llama-3.3-70b-instruct:free"
  );
}

/**
 * Core call — sends a system + user message to OpenRouter.
 *
 * @param {string} system     System-role instruction
 * @param {string} user       User message / query
 * @param {string} [apiKey]   Optional runtime key (overrides env)
 * @returns {Promise<string>} Raw text content from the model
 */
export async function callOpenRouter(system, user, _apiKey = "") {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model:      resolveModel(),
      max_tokens: 1400,
      temperature: 0.35,
      messages: [
        { role: "system", content: system },
        { role: "user",   content: user   },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }

  const data = await res.json().catch(() => null);
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("The AI service returned an empty response.");
  }
  return content.trim();
}

/**
 * Safely parse JSON that the model may have wrapped in ```json ... ```.
 */
export function safeParseJSON(raw) {
  try {
    return JSON.parse(
      raw.replace(/```json\s*/gi, "").replace(/```/g, "").trim()
    );
  } catch {
    return null;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   Feature-specific helpers
═══════════════════════════════════════════════════════════════════ */

/**
 * Analyse health biomarkers and return a structured risk assessment.
 *
 * @param {{ glucose, cholesterol, bp, bmi, age, notes }} params
 * @param {string} apiKey
 * @returns {Promise<HealthResult|null>}
 */
export async function analyseHealthReport(params, apiKey) {
  const system = `You are a clinical-informatics AI embedded in HealSmart,
a health-education platform. You NEVER prescribe medication; this is for
educational awareness only.

Respond with ONLY valid JSON (no markdown fences, no extra text):
{
  "riskLevel": "Low" | "Medium" | "High",
  "riskScore": <0-100>,
  "summary": "<2-3 sentence plain-English explanation>",
  "concerns": ["<concern>"],
  "medications": [
    { "name": "<drug name>", "category": "<class>", "reason": "<why relevant>" }
  ],
  "generics": [
    { "name": "<generic name>", "estimatedCost": "<e.g. ₹8/strip>", "note": "<brief>" }
  ],
  "lifestyleAdvice": ["<advice>", "<advice>"]
}`;

  const user = `Analyse these biomarkers and return a risk assessment JSON:
Glucose: ${params.glucose || "—"} mg/dL
Total Cholesterol: ${params.cholesterol || "—"} mg/dL
Blood Pressure (systolic): ${params.bp || "—"} mmHg
BMI: ${params.bmi || "—"}
Age: ${params.age || "—"} years
Additional notes: ${params.notes || "none"}`;

  const raw = await callOpenRouter(system, user, apiKey);
  return safeParseJSON(raw);
}

/**
 * Search drug / disease repurposing intelligence.
 *
 * @param {string} query   Drug name or disease
 * @param {string} apiKey
 * @returns {Promise<DrugResult[]|null>}
 */
export async function searchDrugInsight(query, apiKey) {
  const system = `You are a biomedical AI for HealSmart. Draw on clinical
literature, OpenTargets, ChEMBL, and DrugBank knowledge.

Return ONLY a JSON array (1-3 objects, no markdown):
[{
  "drugName": "<name>",
  "genericName": "<generic>",
  "drugClass": "<class>",
  "originalUse": "<approved indication>",
  "pathway": "<mechanism / target>",
  "confidence": <50-98>,
  "repurposingTargets": [
    { "disease": "<name>", "evidenceLevel": "Preclinical"|"Phase 1"|"Phase 2"|"Phase 3"|"Approved", "notes": "<1-2 sentences>" }
  ],
  "genericPrice": "<e.g. ₹12/strip>",
  "janAushadhiAvailable": true | false,
  "summary": "<2-3 sentence overview>"
}]`;

  const user = `Drug / disease query: "${query}". Return structured repurposing JSON.`;

  const raw = await callOpenRouter(system, user, apiKey);
  const parsed = safeParseJSON(raw);
  if (!parsed) return null;
  return Array.isArray(parsed) ? parsed : [parsed];
}

/**
 * Deep multi-omics drug repurposing & target identification intelligence.
 * Generates structured omics targets, GTEx expression, GWAS associations, and signature reversal.
 *
 * @param {string} query   Drug name, disease, or gene
 * @param {string} apiKey
 * @returns {Promise<OmicsDrugResult|null>}
 */
export async function analyseOmicsDrugRepurposing(query, apiKey) {
  const system = `You are a precision biomedical & computational multi-omics AI for HealSmart.
Given a drug name, disease, or gene target, generate a deep multi-omics drug repurposing profile based on UniProt, ChEMBL, GTEx, OpenTargets, CMap/L1000, and clinical trials.

Respond with ONLY a single valid JSON object (no markdown, no extra commentary):
{
  "drugName": "<Drug Name>",
  "genericName": "<Generic Name>",
  "drugClass": "<Chemical / Pharmacological Class>",
  "primaryIndication": "<Approved primary indication>",
  "genericPrice": "<e.g. ₹15 / strip>",
  "janAushadhiPrice": "<e.g. ₹5 / strip>",
  "janAushadhiAvailable": true,
  "summary": "<2-3 sentence overview of multi-omics mechanism>",
  "targets": [
    {
      "geneSymbol": "<e.g. PRKAA1>",
      "geneName": "<Full Gene / Protein Name>",
      "uniprotId": "<e.g. P54646>",
      "chemblTargetId": "<e.g. CHEMBL2148>",
      "pdbStructure": "<e.g. 4CFE>",
      "targetClass": "<e.g. Serine/Threonine Kinase>",
      "mechanismOfAction": "<e.g. Direct Allosteric Activator>",
      "bindingAffinity": "<e.g. Kd = 120 nM>",
      "druggabilityTier": "Tier 1: Approved High Tractability" | "Tier 2: Bioactive Druggable Target",
      "subcellularLocation": "<e.g. Cytosol & Nucleus>",
      "gtexExpression": {
        "Liver": 45.2, "Brain": 30.1, "SkeletalMuscle": 60.5, "Heart": 48.0,
        "Kidney": 38.0, "Adipose": 42.0, "Lung": 29.0, "Blood": 18.0
      },
      "diseaseDysregulation": [
        { "disease": "<Disease Name>", "log2FC": -1.75, "pValue": "1.2e-5", "status": "Downregulated in Disease" }
      ],
      "geneticsEvidence": {
        "gwasTrait": "<GWAS Trait>",
        "gwasPvalue": "1.4e-10",
        "openTargetsScore": 0.92,
        "eqtlSummary": "<eQTL finding>",
        "clinvarPhenotype": "<Phenotype>"
      },
      "pathways": ["<Reactome / KEGG pathway 1>", "<Pathway 2>"],
      "stringInteractions": ["<Partner1>", "<Partner2>", "<Partner3>"]
    }
  ],
  "signatureReversal": [
    {
      "disease": "<Repurposed Disease>",
      "reversalScore": -0.88,
      "pValue": "3.2e-8",
      "concordanceRatio": "88% Reversal",
      "upregulatedInDiseaseDownregulatedByDrug": ["<GeneA>", "<GeneB>", "<GeneC>"],
      "downregulatedInDiseaseUpregulatedByDrug": ["<GeneD>", "<GeneE>"],
      "mechanisticHypothesis": "<Transcriptomic signature reversal hypothesis>"
    }
  ],
  "repurposingCandidates": [
    {
      "disease": "<Repurposed Disease>",
      "phase": "Phase 2" | "Phase 3" | "Approved",
      "overallRepurposingScore": 92,
      "targetAffinityScore": 90,
      "omicsReversalScore": 94,
      "geneticsScore": 88,
      "safetyRecordScore": 96,
      "keyMechanism": "<Biological mechanism>",
      "recommendedGenericSavings": "<Cost savings>"
    }
  ]
}`;

  const user = `Query: "${query}". Return structured multi-omics repurposing profile JSON.`;
  const raw = await callOpenRouter(system, user, apiKey);
  return safeParseJSON(raw);
}

