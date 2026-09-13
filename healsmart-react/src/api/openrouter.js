/**
 * HealSmart — OpenRouter API Integration
 * ─────────────────────────────────────────
 * All AI calls flow through this file.
 * Works with any OpenAI-compatible model served by OpenRouter.
 *
 * Get your free API key → https://openrouter.ai/keys
 * Set it in .env:  REACT_APP_OPENROUTER_API_KEY=sk-or-v1-...
 *   or via the Settings page (stored in localStorage).
 */

const BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

/** Resolve key: runtime arg → env var */
function resolveKey(runtimeKey = "") {
  return runtimeKey || process.env.REACT_APP_OPENROUTER_API_KEY || "";
}

/** Active model from env or safe default */
function resolveModel() {
  return (
    process.env.REACT_APP_OPENROUTER_MODEL ||
    "mistralai/mistral-7b-instruct"
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
export async function callOpenRouter(system, user, apiKey = "") {
  const key = resolveKey(apiKey);
  if (!key) throw new Error("NO_KEY");

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.REACT_APP_SITE_URL  || "http://localhost:3000",
      "X-Title":      process.env.REACT_APP_SITE_NAME || "HealSmart",
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

  const data = await res.json();
  return (data.choices?.[0]?.message?.content || "").trim();
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
 * Generate a plain-text AI explanation for any drug/concept.
 * (Used in tooltips and info cards.)
 */
export async function explainConcept(concept, apiKey) {
  const system = `You are a concise biomedical educator. 
Explain in 2-3 sentences, plain English, suitable for a non-specialist.
Do NOT use markdown.`;
  const user = `Briefly explain: ${concept}`;
  return await callOpenRouter(system, user, apiKey);
}
