> Historical record for earlier website builds. See [current validation](VALIDATION.md) for the updated repository package. Some behaviors described below have since been replaced.

# Implementation and verification record

Date: 3 October 2026. Target: this Anonyx source checkout and supervised Chromium preview. Test data was synthetic. No wallet was connected, no provider login was attempted, and no financial action occurred.

## Release assessment

Ready for private review of the local demo within the tested scope. Full PRD P0 release criteria are not yet met. Live inference, authenticated wallet flows, mobile/assistive-technology coverage, and formal performance measurement remain open.

## Executed checks

| Case | Requirement | Result and evidence |
|---|---|---|
| U1 | AX008 | Passed: email and phone masking fixtures; ordinary text preserved |
| U2 | AX004/011/022 | Passed: exact chosen context/turns, no identity inventory |
| U3 | AX011 | Passed: stale IDs cannot reintroduce deleted context |
| U4 | AX012 | Passed: valid export shape, unknown properties stripped |
| U5 | AX012 | Passed: invalid versions, malformed tags, duplicate IDs rejected |
| U6 | AX010/012 | Passed: title/body/count boundaries |
| U7 | AX006 | Passed: deterministic output explicitly disclaims live AI |
| U8 | AX022 | Passed: explicit provider pinning in payload builder |
| B1 | AX001/004/006/008 | Passed in browser: mask synthetic email/phone, review JSON, run labeled simulation |
| B2 | AX004 | Passed in browser: edit after review disables Run |
| B3 | AX010/011 | Passed in browser: create context, select it, inspect exact system-message inclusion |
| B4 | AX010/013 | Passed in browser: saved item survives reload; draft/transcript clear; selection resets |
| B5 | AX007 | Passed in browser: individually review/run Model A and B; both complete with model labels |
| B6 | AX013 | Passed in browser: End Session confirmation clears workflow state and reports context retention |
| B7 | AX015/016 | Passed in browser: malformed JSON disables copy; demo API result explicitly labeled |
| B8 | AX017 | Passed in browser: wallet modal opens with official MetaMask, Rabby, Coinbase and browser-wallet icons; WalletConnect absent |
| Build | All routes | TypeScript check passed. Production build passed before final packaging; final build rerun passed on current product source |

Unit checks are in `tests/core.test.mjs`; execute `npm run test:core`. Eight tests passed directly under Node. Browser steps used the real UI; they do not prove provider or wallet network behavior.

## Defects found and repaired

- HTTP preview lacked `crypto.randomUUID`: local simulation failed. Added a cryptographic random-values UUID fallback; reran the original flow successfully.
- Invoking the MetaMask factory required a WalletConnect project ID even for intended injected-only use. Replaced factory invocation with injected connector definitions and library-supplied SVG assets. Modal now loads without WalletConnect configuration.
- Wagmi SSR hydration with null persistence produced a `rehydrate` rejection on lazy client initialization. Disabled SSR hydration in the client-loaded wallet module; confirmed a clean modal load.
- Hero deadline could replace a successful scene later. Added completed-readiness guard.
- Static hero initially exposed adjacent portions of the supplied board. Constrained it to the artwork region using the asset's aspect ratio.

## Traceability and remaining work

| Requirements | Implementation status | Verification limits |
|---|---|---|
| AX001,004,006,008 | Local workspace implemented | Core browser journey and pure data tests passed |
| AX002,003,005 | Demo selection/rules implemented; external adapter coded and disabled | Live catalog, capability metadata and provider auth unverified |
| AX007 | Stepwise demo comparison/refinement implemented; external calls gated | Comparison browser-tested; refinement, stop/late races need broader test matrix |
| AX009,024 | Fixed illustrative detection and architecture disclosures | No semantic detector or attestation claimed |
| AX010–014 | Context controls, versioned imports, export, persistence, deletion, sessions | Core persistence tested; storage denial/quota/import UI/download/late-response fault injection not run |
| AX015–016 | Validated JSON builder and API simulations | Invalid-copy and demo-response UI tested; clipboard-denial path not induced |
| AX017–018 | Browser connectors, disconnect, network switch, native balance | Selector tested; real accept/reject, balance RPC and mobile handoff need a wallet. Missing-wallet behavior still requires cross-browser verification |
| AX019–020 | Simulated credit arithmetic and TBA economics | UI source reviewed; no token contract, prices or transaction calls |
| AX021–023 | Payload boundaries, explicit external disclosure, separate-origin adapter code | External origin not deployed/configured; live mode cannot be enabled in this build |
| AX025–027 | Scene, marketing timeline, route wipes and interaction states | Desktop composition inspected; rapid-navigation, mobile and full back/scroll tests remain |
| AX028–031 | Asset-stage loader, readiness callback, timeout/static path, reduced-motion handling | Static fallback observed; WebGL/font failure and reduced-motion matrix not fully induced |
| AX032 | Semantic controls, Radix focus management, keyboard focus styling, responsive CSS | No claim of WCAG conformance; 320px/200% zoom, screen-reader and device checks remain |
| AX033 | Lazy scene/wallet chunks, limited DPR, offscreen pause, self-hosted fonts | No field CWV or five-run Android/4G measurement; base-JS/hero budgets require measurement |
| WebMCP | Feature-detected prompt staging tool | Browser reported no available registry tools; validation unavailable |

## Public release dependencies

- Configure and verify the separate provider origin before enabling real inference.
- Supply an optional WalletConnect project ID and approve a production RPC provider.
- Confirm legal operator/support details, token economics and any public social destinations.
- Complete the outstanding PRD accessibility, mobile, external-service, and performance acceptance checks.

No unexecuted check is counted as passed. The user explicitly approved source upload and owner-only publication on 3 October 2026. Publication status is verified through the Sites deployment service. Immutable published versions support rollback.
