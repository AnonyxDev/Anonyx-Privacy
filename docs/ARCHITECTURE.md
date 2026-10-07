# Architecture

The React application separates local preparation from optional external execution. `lib/workspace.ts` builds a request from the prompt, selected context and selected conversation turns. `lib/request-review.ts` clones the request into an approval snapshot. Changes to the effective request invalidate approval.

| Layer | Responsibility |
| --- | --- |
| Routes and components | Rendering, local interaction, context selection, and request review |
| Request helpers | Masking, payload construction, approval, import/export validation |
| Wallet helpers | Connector identification and active connection selection |
| External adapter | Optional isolated provider integration across an explicit origin boundary |
| Worker build | Page delivery and framework runtime |

The wallet state is separate from payload generation. Automatic payload construction does not attach wallet addresses, balances, or context inventory metadata. Manually typed identifiers remain user-provided content.

Session state stays in tab memory. Users can explicitly persist context to unencrypted local storage; no cloud context database is implemented. Ending a session invalidates late UI responses but cannot undo a request already received by a provider.

Motion uses GSAP and React Three Fiber. The disclosure chamber visualizes selected context crossing a boundary; it is an explanatory visualization, not a cryptographic execution proof. Native unit tests cover particle boundaries and lifecycle timing.

The application is built using Vinext/Vite with a Cloudflare Worker output. Clean clones use the portable profile; the original Site can retain its managed profile. `build/` contains framework deployment integration, not product inference infrastructure.

The whitepaper is structured in `lib/whitepaper.ts` and rendered directly by the whitepaper route. Architecture proposals in it are distinct from implemented services.

## Agents and prepared results

`lib/agents.ts` defines six agent instruction profiles. `withAgent` inserts the selected instructions into the exact reviewed payload. `lib/home-requests.ts` supplies ten synthetic practical examples; `lib/guided-results.ts` supplies their prepared outputs. Homepage, workspace, and walkthrough compare the entire effective request before offering a corresponding result. Any request change invalidates approval. Prepared outputs are never substituted for a provider response.

`lib/project-links.ts` supplies the contract address and X URL. `ContractAddress` copies the full address and handles denied clipboard access. These links do not change inference or wallet execution.

The eight routes include `/walkthrough`. Whitepaper v2.1 contains an abstract and 15 chapters; `docs/Anonyx-Whitepaper-v2.md` is its readable Markdown companion.


## Server gateway update · 7 October 2026

The chat now uses a same-origin server gateway, not the legacy external popup adapter. Approved text passes through Anonyx’s server before reaching the configured provider. Keys stay on the server; platform-authenticated accounts must be allowlisted. No prompt database or application prompt logging is added. See [AI connection setup](ai-connection.md) for activation and remaining verification.
