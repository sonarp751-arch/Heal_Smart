export interface AIReasoningRequest {
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  apiKey?: string;
  model?: string;
}

export async function queryOpenRouterReasoning(req: AIReasoningRequest): Promise<string> {
  const apiKey = req.apiKey || import.meta.env.VITE_OPENROUTER_API_KEY || '';
  const model = req.model || import.meta.env.VITE_OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free';

  if (!apiKey) {
    return `[AI Interpretation Note]: OpenRouter API Key is not configured. To enable live LLM reasoning over retrieved evidence, provide an API Key in the Settings page.`;
  }

  const defaultSystem = `You are a scientific AI assistant in the InSilicoRepurposer drug discovery platform.
CRITICAL INTEGRITY INSTRUCTIONS:
- You must NEVER invent genes, targets, PDB IDs, docking scores, affinities, or citations.
- Summarize and synthesize the provided retrieved scientific data objectively.
- Distinguish between experimental evidence, database records, and in silico hypotheses.
- Maintain professional computational biology and medicinal chemistry terminology.`;

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://insilico-repurposer.local',
        'X-Title': 'InSilicoRepurposer',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: req.systemPrompt || defaultSystem },
          { role: 'user', content: req.userPrompt },
        ],
        temperature: req.temperature ?? 0.2,
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenRouter returned status ${res.status}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'No interpretation generated.';
  } catch (err: any) {
    return `[AI Interpretation Error]: ${err.message || 'Unable to connect to OpenRouter API.'}`;
  }
}
