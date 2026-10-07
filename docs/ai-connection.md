# Connecting the Anonyx chat to live AI

The workspace uses the same-origin `/api/ai` gateway. It sends an immutable, explicitly approved request containing agent instructions, the user's prompt, and only the selected context and conversation turns. Wallet fields and the rest of the context library are not attached. No AI key is stored in browser storage or client code.

## Operator setup

1. Configure a provider project and its billing/spend limits. Choose a text model supporting the Chat Completions API and `max_completion_tokens`.
2. Set `AI_API_KEY` as a **server secret** in the hosting environment. Never paste it into the workspace, chat, a public repository, or a `NEXT_PUBLIC_*` variable. For managed OpenAI key provisioning in ChatGPT, use the OpenAI Developers plugin.
3. Set `AI_MODEL` to the exact provider model ID. Set `AI_BASE_URL` to the provider's HTTPS `/v1` base URL and `AI_PROVIDER_NAME` to its displayed name. The default endpoint is OpenAI.
4. Set `AI_ALLOWED_USER_IDS` to a comma-separated list of approved Site-authenticated user IDs. Use trusted hosting identity information. The API rejects anonymous users and accounts outside this list; it never treats wallet connection as AI authorization. Sign-in is the platform's `/signin-with-chatgpt?return_to=%2Fworkspace` flow.
5. Set `AI_ENABLED=true`, publish with the runtime secrets, then verify an approved request with an allowlisted account. A failed connection preserves the draft and does not manufacture an answer.

The public website and local preparation remain accessible without AI sign-in. Until all required settings exist, the gateway returns an empty catalog and rejects inference. The final Run action displays the coming-soon notice and keeps prepared outputs clearly identified as examples.

## Boundaries and checks

- The endpoint validates the configured model, message roles, approval flag, same-origin requests, body size, number of messages and total text size.
- The server reconstructs only `{model, messages}`; browser-provided endpoints, credentials, tools, metadata and unknown fields do not reach the provider.
- Responses are not cached. The application does not write prompts or responses to a database or log them. Hosting and provider operational policies still apply.
- `store:false` requests no Chat Completions output storage for provider distillation/evals. It does **not** promise zero retention, anonymity or that all provider logging is disabled. See [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data).
- Each allowlisted account is limited to four requests per minute **per Worker instance**. This is a burst guard, not a durable global quota. Before wider access, add a durable quota/budget service and keep provider spend limits in place.
- A request times out after 30 seconds. Stop aborts the browser request and propagates cancellation where supported; a provider may already have processed or charged for it. No automatic inference retries occur.
- The tests use a controlled provider stub for success, rejection, timeout/cancellation and sanitized errors. They do not prove a real provider integration; that requires an operator-supplied key and an authorized live check.

Provider API reference: [Chat Completions](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create).
