> Historical record for earlier website builds. See [current validation](VALIDATION.md) for the updated repository package. Some behaviors described below have since been replaced.

# Interaction and motion revision — 3 October 2026

## Reported failure and repair

The original homepage-to-Privacy journey reproduced a React `removeChild` exception in Chromium. The homepage used GSAP ScrollTrigger pinning, which reparents a React-owned section; its passive-effect cleanup ran during route teardown. Replaced pinning with transform-only scroll effects and layout-effect cleanup scoped to the homepage. Removed the competing smooth-scroll manager. Client navigation still preserves the in-memory workspace provider.

Replaced homepage mock controls with a functioning local prompt editor, pattern masking, context toggle, payload inspector, reset action, and prompt handoff to `/workspace`. Native page links remain real links. Hero loading no longer puts a full-screen layer over navigation. Wallet module loading now has visible dismissible feedback.

## Motion and 3D

- Staggered hero introduction, scroll-driven preview tilt, section reveals, architecture-layer stagger, hero parallax, card and button feedback.
- Self-hosted Meshy core with violet physical material inside the existing branded aperture.
- Separate/reassemble, rotate, and pause controls; pointer response and continuous gentle motion.
- Animation time stops when paused; offscreen/document-hidden rendering pauses; reduced-motion preferences suppress decorative page motion and start 3D paused.
- Nonblocking artwork fallback when WebGL or scene loading is unavailable.

## Meshy asset provenance

- Resource: `text-to-3d` preview; task `01a0ffe5-7503-711e-b4d2-b899fb3bff9f`; consumed credits: 20.
- Resource: `remesh`; task `01a0ffea-0a11-7478-8d9d-8a6dea48c230`; consumed credits: 5.
- Total reported cost for these tasks: 25 credits.
- Project folder: `/workspace/scratch/c2b959b4375f/meshy_output/20261003_005416_anonyx-core_01a0ffe5`.
- Integrated file: `public/models/anonyx-core.glb`; 498,612 bytes; 11,497 triangles.
- SHA256: `5cc27c434bcb521f1afe9d3b68b4cfc4a48ecf5606c6744248b8ac7153d4704a`.
- Rendered preview: `docs/assets/meshy-core-preview.png`, visually inspected. It establishes the appearance, not topology quality.
- Three.js GLTFLoader parsed the integrated model successfully. Nonzero finite bounds: 1.903 × 1.764 × 1.853 before runtime normalization.
- Original geometry was 17,598,612 bytes and 733,382 triangles; the optimized asset is about 97% smaller.

## Focused verification

| Case | Status | Evidence |
|---|---|---|
| Original homepage → Privacy failure | Passed after repair | Correct Privacy page and main focus; no React DOM-removal error |
| Main navigation | Passed | Workspace, Privacy, Developers, Tokenomics, Whitepaper routes visited by clicking links |
| Homepage mask and inspect | Passed | Synthetic email transformed to `[EMAIL]`; inspected payload matches |
| Homepage context exclusion | Passed | Toggle off produces `context: []` |
| Continue in workspace | Passed | Masked prompt retained in composer through client navigation |
| Workspace review and run | Passed | Reviewed simulation completes and is explicitly labeled |
| Privacy mask button | Passed | Synthetic email and phone transformed locally |
| Token credit controls | Passed | Add 100 then use 10 produces 90 credits |
| Developer simulation | Passed | Button produces labeled simulated 200 response |
| Wallet chooser | Passed | Connect Wallet shows official browser-wallet choices; Close dismisses the chooser |
| Production build | Passed | Sites build helper completed all five phases and emitted all seven routes |
| TypeScript | Passed | `npx tsc --noEmit` exits successfully |
| Existing pure data tests | Passed | All 8 tests passed |
| GLB loading | Passed | Actual integrated file parsed with the Three.js loader |
| Rendered WebGL controls | Blocked | Test Chromium explicitly reports GL_VENDOR/GL_RENDERER Disabled and cannot create a WebGL context; fallback remains usable |
| Mobile, touch, reduced-motion device matrix | Not run | Responsive CSS and preference handling reviewed; available browser has no advertised viewport/emulation controls |

A preview-only stale module-resolution error after adding a component was cleared by restarting the supervised preview. No framework or security configuration was weakened. No real provider request, wallet connection, signature, or transaction was performed. Existing live-inference limitations remain as documented in `verification.md`.
