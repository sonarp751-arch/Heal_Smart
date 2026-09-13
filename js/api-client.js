const REQUEST_TIMEOUT_MS = 30_000;

export async function requestAI(_upstreamUrl, init = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const headers = new Headers(init.headers || {});
    headers.delete('Authorization');
    headers.set('Content-Type', 'application/json');

    const response = await fetch('/api/chat', {
      ...init,
      headers,
      signal: controller.signal,
    });

    const raw = await response.clone().text();
    let payload = null;
    try {
      payload = raw ? JSON.parse(raw) : null;
    } catch {
      throw new Error('The AI service returned malformed JSON.');
    }

    if (!response.ok) {
      throw new Error(payload?.error?.message || `AI request failed with HTTP ${response.status}.`);
    }

    if (!payload?.choices?.[0]?.message?.content) {
      throw new Error('The AI service returned an empty response.');
    }

    return response;
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('The AI request timed out. Please try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
