// Server-only gateway. Do not import this module from a client component.
export type AIEnvironment = {
  AI_API_KEY?: string;
  AI_MODEL?: string;
  AI_ENABLED?: string;
  AI_ALLOWED_USER_IDS?: string;
  AI_BASE_URL?: string;
  AI_PROVIDER_NAME?: string;
};
type Message = {role: 'system'|'user'|'assistant'; content: string};
const limits = new Map<string, {start: number; count: number}>();
const json = (body: unknown, status = 200, extra: Record<string,string> = {}) => Response.json(body, {status, headers: {'Cache-Control': 'private, no-store', ...extra}});
function settings(env: AIEnvironment) {
  const users = (env.AI_ALLOWED_USER_IDS || '').split(',').map(x => x.trim()).filter(Boolean);
  let base: URL;
  try {base = new URL(env.AI_BASE_URL || 'https://api.openai.com/v1');} catch {return null;}
  // The destination is operator-configured, never supplied by the browser.
  if (base.protocol !== 'https:' || base.username || base.password || base.search || base.hash) return null;
  if (env.AI_ENABLED !== 'true' || !env.AI_API_KEY?.trim() || !env.AI_MODEL?.trim() || !users.length) return null;
  return {key: env.AI_API_KEY, model: env.AI_MODEL.trim(), provider: env.AI_PROVIDER_NAME?.trim() || (base.hostname === 'api.openai.com' ? 'OpenAI' : base.hostname), users, endpoint: base.href.replace(/\/$/, '') + '/chat/completions'};
}
export function aiCatalog(env: AIEnvironment) {
  const config = settings(env);
  return json({models: config ? [{id: config.model, name: config.model, provider: config.provider}] : []});
}
function validPayload(value: unknown, model: string): {model: string; messages: Message[]} | null {
  if (!value || typeof value !== 'object') return null;
  const p = value as Record<string, unknown>;
  if (p.model !== model || !Array.isArray(p.messages) || !p.messages.length || p.messages.length > 32) return null;
  const messages: Message[] = [];
  let total = 0;
  for (const value of p.messages) {
    if (!value || typeof value !== 'object') return null;
    const m = value as Record<string, unknown>;
    if (!['system','user','assistant'].includes(String(m.role)) || typeof m.content !== 'string' || !m.content.trim() || m.content.length > 20000) return null;
    total += m.content.length;
    if (total > 40000) return null;
    messages.push({role: m.role as Message['role'], content: m.content});
  }
  if (messages.at(-1)?.role !== 'user') return null;
  // Only the exact reviewed model and message text can reach the provider.
  return {model, messages};
}
export async function aiChat(request: Request, env: AIEnvironment, userId: string | null, providerFetch: typeof fetch = fetch) {
  const config = settings(env);
  if (!config) return json({error: 'Live AI is coming soon. Your draft is saved in this session.', code: 'not_configured'}, 503);
  if (!userId) return json({error: 'Sign in to use live AI. Your draft is preserved.', code: 'sign_in_required'}, 401);
  if (!config.users.includes(userId)) return json({error: 'Live AI access is not enabled for this account yet.', code: 'access_denied'}, 403);
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) return json({error: 'Open the workspace to send this request.'}, 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json({error: 'Use a JSON request.'}, 415);
  if (Number(request.headers.get('content-length')) > 200000) return json({error: 'This request is too large.'}, 413);
  let body: unknown;
  try {
    // Read incrementally so chunked requests cannot bypass the body limit.
    const reader = request.body?.getReader();
    if (!reader) return json({error: 'The request is empty.'}, 400);
    const decoder = new TextDecoder(); let bytes = 0; let text = '';
    while (true) {const chunk = await reader.read(); if (chunk.done) break; bytes += chunk.value.byteLength; if (bytes > 200000) {await reader.cancel(); return json({error: 'This request is too large.'}, 413);} text += decoder.decode(chunk.value, {stream:true});}
    text += decoder.decode(); body = JSON.parse(text);
  } catch {return json({error: 'The request could not be read.'}, 400);}
  const envelope = body as {approved?: unknown; payload?: unknown} | null;
  const payload = validPayload(envelope?.payload, config.model);
  if (envelope?.approved !== true || !payload) return json({error: 'Review a valid request before sending it.'}, 400);
  // A small per-instance guard supplements the required account allowlist.
  // Set provider-side spend limits before enabling access; this is not a global quota.
  const now = Date.now();
  for (const [id, limit] of limits) if (now - limit.start >= 60000) limits.delete(id);
  const limit = limits.get(userId) || {start: now, count: 0};
  if (limit.count >= 4) return json({error: 'Please wait a minute before sending another request.'}, 429, {'Retry-After':'60'});
  limit.count++; limits.set(userId, limit);
  const controller = new AbortController();
  const cancel = () => controller.abort();
  request.signal.addEventListener('abort', cancel, {once:true});
  if (request.signal.aborted) cancel();
  const timeout = setTimeout(cancel, 30000);
  try {
    const upstream = await providerFetch(config.endpoint, {
      method: 'POST', redirect: 'error', signal: controller.signal,
      headers: {'Authorization': `Bearer ${config.key}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({...payload, stream:false, store:false, max_completion_tokens:1200}),
    });
    // Never return the provider's raw errors, headers, credentials or billing data.
    if (!upstream.ok) return json({error: upstream.status === 429 ? 'The AI provider is busy. Try again later.' : 'The AI provider could not complete this request. Your draft is preserved.'}, 502);
    const result = await upstream.json() as {choices?: {message?: {content?: unknown; refusal?: unknown}}[]};
    const text = result.choices?.[0]?.message?.content;
    if (typeof text !== 'string' || !text.trim() || text.length > 60000) return json({error: 'The AI provider returned no usable text. Your draft is preserved.'}, 502);
    return json({text, model:config.model});
  } catch {return json({error: controller.signal.aborted ? 'The request was stopped or timed out. Your draft is preserved.' : 'The AI provider could not be reached. Your draft is preserved.'}, 502);}
  finally {clearTimeout(timeout); request.signal.removeEventListener('abort', cancel);}
}
