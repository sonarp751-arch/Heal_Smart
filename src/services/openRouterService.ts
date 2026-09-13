export interface AIReasoningRequest {
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  apiKey?: string;
  model?: string;
}

export async function queryOpenRouterReasoning(req: AIReasoningRequest): Promise<string> {
  const defaultSystem = `You are a scientific AI assistant in the InSilicoRepurposer drug discovery platform.
CRITICAL INTEGRITY INSTRUCTIONS:
- You must NEVER invent genes, targets, PDB IDs, docking scores, affinities, or citations.
- Summarize and synthesize the provided retrieved scientific data objectively.
- Distinguish between experimental evidence, database records, and in silico hypotheses.
- Maintain professional computational biology and medicinal chemistry terminology.`;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: req.model || 'meta-llama/llama-3.3-70b-instruct:free',
        messages: [
          { role: 'system', content: req.systemPrompt || defaultSystem },
          { role: 'user', content: req.userPrompt },
        ],
        temperature: req.temperature ?? 0.2,
      }),
    });

    const raw = await res.text();
    let data: any;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      throw new Error('The AI service returned malformed JSON.');
    }
    if (!res.ok) {
      throw new Error(data?.error?.message || `AI request failed with HTTP ${res.status}.`);
    }
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || !content.trim()) {
      throw new Error('The AI service returned an empty response.');
    }
    return content.trim();
  } catch (err: any) {
    return `[AI Interpretation Error]: ${err.message || 'Unable to connect to OpenRouter API.'}`;
  }
}
