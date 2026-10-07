# Selective disclosure hero — 3 October 2026

The former headline and floating logo did not explain Anonyx's purpose. The new hero presents an interactive privacy boundary: choose example context on the left, inspect a mechanical filter in the center, and review the resulting request on the right. Large editorial typography, technical lane labels, and a receipt-shaped output replace the generic split hero.

The Meshy object is a louvered filter, a visual metaphor for selective disclosure rather than a three-dimensional logo. Violet represents information on the user's side; teal represents reviewed output. Pointer response, user-controlled rotation, a scanning light, context particles, and a request reveal support this story. Pausing motion shows results immediately. OS reduced-motion preferences pause the hero by default. A still preview remains usable when WebGL is unavailable.

The illustration runs locally and never sends a provider request. It does not claim that this mechanical filter, confidential computation, or protocol routing is a deployed service.

## Meshy provenance

- Text-to-3D generation: `01a10008-dc8a-728f-872f-c0fe3c0afba8`, succeeded, 20 credits.
- Remesh: `01a1000f-f49e-7686-96bf-289c9f962704`, succeeded, 5 credits.
- Total reported cost: 25 credits.
- Project: `/workspace/scratch/c2b959b4375f/meshy_output/20261003_013703_anonyx-privacy-filter_01a10008`.
- Website model: `public/models/privacy-filter.glb` (297,132 bytes, 5,070 triangles, one mesh).
- Preview: `public/models/privacy-filter-preview.png`.
- Model SHA-256: `141c78cc4fdbc2e7bcc7673213bf623e160f87dc3f5f735d6d91dbb9e3482532`.

## Verification

- TypeScript passed.
- GLTFLoader parsed the optimized binary successfully, with finite nonzero bounds.
- Inspected the generated preview and desktop hero layout. Hero entrance animation moves content without hiding it, so throttled animation frames cannot leave its controls invisible.
- Production build passed.
- Browser checks passed for one, zero, and two selected context items. Email remains excluded; a selection change returns the receipt to its review state.
- Pause and rotation controls exercised. Paused receipt animation explicitly disabled so output cannot remain hidden at its opening keyframe.
- Navbar Privacy and footer Privacy Policy both navigated to their corresponding pages; home navigation returned correctly.
- Test browser disables WebGL: verified the fallback experience, not actual GPU rendering. Mobile breakpoints implemented; no mobile viewport visual check available in this browser.
