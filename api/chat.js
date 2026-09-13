const DEFAULT_MODEL = 'meta-llama/llama-3.3-70b-instruct:free';
const REQUEST_TIMEOUT_MS = 30_000;

function sendJson(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(payload));
}

function errorMessage(error) {
  if (error?.name === 'AbortError') return 'OpenRouter request timed out.';
  return error?.message || 'Unable to reach the AI service.';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: { message: 'Only POST requests are supported.' } });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return sendJson(res, 503, { error: { message: 'The server is missing OPENROUTER_API_KEY.' } });
  }

  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return sendJson(res, 400, { error: { message: 'Request body must be a JSON object.' } });
  }

  const { messages, model, temperature, max_tokens: maxTokens } = body;
  if (!Array.isArray(messages) || messages.length === 0 || messages.some((message) => !message || typeof message.content !== 'string')) {
    return sendJson(res, 400, { error: { message: 'A non-empty messages array is required.' } });
  }

  if (JSON.stringify(messages).length > 128 * 1024) {
    return sendJson(res, 413, { error: { message: 'The AI request is too large.' } });
  }

  const upstreamBody = {
    model: typeof model === 'string' && model.trim() ? model : process.env.OPENROUTER_MODEL || DEFAULT_MODEL,
    messages,
    temperature: typeof temperature === 'number' ? temperature : 0.2,
    max_tokens: Number.isInteger(maxTokens) ? maxTokens : 1600,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'https://healsmart.vercel.app',
        'X-Title': process.env.OPENROUTER_SITE_NAME || 'HealSmart',
      },
      body: JSON.stringify(upstreamBody),
      signal: controller.signal,
    });

    const raw = await upstream.text();
    let payload;
    try {
      payload = raw ? JSON.parse(raw) : null;
    } catch {
      payload = null;
    }

    if (!upstream.ok) {
      return sendJson(res, upstream.status >= 500 ? 502 : upstream.status, {
        error: { message: payload?.error?.message || `OpenRouter returned HTTP ${upstream.status}.` },
      });
    }

    if (!payload || typeof payload !== 'object' || !payload.choices?.[0]?.message?.content) {
      return sendJson(res, 502, { error: { message: 'OpenRouter returned an empty or malformed response.' } });
    }

    return sendJson(res, 200, payload);
  } catch (error) {
    return sendJson(res, error?.name === 'AbortError' ? 504 : 502, { error: { message: errorMessage(error) } });
  } finally {
    clearTimeout(timeoutId);
  }
}
